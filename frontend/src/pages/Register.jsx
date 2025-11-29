import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/auth/register', { name, email, password, role: 'employee' });
      alert('Registered, please login');
      nav('/login');
    } catch(err){ alert(err.response?.data?.msg || 'Registration failed'); }
  };

  return (
    <div className="center">
      <form onSubmit={submit} className="card">
        <h2>Register</h2>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
