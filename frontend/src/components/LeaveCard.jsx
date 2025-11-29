import React from "react";

const LeaveCard = ({ leave, onUpdate }) => (
  <div className="leave-card">
    <p><strong>Employee:</strong> {leave.employeeName}</p>
    <p><strong>Type:</strong> {leave.type}</p>
    <p><strong>From:</strong> {leave.startDate}</p>
    <p><strong>To:</strong> {leave.endDate}</p>
    <p><strong>Status:</strong> {leave.status}</p>
    {leave.status === "Pending" && (
      <div>
        <button onClick={() => onUpdate(leave._id, "Approved")}>Approve</button>
        <button onClick={() => onUpdate(leave._id, "Rejected")}>Reject</button>
      </div>
    )}
  </div>
);

export default LeaveCard;
