import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function ApplyLeave(){
  const [leaveType,setLeaveType] = useState('sick');
  const [startDate,setStartDate] = useState('');
  const [endDate,setEndDate] = useState('');
  const [reason,setReason] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/leaves', { leaveType, startDate, endDate, reason });
      alert('Applied');
      nav('/employee/requests');
    } catch(err){ alert(err.response?.data?.msg || 'Failed'); }
  };

  return (
    <div className="center">
      <form onSubmit={submit} className="card">
        <h2>Apply Leave</h2>
        <select value={leaveType} onChange={e=>setLeaveType(e.target.value)}>
          <option value="sick">Sick</option>
          <option value="casual">Casual</option>
          <option value="vacation">Vacation</option>
        </select>
        <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} required />
        <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} required />
        <textarea placeholder="Reason" value={reason} onChange={e=>setReason(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
