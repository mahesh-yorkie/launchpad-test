import React, { useState } from "react";
import { Mark, MarkFormData, Subject } from "../../types";
import { studentApi } from "../../api/students.api";
import { Alert } from "../../utils/alert";

interface Props {
  studentId: string;
  subjects: Subject[];
  existingMark?: Mark | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EMPTY: MarkFormData = {
  subject_id: "",
  marks_obtained: "",
  max_marks: "100",
  exam_type: "final",
  semester: "1",
  academic_year: "",
};

const MarkForm: React.FC<Props> = ({
  studentId,
  subjects,
  existingMark,
  onClose,
  onSuccess,
}) => {
  const isEdit = Boolean(existingMark);
  const currentYear = new Date().getFullYear();
  const [form, setForm] = useState<MarkFormData>(
    existingMark
      ? {
          subject_id: existingMark.subject_id.toString(),
          marks_obtained: existingMark.marks_obtained.toString(),
          max_marks: existingMark.max_marks.toString(),
          exam_type: existingMark.exam_type,
          semester: existingMark.semester.toString(),
          academic_year: existingMark.academic_year,
        }
      : { ...EMPTY, academic_year: `${currentYear}-${currentYear + 1}` }
  );
  const [errors, setErrors] = useState<Partial<MarkFormData>>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const e: Partial<MarkFormData> = {};
    if (!isEdit && !form.subject_id) e.subject_id = "Subject is required";
    const m = parseFloat(form.marks_obtained);
    if (!form.marks_obtained) e.marks_obtained = "Marks are required";
    else if (isNaN(m) || m < 0 || m > 100)
      e.marks_obtained = "Marks must be 0–100";
    if (!form.exam_type) e.exam_type = "Exam type is required";
    if (!form.semester) e.semester = "Semester is required";
    if (!form.academic_year) e.academic_year = "Academic year is required";
    else if (!/^\d{4}-\d{4}$/.test(form.academic_year))
      e.academic_year = "Format: YYYY-YYYY";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof MarkFormData])
      setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    Alert.loading(isEdit ? "Updating mark..." : "Adding mark...");
    setLoading(true);
    try {
      const payload = {
        ...form,
        subject_id: parseInt(form.subject_id),
        marks_obtained: parseFloat(form.marks_obtained),
        max_marks: parseFloat(form.max_marks),
        semester: parseInt(form.semester),
      };
      if (isEdit && existingMark) {
        await studentApi.updateMark(
          studentId,
          existingMark.id,
          payload as unknown as Partial<MarkFormData>
        );
        Alert.close();
        Alert.toast("Mark updated successfully");
      } else {
        await studentApi.addMark(studentId, payload as unknown as MarkFormData);
        Alert.close();
        Alert.toast("Mark added successfully");
      }
      onSuccess();
    } catch (err) {
      Alert.close();
      Alert.error(
        "Error",
        err instanceof Error ? err.message : "Failed to save mark"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              {isEdit ? "✏️ Edit Mark" : "📝 Add Mark"}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            />
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body p-4">
              {!isEdit && (
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Subject <span className="text-danger">*</span>
                  </label>
                  <select
                    name="subject_id"
                    value={form.subject_id}
                    onChange={handleChange}
                    className={`form-select ${errors.subject_id ? "is-invalid" : ""}`}
                  >
                    <option value="">Select subject</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                  {errors.subject_id && (
                    <div className="invalid-feedback">{errors.subject_id}</div>
                  )}
                </div>
              )}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Marks Obtained <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    name="marks_obtained"
                    value={form.marks_obtained}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    className={`form-control ${errors.marks_obtained ? "is-invalid" : ""}`}
                    placeholder="0–100"
                  />
                  {errors.marks_obtained && (
                    <div className="invalid-feedback">
                      {errors.marks_obtained}
                    </div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Max Marks</label>
                  <input
                    type="number"
                    name="max_marks"
                    value={form.max_marks}
                    onChange={handleChange}
                    min="1"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Exam Type <span className="text-danger">*</span>
                  </label>
                  <select
                    name="exam_type"
                    value={form.exam_type}
                    onChange={handleChange}
                    className={`form-select ${errors.exam_type ? "is-invalid" : ""}`}
                  >
                    <option value="midterm">Midterm</option>
                    <option value="final">Final</option>
                    <option value="quiz">Quiz</option>
                    <option value="assignment">Assignment</option>
                  </select>
                  {errors.exam_type && (
                    <div className="invalid-feedback">{errors.exam_type}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Semester <span className="text-danger">*</span>
                  </label>
                  <select
                    name="semester"
                    value={form.semester}
                    onChange={handleChange}
                    className={`form-select ${errors.semester ? "is-invalid" : ""}`}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                  {errors.semester && (
                    <div className="invalid-feedback">{errors.semester}</div>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Academic Year <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="academic_year"
                  value={form.academic_year}
                  onChange={handleChange}
                  placeholder="e.g. 2024-2025"
                  className={`form-control ${errors.academic_year ? "is-invalid" : ""}`}
                />
                {errors.academic_year && (
                  <div className="invalid-feedback">{errors.academic_year}</div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving...
                  </>
                ) : isEdit ? (
                  "Update Mark"
                ) : (
                  "Add Mark"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MarkForm;
