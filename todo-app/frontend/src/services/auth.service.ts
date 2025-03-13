import axios from 'axios';
import { useRouter } from 'next/router';
import { loggingService } from './logging.service';

const API_URL = 'http://localhost:3001';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  access_token: string;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    // Check for token in localStorage on initialization
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        this.token = savedToken;
      }
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    return this.token;
  }

  removeToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Attempting login with:', credentials);
      loggingService.logRequest('POST', `${API_URL}/auth/login`, {}, credentials);
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, credentials);
      console.log('Login response:', response.data);
      loggingService.logResponse('POST', `${API_URL}/auth/login`, response.status, response.data);
      this.setToken(response.data.access_token);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      loggingService.logError('POST', `${API_URL}/auth/login`, error);
      throw error;
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log('Attempting registration with:', data);
      loggingService.logRequest('POST', `${API_URL}/auth/register`, {}, data);
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, data);
      console.log('Registration response:', response.data);
      loggingService.logResponse('POST', `${API_URL}/auth/register`, response.status, response.data);
      this.setToken(response.data.access_token);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      loggingService.logError('POST', `${API_URL}/auth/register`, error);
      throw error;
    }
  }

  logout() {
    this.removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const authService = new AuthService(); 