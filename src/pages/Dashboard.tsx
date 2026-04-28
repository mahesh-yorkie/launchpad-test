import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { studentApi } from "../api/students.api";
import { Student } from "../types";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [recent, setRecent] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [all, active] = await Promise.all([
          studentApi.getAll({
            limit: 5,
            page: 1,
            sortBy: "created_at",
            sortOrder: "DESC",
          }),
          studentApi.getAll({ limit: 1, page: 1, is_active: true }),
        ]);
        setStats({
          total: all.meta?.total || 0,
          active: active.meta?.total || 0,
          inactive: (all.meta?.total || 0) - (active.meta?.total || 0),
        });
        setRecent(all.data || []);
      } catch {
        /* no-op */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Dashboard</h2>
          <small className="text-muted">Student Management Overview</small>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/students/new")}
        >
          + Add Student
        </button>
      </div>

      {/* Stat Cards */}
      <div className="row g-4 mb-4">
        {[
          {
            label: "Total Students",
            value: stats.total,
            icon: "🎓",
            color: "primary",
            link: "/students",
          },
          {
            label: "Active Students",
            value: stats.active,
            icon: "✅",
            color: "success",
            link: "/students?is_active=true",
          },
          {
            label: "Inactive Students",
            value: stats.inactive,
            icon: "⏸",
            color: "secondary",
            link: "/students?is_active=false",
          },
        ].map((card) => (
          <div key={card.label} className="col-md-4">
            <div
              className={`card border-0 shadow-sm border-start border-4 border-${card.color} h-100`}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(card.link)}
            >
              <div className="card-body d-flex align-items-center gap-3 p-4">
                <div className="fs-1">{card.icon}</div>
                <div>
                  <div className={`fw-bold fs-2 text-${card.color}`}>
                    {card.value}
                  </div>
                  <div className="text-muted">{card.label}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Students */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent d-flex justify-content-between align-items-center py-3">
          <h5 className="mb-0 fw-bold">🕐 Recently Added Students</h5>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => navigate("/students")}
          >
            View All →
          </button>
        </div>
        <div className="card-body p-0">
          {recent.length === 0 ? (
            <div className="text-center py-5">
              <div className="display-1 mb-3">🎓</div>
              <p className="text-muted">No students added yet.</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/students/new")}
              >
                Add Your First Student
              </button>
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {recent.map((s) => (
                <div
                  key={s.id}
                  className="list-group-item list-group-item-action d-flex align-items-center gap-3 py-3 px-4"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/students/${s.id}`)}
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                    style={{
                      width: 42,
                      height: 42,
                      fontSize: 14,
                      background: `hsl(${(s.first_name.charCodeAt(0) * 15) % 360}, 60%, 50%)`,
                    }}
                  >
                    {s.first_name[0]}
                    {s.last_name[0]}
                  </div>
                  <div className="flex-fill">
                    <div className="fw-semibold">
                      {s.first_name} {s.last_name}
                    </div>
                    <small className="text-muted">{s.email}</small>
                  </div>
                  {s.department_name && (
                    <span className="badge bg-light text-dark border">
                      {s.department_code}
                    </span>
                  )}
                  <span
                    className={`badge rounded-pill ${s.is_active ? "bg-success" : "bg-secondary"}`}
                  >
                    {s.is_active ? "Active" : "Inactive"}
                  </span>
                  {s.average_marks != null && (
                    <span className="text-muted small">{s.average_marks}%</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Help */}
      <div className="row g-3 mt-2">
        {[
          {
            icon: "➕",
            title: "Add Students",
            desc: "Create new student profiles with complete information.",
            btn: "Add Student",
            path: "/students/new",
            color: "primary",
          },
          {
            icon: "📋",
            title: "Manage Records",
            desc: "View, edit, search and filter all student records.",
            btn: "View Students",
            path: "/students",
            color: "success",
          },
          {
            icon: "📊",
            title: "Track Marks",
            desc: "Add and manage academic marks for each student.",
            btn: "View Students",
            path: "/students",
            color: "info",
          },
        ].map((item) => (
          <div key={item.title} className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center p-4">
                <div className="fs-1 mb-2">{item.icon}</div>
                <h6 className="fw-bold">{item.title}</h6>
                <p className="text-muted small">{item.desc}</p>
                <button
                  className={`btn btn-${item.color} btn-sm`}
                  onClick={() => navigate(item.path)}
                >
                  {item.btn}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
