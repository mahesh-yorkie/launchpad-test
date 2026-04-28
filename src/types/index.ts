export interface Department {
  id: number;
  name: string;
  code: string;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  credits: number;
  department_id?: number;
  department_name?: string;
}

export interface Mark {
  id: number;
  student_id: string;
  subject_id: number;
  subject_name?: string;
  subject_code?: string;
  marks_obtained: number;
  max_marks: number;
  exam_type: "midterm" | "final" | "quiz" | "assignment";
  semester: number;
  academic_year: string;
  grade: string;
}

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  department_id?: number;
  department_name?: string;
  department_code?: string;
  enrollment_year: number;
  is_active: boolean;
  marks?: Mark[];
  average_marks?: number;
  total_subjects?: number;
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: unknown[];
}

export interface StudentFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  address: string;
  department_id: string;
  enrollment_year: string;
}

export interface MarkFormData {
  subject_id: string;
  marks_obtained: string;
  max_marks: string;
  exam_type: string;
  semester: string;
  academic_year: string;
}

export interface StudentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  department_id?: number;
  is_active?: boolean;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}
