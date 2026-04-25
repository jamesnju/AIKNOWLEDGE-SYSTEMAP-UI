import api from './api';
import { Content, ApiResponse, CreateContentData } from '../types';

export const contentService = {
  async getAllContent(filters?: {
    cropType?: string;
    pestType?: string;
    type?: string;
    search?: string;
  }): Promise<ApiResponse<Content[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const response = await api.get(`/content?${params.toString()}`);
    return response.data;
  },

  async getContentById(id: string): Promise<ApiResponse<Content>> {
    const response = await api.get(`/content/${id}`);
    return response.data;
  },

  async createContent(data: CreateContentData): Promise<ApiResponse<Content>> {
    const response = await api.post('/content', data);
    return response.data;
  },

  async updateContent(id: string, data: Partial<CreateContentData>): Promise<ApiResponse<Content>> {
    const response = await api.put(`/content/${id}`, data);
    return response.data;
  },

  async deleteContent(id: string): Promise<ApiResponse> {
    const response = await api.delete(`/content/${id}`);
    return response.data;
  },

  async addComment(contentId: string, text: string, farmerName: string): Promise<ApiResponse> {
    const response = await api.post(`/content/${contentId}/comments`, { text, farmerName });
    return response.data;
  },

  async uploadFile(file: File, type: 'IMAGE' | 'VIDEO', folder?: string): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    if (folder) formData.append('folder', folder);
    
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};