import React, { useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContextProvider';
import { useSearchParams } from 'react-router-dom';

const AuthCallback: React.FC = () => {
  const { login } = useAppContext();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    
    if (error) {
      console.error('OAuth error:', error);
      // Перенаправляем на главную страницу с ошибкой
      window.location.href = '/?error=oauth_failed';
      return;
    }
    
    if (token) {
      // Сохраняем токен в localStorage
      localStorage.setItem('auth_token', token);
      
      // Получаем информацию о пользователе с сервера
      fetchUserProfile(token);
    } else {
      // Если токена нет, перенаправляем на главную страницу
      window.location.href = '/';
    }
  }, [searchParams]);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        login({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          plan: userData.plan,
          remainingGenerations: userData.remainingGenerations,
        });
        
        // Перенаправляем на главную страницу
        window.location.href = '/';
      } else {
        console.error('Failed to fetch user profile');
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Завершение авторизации...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
