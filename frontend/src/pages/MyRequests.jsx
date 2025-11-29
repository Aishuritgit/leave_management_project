import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function MyRequests(){
  const [list,setList] = useState([]);
  useEffect(()=> { api.get('/api/leaves/my-requests').then(r=>setList(r.data)).catch(()=>{}); },[]);
  const cancel = async (id)=> {
    if(!confirm('Cancel this request?')) return;
    await api.delete('/api/leaves/'+id);
    setList(list.filter(i=>i._id !== id));
  };
  return (
    <div className="wrap">
      <h2>My Requests</h2>
      {list.map(l=>(
        <div key={l._id} className="card">
          <p><b>{l.leaveType}</b> {new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}</p>
          <p>Status: {l.status}</p>
          <p>Reason: {l.reason}</p>
          {l.status==='pending' && <button onClick={()=>cancel(l._id)}>Cancel</button>}
        </div>
      ))}
    </div>
  );
}
