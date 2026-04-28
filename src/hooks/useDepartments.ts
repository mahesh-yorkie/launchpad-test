import { useState, useEffect } from "react";
import { Department, Subject } from "../types";
import { departmentApi } from "../api/departments.api";

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [deptRes, subjRes] = await Promise.all([
          departmentApi.getAll(),
          departmentApi.getSubjects(),
        ]);
        setDepartments(deptRes.data || []);
        setSubjects(subjRes.data || []);
      } catch (error) {
        // silent fail – departments are non-critical
        console.log("🥳 ~ useDepartments.ts:21 ~ load ~ error:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { departments, subjects, loading };
};
