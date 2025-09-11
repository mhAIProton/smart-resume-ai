import { useState, useCallback } from 'react';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
    showToast?: boolean;
  }
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiFunction(...args);
      setState({ data: result, loading: false, error: null });
      
      if (options?.onSuccess) {
        options.onSuccess(result);
      }
      
      if (options?.showToast !== false) {
        toast.success('Operation completed successfully!');
      }
      
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      
      if (options?.onError) {
        options.onError(errorMessage);
      }
      
      if (options?.showToast !== false) {
        toast.error(errorMessage);
      }
      
      return null;
    }
  }, [apiFunction, options]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Специализированные хуки для конкретных API вызовов
export function useGenerateResume() {
  return useApi(apiService.generateResume.bind(apiService), {
    showToast: false, // Показываем toast вручную в компоненте
  });
}

export function useGenerateCoverLetter() {
  return useApi(apiService.generateCoverLetter.bind(apiService), {
    showToast: false, // Показываем toast вручную в компоненте
  });
}

export function useUploadFile() {
  return useApi(apiService.uploadFile.bind(apiService), {
    showToast: false, // Показываем toast вручную в компоненте
  });
}

export function useExtractJobDescription() {
  return useApi(apiService.extractJobDescription.bind(apiService));
}

export function useImproveContent() {
  return useApi(apiService.improveContent.bind(apiService));
}
