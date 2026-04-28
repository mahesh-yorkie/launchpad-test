import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { studentApi } from "../../api/students.api";
import { useDepartments } from "../../hooks/useDepartments";
import { StudentFormData } from "../../types";
import { Alert } from "../../utils/alert";
import LoadingSpinner from "../common/LoadingSpinner";

const EMPTY_FORM: StudentFormData = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  date_of_birth: "",
  gender: "",
  address: "",
  department_id: "",
  enrollment_year: "",
};

const StudentForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { departments } = useDepartments();
  const [form, setForm] = useState<StudentFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<StudentFormData>>({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await studentApi.getById(id);
        const s = res.data!;
        setForm({
          first_name: s.first_name,
          last_name: s.last_name,
          email: s.email,
          phone: s.phone || "",
          date_of_birth: s.date_of_birth ? s.date_of_birth.split("T")[0] : "",
          gender: s.gender || "",
          address: s.address || "",
          department_id: s.department_id?.toString() || "",
          enrollment_year: s.enrollment_year.toString(),
        });
      } catch {
        Alert.error("Error", "Failed to load student data");
        navigate("/students");
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id, navigate]);

  const validate = (): boolean => {
    const newErrors: Partial<StudentFormData> = {};
    if (!form.first_name.trim())
      newErrors.first_name = "First name is required";
    else if (form.first_name.length < 2)
      newErrors.first_name = "At least 2 characters";
    if (!form.last_name.trim()) newErrors.last_name = "Last name is required";
    else if (form.last_name.length < 2)
      newErrors.last_name = "At least 2 characters";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email format";
    if (form.phone && !/^\+?[\d\s\-()]{7,20}$/.test(form.phone))
      newErrors.phone = "Invalid phone number";
    if (form.enrollment_year) {
      const yr = parseInt(form.enrollment_year);
      if (yr < 1900 || yr > new Date().getFullYear() + 1)
        newErrors.enrollment_year = "Invalid year";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof StudentFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    Alert.loading(isEdit ? "Updating student..." : "Creating student...");
    setLoading(true);

    const payload: Record<string, unknown> = { ...form };
    // Clean empty optionals
    ["phone", "date_of_birth", "gender", "address"].forEach((k) => {
      if (!payload[k]) delete payload[k];
    });
    if (payload.department_id)
      payload.department_id = parseInt(payload.department_id as string);
    else delete payload.department_id;
    if (payload.enrollment_year)
      payload.enrollment_year = parseInt(payload.enrollment_year as string);
    else delete payload.enrollment_year;

    try {
      if (isEdit) {
        await studentApi.update(
          id!,
          payload as unknown as Partial<StudentFormData>
        );
        Alert.close();
        Alert.success("Updated!", "Student has been updated successfully.");
      } else {
        const res = await studentApi.create(
          payload as unknown as Partial<StudentFormData>
        );
        Alert.close();
        Alert.success("Created!", "Student has been added successfully.");
        // navigate(`/students/${res.data?.id}`);
        navigate("/students");
        return;
      }
      navigate("/students");
    } catch (err) {
      Alert.close();
      const msg = err instanceof Error ? err.message : "Operation failed";
      Alert.error("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner text="Loading student data..." />;

  const inp = (
    name: keyof StudentFormData,
    label: string,
    type = "text",
    required = false
  ) => (
    <div className="mb-3">
      <label className="form-label fw-semibold">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        className={`form-control ${errors[name] ? "is-invalid" : ""}`}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white py-3">
              <h4 className="mb-0 fw-bold">
                {isEdit ? "✏️ Edit Student" : "➕ Add New Student"}
              </h4>
              <small className="opacity-75">
                {isEdit
                  ? "Update student information below"
                  : "Fill in the details to create a new student record"}
              </small>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit} noValidate>
                <div className="row">
                  <div className="col-md-6">
                    {inp("first_name", "First Name", "text", true)}
                  </div>
                  <div className="col-md-6">
                    {inp("last_name", "Last Name", "text", true)}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    {inp("email", "Email Address", "email", true)}
                  </div>
                  <div className="col-md-6">
                    {inp("phone", "Phone Number", "tel")}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    {inp("date_of_birth", "Date of Birth", "date")}
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Gender</label>
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Department
                      </label>
                      <select
                        name="department_id"
                        value={form.department_id}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Select department</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    {inp("enrollment_year", "Enrollment Year", "number")}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Address</label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="form-control"
                    rows={3}
                    placeholder="Enter full address"
                  />
                </div>
                <hr />
                <div className="d-flex gap-2 justify-content-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={() => navigate("/students")}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Saving...
                      </>
                    ) : isEdit ? (
                      "💾 Update Student"
                    ) : (
                      "✅ Create Student"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;
