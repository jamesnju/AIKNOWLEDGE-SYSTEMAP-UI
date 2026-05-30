import api from './api';
import { ApiResponse } from '../types';

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  displayOrder: number;
  isActive: boolean;
  adminId: string;
  createdAt: string;
  updatedAt: string;
  admin?: {
    name: string;
    email: string;
  };
}

export interface CreateFeatureData {
  title: string;
  description: string;
  icon: string;
  color: string;
  imageUrl?: string;
  imagePublicId?: string;
  displayOrder?: number;
}

export const featureService = {
  // Get all features (public)
  async getAllFeatures(activeOnly?: boolean): Promise<ApiResponse<Feature[]>> {
    const params = activeOnly ? '?isActive=true' : '';
    const response = await api.get(`/features${params}`);
    return response.data;
  },

  // Get single feature
  async getFeatureById(id: string): Promise<ApiResponse<Feature>> {
    const response = await api.get(`/features/${id}`);
    return response.data;
  },

  // Create feature (admin only)
  async createFeature(data: CreateFeatureData): Promise<ApiResponse<Feature>> {
    const response = await api.post('/features', data);
    return response.data;
  },

  // Update feature (admin only)
 async updateFeature(id: string, data: UpdateFeatureData): Promise<ApiResponse<Feature>> {
  const response = await api.put(`/features/${id}`, data);
  return response.data;
},

  // Delete feature (admin only)
  async deleteFeature(id: string): Promise<ApiResponse> {
    const response = await api.delete(`/features/${id}`);
    return response.data;
  },

  // Reorder features (admin only)
  async reorderFeatures(features: { id: string; displayOrder: number }[]): Promise<ApiResponse> {
    const response = await api.post('/features/reorder', { features });
    return response.data;
  }
};
export interface UpdateFeatureData extends Partial<CreateFeatureData> {
  isActive?: boolean;
}