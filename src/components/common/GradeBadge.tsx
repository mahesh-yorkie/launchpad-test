import React from "react";

interface Props {
  grade: string;
}

const gradeColors: Record<string, string> = {
  "A+": "success",
  A: "success",
  "B+": "info",
  B: "primary",
  C: "warning",
  D: "secondary",
  F: "danger",
};

const GradeBadge: React.FC<Props> = ({ grade }) => (
  <span
    className={`badge bg-${gradeColors[grade] || "secondary"} rounded-pill`}
  >
    {grade}
  </span>
);

export default GradeBadge;
