import React from "react";

interface Props {
  text?: string;
}

const LoadingSpinner: React.FC<Props> = ({ text = "Loading..." }) => (
  <div className="d-flex justify-content-center align-items-center py-5">
    <div className="text-center">
      <div
        className="spinner-border text-primary mb-3"
        role="status"
        style={{ width: "3rem", height: "3rem" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted mb-0">{text}</p>
    </div>
  </div>
);

export default LoadingSpinner;
