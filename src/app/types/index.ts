export interface Admin {
  id: string;
  email: string;
  name: string;
  role?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  id: string;
  text: string;
  farmerName: string;
  createdAt: string;
  contentId: string;
}

export interface Content {
  id: string;
  title: string;
  description: string;
  type: 'IMAGE' | 'VIDEO';
  url: string;
  publicId: string;
  thumbnail?: string | null;
  cropType: string;
  pestType: string;
  views: number;
  adminId: string;
  createdAt: string;
  updatedAt: string;
  admin?: {
    name: string;
    email: string;
  };
  comments?: Comment[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface CreateContentData {
  title: string;
  description: string;
  type: 'IMAGE' | 'VIDEO';
  url: string;
  publicId: string;
  thumbnail?: string;
  cropType: string;
  pestType: string;
}