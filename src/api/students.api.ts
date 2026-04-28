import apiClient from './client';
import { ApiResponse, Student, StudentQueryParams, MarkFormData, StudentFormData } from '../types';

export const studentApi = {
  getAll: async (params: StudentQueryParams = {}): Promise<ApiResponse<Student[]>> => {
    const response = await apiClient.get('/students', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Student>> => {
    const response = await apiClient.get(`/students/${id}`);
    return response.data;
  },

  create: async (data: Partial<StudentFormData>): Promise<ApiResponse<Student>> => {
    const response = await apiClient.post('/students', data);
    return response.data;
  },

  update: async (id: string, data: Partial<StudentFormData>): Promise<ApiResponse<Student>> => {
    const response = await apiClient.put(`/students/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/students/${id}`);
    return response.data;
  },

  addMark: async (studentId: string, data: MarkFormData): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.post(`/students/${studentId}/marks`, data);
    return response.data;
  },

  updateMark: async (studentId: string, markId: number, data: Partial<MarkFormData>): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.put(`/students/${studentId}/marks/${markId}`, data);
    return response.data;
  },

  deleteMark: async (studentId: string, markId: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/students/${studentId}/marks/${markId}`);
    return response.data;
  },
};
