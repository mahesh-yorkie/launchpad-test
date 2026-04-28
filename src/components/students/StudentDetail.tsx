import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { studentApi } from "../../api/students.api";
import { useDepartments } from "../../hooks/useDepartments";
import { Student, Mark } from "../../types";
import { Alert } from "../../utils/alert";
import LoadingSpinner from "../common/LoadingSpinner";
import GradeBadge from "../common/GradeBadge";
import MarkForm from "./MarkForm";

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { subjects } = useDepartments();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [editingMark, setEditingMark] = useState<Mark | null>(null);

  const loadStudent = async () => {
    if (!id) return;
    try {
      const res = await studentApi.getById(id);
      setStudent(res.data!);
    } catch {
      Alert.error("Error", "Failed to load student");
      navigate("/students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudent();
  }, [id]);

  const handleDeleteMark = async (markId: number) => {
    const result = await Alert.confirm("Delete this mark?");
    if (!result.isConfirmed) return;
    Alert.loading("Deleting...");
    try {
      await studentApi.deleteMark(id!, markId);
      Alert.close();
      Alert.toast("Mark deleted");
      loadStudent();
    } catch (err) {
      Alert.close();
      Alert.error("Error", err instanceof Error ? err.message : "Failed");
    }
  };

  if (loading) return <LoadingSpinner text="Loading student details..." />;
  if (!student) return null;

  const dob = student.date_of_birth
    ? new Date(student.date_of_birth).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="container py-4">
      {showMarkModal && (
        <MarkForm
          studentId={id!}
          subjects={subjects}
          existingMark={editingMark}
          onClose={() => {
            setShowMarkModal(false);
            setEditingMark(null);
          }}
          onSuccess={() => {
            setShowMarkModal(false);
            setEditingMark(null);
            loadStudent();
          }}
        />
      )}

      {/* Back button */}
      <button
        className="btn btn-link text-decoration-none ps-0 mb-3"
        onClick={() => navigate("/students")}
      >
        ← Back to Students
      </button>

      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div
                className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center text-white"
                style={{
                  width: 80,
                  height: 80,
                  fontSize: 28,
                  fontWeight: 700,
                  background: `hsl(${(student.first_name.charCodeAt(0) * 15) % 360}, 60%, 50%)`,
                }}
              >
                {student.first_name[0]}
                {student.last_name[0]}
              </div>
              <h4 className="fw-bold mb-1">
                {student.first_name} {student.last_name}
              </h4>
              <p className="text-muted mb-2">{student.email}</p>
              {student.department_name && (
                <span className="badge bg-primary-subtle text-primary mb-3">
                  {student.department_name}
                </span>
              )}
              <div
                className={`badge rounded-pill ${student.is_active ? "bg-success" : "bg-secondary"} d-block mb-4`}
              >
                {student.is_active ? "Active Student" : "Inactive"}
              </div>

              <div className="text-start">
                {[
                  ["📞", "Phone", student.phone || "—"],
                  ["🎂", "Date of Birth", dob],
                  [
                    "⚥",
                    "Gender",
                    student.gender
                      ? student.gender.charAt(0).toUpperCase() +
                        student.gender.slice(1)
                      : "—",
                  ],
                  ["📅", "Enrolled", student.enrollment_year],
                  ["📍", "Address", student.address || "—"],
                ].map(([icon, label, value]) => (
                  <div key={String(label)} className="d-flex gap-2 mb-2">
                    <span>{icon}</span>
                    <div>
                      <small
                        className="text-muted d-block"
                        style={{ lineHeight: 1.2 }}
                      >
                        {label}
                      </small>
                      <small className="fw-semibold">{String(value)}</small>
                    </div>
                  </div>
                ))}
              </div>

              <hr />
              <div className="d-flex gap-2">
                <button
                  className="btn btn-warning btn-sm flex-fill"
                  onClick={() => navigate(`/students/${id}/edit`)}
                >
                  ✏️ Edit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Marks & Stats */}
        <div className="col-lg-8">
          {/* Stats row */}
          <div className="row g-3 mb-4">
            {[
              {
                label: "Average Marks",
                value:
                  student.average_marks != null
                    ? `${student.average_marks}%`
                    : "—",
                color: "primary",
                icon: "📊",
              },
              {
                label: "Subjects",
                value: student.total_subjects ?? 0,
                color: "success",
                icon: "📚",
              },
              {
                label: "Marks Records",
                value: student.marks?.length ?? 0,
                color: "info",
                icon: "📝",
              },
            ].map((stat) => (
              <div key={stat.label} className="col-md-4">
                <div className={`card border-0 bg-${stat.color}-subtle`}>
                  <div className="card-body text-center py-3">
                    <div className="fs-3 mb-1">{stat.icon}</div>
                    <div className={`fw-bold fs-4 text-${stat.color}`}>
                      {stat.value}
                    </div>
                    <small className="text-muted">{stat.label}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Marks Table */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0 fw-bold">📋 Academic Marks</h5>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setEditingMark(null);
                  setShowMarkModal(true);
                }}
              >
                + Add Mark
              </button>
            </div>
            <div className="card-body p-0">
              {!student.marks || student.marks.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-3">No marks recorded yet.</p>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setShowMarkModal(true)}
                  >
                    Add First Mark
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Subject</th>
                        <th>Exam Type</th>
                        <th>Semester</th>
                        <th>Marks</th>
                        <th>Grade</th>
                        <th>Year</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {student.marks.map((mark) => (
                        <tr key={mark.id}>
                          <td>
                            <div className="fw-semibold small">
                              {mark.subject_name}
                            </div>
                            <small className="text-muted">
                              {mark.subject_code}
                            </small>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border text-capitalize">
                              {mark.exam_type}
                            </span>
                          </td>
                          <td>Sem {mark.semester}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div
                                className="progress flex-fill"
                                style={{ height: 6, width: 60 }}
                              >
                                <div
                                  className={`progress-bar ${Number(mark.marks_obtained) >= 70 ? "bg-success" : Number(mark.marks_obtained) >= 50 ? "bg-warning" : "bg-danger"}`}
                                  style={{ width: `${mark.marks_obtained}%` }}
                                />
                              </div>
                              <small className="fw-bold">
                                {mark.marks_obtained}/{mark.max_marks}
                              </small>
                            </div>
                          </td>
                          <td>
                            <GradeBadge grade={mark.grade} />
                          </td>
                          <td>
                            <small>{mark.academic_year}</small>
                          </td>
                          <td>
                            <div className="d-flex gap-1 justify-content-end">
                              <button
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => {
                                  setEditingMark(mark);
                                  setShowMarkModal(true);
                                }}
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteMark(mark.id)}
                                title="Delete"
                              >
                                🗑
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
