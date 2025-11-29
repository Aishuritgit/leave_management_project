import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function ManagerDashboard(){
  const [pending, setPending] = useState([]);
  useEffect(()=> { api.get('/api/leaves/pending').then(r=>setPending(r.data)).catch(()=>{}); },[]);
  const decide = async (id, action) => {
    const comment = prompt('Add manager comment (optional)');
    await api.put('/api/leaves/'+id+'/'+action, { managerComment: comment });
    setPending(pending.filter(p=>p._id !== id));
  };
  return (
    <div className="wrap">
      <h2>Manager - Pending Requests</h2>
      {pending.map(p=>(
        <div key={p._id} className="card">
          <p><b>{p.leaveType}</b> by {p.userId?.name || p.userId} ({new Date(p.startDate).toLocaleDateString()} - {new Date(p.endDate).toLocaleDateString()})</p>
          <p>Reason: {p.reason}</p>
          <button onClick={()=>decide(p._id,'approve')}>Approve</button>
          <button onClick={()=>decide(p._id,'reject')}>Reject</button>
        </div>
      ))}
    </div>
  );
}
