import { useState, useCallback } from "react";
import { Student, PaginationMeta, StudentQueryParams } from "../types";
import { studentApi } from "../api/students.api";
import { Alert } from "../utils/alert";

const DEFAULT_META: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false,
};

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async (params: StudentQueryParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await studentApi.getAll(params);
      setStudents(response.data || []);
      setMeta(response.meta || DEFAULT_META);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to fetch students";
      setError(msg);
      Alert.toast(msg, "error");
      console.log("🥳 ~ useStudents.ts:29 ~ useStudents ~ err:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteStudent = useCallback(
    async (id: string, onSuccess?: () => void) => {
      const result = await Alert.confirm(
        "Delete this student?",
        "All marks will also be deleted."
      );
      if (!result.isConfirmed) return;

      Alert.loading("Deleting student...");
      try {
        await studentApi.delete(id);
        Alert.close();
        Alert.success("Deleted!", "Student has been deleted.");
        onSuccess?.();
      } catch (err) {
        Alert.close();
        const msg =
          err instanceof Error ? err.message : "Failed to delete student";
        Alert.error("Error", msg);
        console.log("🥳 ~ useStudents.ts:54 ~ useStudents ~ err:", err);
      }
    },
    []
  );

  return { students, meta, loading, error, fetchStudents, deleteStudent };
};
