import axios, { AxiosInstance, AxiosResponse } from 'axios';

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
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // 30 секунд для генерации контента
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Добавляем токен авторизации к каждому запросу
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
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
      (error) => {
        if (error.response?.status === 401) {
          // Токен недействителен, удаляем его
          localStorage.removeItem('auth_token');
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );
  }

  // Методы авторизации
  async getProfile(): Promise<UserProfile> {
    const response = await this.api.get<ApiResponse<UserProfile>>('/auth/me');
    return response.data.data;
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/refresh');
    return response.data.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
    localStorage.removeItem('auth_token');
  }

  // Методы для работы с генерацией контента
  async generateContent(request: GenerationRequest): Promise<GenerationResponse> {
    const response = await this.api.post<ApiResponse<GenerationResponse>>('/generations', request);
    return response.data.data;
  }

  async getGenerations(): Promise<GenerationResponse[]> {
    const response = await this.api.get<ApiResponse<GenerationResponse[]>>('/generations');
    return response.data.data;
  }

  async getGeneration(id: string): Promise<GenerationResponse> {
    const response = await this.api.get<ApiResponse<GenerationResponse>>(`/generations/${id}`);
    return response.data.data;
  }

  async regenerateGeneration(id: string): Promise<GenerationResponse> {
    const response = await this.api.post<ApiResponse<GenerationResponse>>(`/generations/${id}/regenerate`);
    return response.data.data;
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
    const response = await this.api.post<ApiResponse<{ content: string }>>('/openai/generate-resume', request);
    return String(response.data.content);
  }

  async generateCoverLetter(request: {
    jobDescription: string;
    tone?: 'formal' | 'friendly' | 'bold';
  }): Promise<string> {
    const response = await this.api.post<ApiResponse<{ content: string }>>('/openai/generate-cover-letter', request);
    return String(response.data.content);
  }

  async extractJobDescription(url: string): Promise<{ content: string }> {
    const response = await this.api.post<ApiResponse<{ content: string }>>('/openai/extract-job-description', { url });
    return response.data.data;
  }

  async improveContent(content: string, type: 'resume' | 'cover_letter'): Promise<{ content: string }> {
    const response = await this.api.post<ApiResponse<{ content: string }>>('/openai/improve-content', { content, type });
    return response.data.data;
  }

  // Метод для загрузки файлов
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.api.post<ApiResponse<{ content: string }>>('/openai/upload-file', formData, {
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
}

// Создаем единственный экземпляр API сервиса
export const apiService = new ApiService();
export default apiService;
