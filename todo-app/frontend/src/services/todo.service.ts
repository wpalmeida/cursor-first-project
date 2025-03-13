import axios from 'axios';
import { authService } from './auth.service';

const API_URL = 'http://localhost:3001';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoDto {
  title: string;
  description?: string;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  completed?: boolean;
}

class TodoService {
  private getAuthHeader() {
    const token = authService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getAll(): Promise<Todo[]> {
    const response = await axios.get<Todo[]>(`${API_URL}/todos`, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  async getById(id: string): Promise<Todo> {
    const response = await axios.get<Todo>(`${API_URL}/todos/${id}`, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  async create(todo: CreateTodoDto): Promise<Todo> {
    const response = await axios.post<Todo>(`${API_URL}/todos`, todo, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  async update(id: string, todo: UpdateTodoDto): Promise<Todo> {
    const response = await axios.patch<Todo>(`${API_URL}/todos/${id}`, todo, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/todos/${id}`, {
      headers: this.getAuthHeader(),
    });
  }
}

export const todoService = new TodoService(); 