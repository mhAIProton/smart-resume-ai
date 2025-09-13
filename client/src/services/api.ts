import axios, { AxiosInstance } from 'axios';
import { loadFromStorage, removeFromStorage, STORAGE_KEYS } from '../utils/chromeStorage';

// Типы для API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  content?: string;
}

export interface GenerationRequest {
  type: 'resume' | 'cover_letter';
  jobDescription: string;
  jobUrl?: string;
  userExperience?: string;
  existingResume?: string;
  tone?: 'formal' | 'friendly' | 'bold';
  design?: 'classic' | 'modern' | 'minimal';
}

export interface GenerationResponse {
  id: string;
  type: 'resume' | 'cover_letter';
  status: 'pending' | 'completed' | 'failed';
  generatedContent?: string;
  createdAt: string;
  completedAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: 'Free' | 'Pro' | 'Premium';
  remainingGenerations: number;
  totalGenerations: number;
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: UserProfile;
}

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // 30 секунд для генерации контента
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Добавляем токен авторизации к каждому запросу
    this.api.interceptors.request.use(
      async (config) => {
        const token = await loadFromStorage(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Обрабатываем ошибки авторизации
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Токен недействителен, удаляем его
          await removeFromStorage(STORAGE_KEYS.AUTH_TOKEN);
          await removeFromStorage(STORAGE_KEYS.USER_DATA);
          // В Chrome расширении не нужно перенаправлять, просто очищаем состояние
          if (typeof window !== 'undefined' && window.location) {
            window.location.reload();
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Методы авторизации
  async getProfile(): Promise<UserProfile> {
    const response = await this.api.get<UserProfile>('/auth/me');
    return response.data;
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/refresh');
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
    await removeFromStorage(STORAGE_KEYS.AUTH_TOKEN);
    await removeFromStorage(STORAGE_KEYS.USER_DATA);
  }

  // Методы для работы с генерацией контента
  async generateContent(request: GenerationRequest): Promise<GenerationResponse> {
    const response = await this.api.post<GenerationResponse>('/generations', request);
    return response.data;
  }

  async getGenerations(): Promise<GenerationResponse[]> {
    const response = await this.api.get<GenerationResponse[]>('/generations');
    return response.data;
  }

  async getGeneration(id: string): Promise<GenerationResponse> {
    const response = await this.api.get<GenerationResponse>(`/generations/${id}`);
    return response.data;
  }

  async regenerateGeneration(id: string): Promise<GenerationResponse> {
    const response = await this.api.post<GenerationResponse>(`/generations/${id}/regenerate`);
    return response.data;
  }

  async deleteGeneration(id: string): Promise<void> {
    await this.api.delete(`/generations/${id}`);
  }

  // Методы для работы с OpenAI
  async generateResume(request: {
    jobDescription: string;
    userExperience?: string;
    existingResume?: string;
    design?: 'classic' | 'modern' | 'minimal';
  }): Promise<string> {
    const response = await this.api.post<{ content: string }>('/openai/generate-resume', request);
    return String(response.data.content);
  }

  async generateCoverLetter(request: {
    jobDescription: string;
    tone?: 'formal' | 'friendly' | 'bold';
  }): Promise<string> {
    const response = await this.api.post<{ content: string }>('/openai/generate-cover-letter', request);
    return String(response.data.content);
  }

  async extractJobDescription(url: string): Promise<{ content: string }> {
    const response = await this.api.post<{ content: string }>('/openai/extract-job-description', { url });
    return response.data;
  }

  async improveContent(content: string, type: 'resume' | 'cover_letter'): Promise<{ content: string }> {
    const response = await this.api.post<{ content: string }>('/openai/improve-content', { content, type });
    return response.data;
  }

  // Метод для загрузки файлов
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.api.post<{ content: string }>('/openai/upload-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return String(response.data.content);
  }

  // Метод для проверки статуса генерации
  async pollGenerationStatus(id: string, maxAttempts: number = 30): Promise<GenerationResponse> {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const generation = await this.getGeneration(id);
      
      if (generation.status === 'completed' || generation.status === 'failed') {
        return generation;
      }
      
      // Ждем 2 секунды перед следующей проверкой
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }
    
    throw new Error('Generation timeout');
  }

  // Методы для работы с Stripe
  async createCheckoutSession(priceId: string): Promise<{ sessionId: string; url: string }> {
    const response = await this.api.post<{ sessionId: string; url: string }>('/stripe/create-checkout-session', {
      priceId,
      successUrl: `${this.baseURL}/stripe/subscription-success`,
      cancelUrl: `${this.baseURL}/stripe/subscription-cancel`,
    });
    return response.data;
  }
}

// Создаем единственный экземпляр API сервиса
export const apiService = new ApiService();
export default apiService;
