import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function EmployeeDashboard(){
  const [data,setData] = useState(null);
  useEffect(()=> {
    api.get('/api/dashboard/employee').then(r=>setData(r.data)).catch(()=>{});
  },[]);
  return (
    <div className="wrap">
      <h2>Employee Dashboard</h2>
      <div className="card">
        <p>Total requests: {data?.total ?? '-'}</p>
        <p>Pending: {data?.pending ?? '-'}</p>
        <p>Approved: {data?.approved ?? '-'}</p>
        <p>Balance - Sick: {data?.balance?.sickLeave ?? '-'}, Casual: {data?.balance?.casualLeave ?? '-'}, Vacation: {data?.balance?.vacation ?? '-'}</p>
        <Link to="/employee/apply">Apply Leave</Link> | <Link to="/employee/requests">My Requests</Link>
      </div>
    </div>
  );
}
