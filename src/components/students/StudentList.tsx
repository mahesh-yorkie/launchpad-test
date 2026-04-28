import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useStudents } from "../../hooks/useStudents";
import { useDepartments } from "../../hooks/useDepartments";
import { StudentQueryParams } from "../../types";
import Pagination from "../common/Pagination";
import LoadingSpinner from "../common/LoadingSpinner";

const StudentList: React.FC = () => {
  const navigate = useNavigate();
  const { students, meta, loading, fetchStudents, deleteStudent } =
    useStudents();
  const { departments } = useDepartments();

  const [params, setParams] = useState<StudentQueryParams>({
    page: 1,
    limit: 5,
    search: "",
    sortBy: "created_at",
    sortOrder: "ASC",
  });
  const [searchInput, setSearchInput] = useState("");

  const load = useCallback(() => {
    fetchStudents(params);
  }, [fetchStudents, params]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams((prev) => ({ ...prev, page: 1, search: searchInput }));
  };

  const handleFilter = (key: keyof StudentQueryParams, value: unknown) => {
    setParams((prev) => ({ ...prev, page: 1, [key]: value }));
  };

  const handleSort = (field: string) => {
    setParams((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === "ASC" ? "DESC" : "ASC",
    }));
  };

  const handleDelete = (id: string) => deleteStudent(id, load);

  const sortIcon = (field: string) => {
    if (params.sortBy !== field) return "↕";
    return params.sortOrder === "ASC" ? "↑" : "↓";
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Students</h2>
          <small className="text-muted">{meta.total} total records</small>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/students/new")}
        >
          + Add Student
        </button>
      </div>

      {/* Search & Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <form onSubmit={handleSearch}>
                <label className="form-label small fw-semibold text-muted">
                  SEARCH
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name or email..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <button type="submit" className="btn btn-outline-primary">
                    🔍
                  </button>
                </div>
              </form>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted">
                DEPARTMENT
              </label>
              <select
                className="form-select"
                onChange={(e) =>
                  handleFilter(
                    "department_id",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-semibold text-muted">
                STATUS
              </label>
              <select
                className="form-select"
                onChange={(e) =>
                  handleFilter(
                    "is_active",
                    e.target.value === ""
                      ? undefined
                      : e.target.value === "true"
                  )
                }
              >
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-semibold text-muted">
                PER PAGE
              </label>
              <select
                className="form-select"
                value={params.limit}
                onChange={(e) =>
                  handleFilter("limit", parseInt(e.target.value))
                }
              >
                {[5, 10, 25, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-1">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchInput("");
                  setParams({
                    page: 1,
                    limit: 10,
                    search: "",
                    sortBy: "created_at",
                    sortOrder: "DESC",
                  });
                }}
                title="Clear filters"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <LoadingSpinner />
          ) : students.length === 0 ? (
            <div className="text-center py-5">
              <div className="display-1 mb-3">🎓</div>
              <h5 className="text-muted">No students found</h5>
              <p className="text-muted">
                Try adjusting your search or filters.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/students/new")}
              >
                Add First Student
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: 40 }}>#</th>
                    <th
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSort("first_name")}
                    >
                      Name {sortIcon("first_name")}
                    </th>
                    <th
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSort("email")}
                    >
                      Email {sortIcon("email")}
                    </th>
                    <th>Department</th>
                    <th
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSort("enrollment_year")}
                    >
                      Year {sortIcon("enrollment_year")}
                    </th>
                    <th>Avg. Marks</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => (
                    <tr key={student.id}>
                      <td className="text-muted small">
                        {(meta.page - 1) * meta.limit + idx + 1}
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                            style={{
                              width: 36,
                              height: 36,
                              fontSize: 13,
                              background: `hsl(${(student.first_name.charCodeAt(0) * 15) % 360}, 60%, 50%)`,
                              flexShrink: 0,
                            }}
                          >
                            {student.first_name[0]}
                            {student.last_name[0]}
                          </div>
                          <div>
                            <div className="fw-semibold">
                              {student.first_name} {student.last_name}
                            </div>
                            {student.phone && (
                              <small className="text-muted">
                                {student.phone}
                              </small>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <small>{student.email}</small>
                      </td>
                      <td>
                        {student.department_name ? (
                          <span className="badge bg-light text-dark border">
                            {student.department_code}
                          </span>
                        ) : (
                          <span className="text-muted small">—</span>
                        )}
                      </td>
                      <td>{student.enrollment_year}</td>
                      <td>
                        {student.average_marks !== undefined &&
                        student.average_marks !== null ? (
                          <div>
                            <div
                              className="progress mb-1"
                              style={{ height: 4, width: 80 }}
                            >
                              <div
                                className={`progress-bar ${Number(student.average_marks) >= 70 ? "bg-success" : Number(student.average_marks) >= 50 ? "bg-warning" : "bg-danger"}`}
                                style={{ width: `${student.average_marks}%` }}
                              />
                            </div>
                            <small className="fw-semibold">
                              {student.average_marks}%
                            </small>
                          </div>
                        ) : (
                          <small className="text-muted">No marks</small>
                        )}
                      </td>
                      <td>
                        <span
                          className={`badge rounded-pill ${student.is_active ? "bg-success-subtle text-success" : "bg-secondary-subtle text-secondary"}`}
                        >
                          {student.is_active ? "● Active" : "○ Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1 justify-content-end">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => navigate(`/students/${student.id}`)}
                            title="View Details"
                          >
                            👁
                          </button>
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() =>
                              navigate(`/students/${student.id}/edit`)
                            }
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(student.id)}
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
        {!loading && students.length > 0 && (
          <div className="card-footer bg-transparent px-4 py-3">
            <Pagination
              meta={meta}
              onPageChange={(p) => setParams((prev) => ({ ...prev, page: p }))}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;
