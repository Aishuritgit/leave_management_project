import React, { useState } from 'react';
import api from '../api/axios';
import { useDispatch } from 'react-redux';
import { setAuth } from '../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function Login(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const dispatch = useDispatch();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/login', { email, password });
      dispatch(setAuth(res.data));
      if(res.data.user.role === 'manager') nav('/manager/dashboard');
      else nav('/employee/dashboard');
    } catch(err){ alert(err.response?.data?.msg || 'Login failed'); }
  };

  return (
    <div className="center">
      <form onSubmit={submit} className="card">
        <h2>Login</h2>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
        <button type="submit">Login</button>
        <p>Or <Link to="/register">Register</Link></p>
        <p style={{fontSize:12}}>Seed creds: manager@example.com / manager123  | employee@example.com / employee123</p>
      </form>
    </div>
  );
}
