import apiClient from './client';
import { ApiResponse, Department, Subject } from '../types';

export const departmentApi = {
  getAll: async (): Promise<ApiResponse<Department[]>> => {
    const response = await apiClient.get('/departments');
    return response.data;
  },

  getSubjects: async (): Promise<ApiResponse<Subject[]>> => {
    const response = await apiClient.get('/departments/subjects');
    return response.data;
  },
};
