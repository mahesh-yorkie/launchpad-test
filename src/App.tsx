import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Navbar from "./components/common/Navbar";
import Dashboard from "./pages/Dashboard";
import StudentList from "./components/students/StudentList";
import StudentDetail from "./components/students/StudentDetail";
import StudentForm from "./components/students/StudentForm";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-vh-100 bg-light">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/students/new" element={<StudentForm />} />
            <Route path="/students/:id" element={<StudentDetail />} />
            <Route path="/students/:id/edit" element={<StudentForm />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="text-center py-3 text-muted small border-top mt-4 bg-white">
          Student Management System &copy; {new Date().getFullYear()} — Built
          with Node.js, PostgreSQL &amp; React
        </footer>
      </div>
    </Router>
  );
};

export default App;
