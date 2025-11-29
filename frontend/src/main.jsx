import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import ApplyLeave from './pages/ApplyLeave';
import MyRequests from './pages/MyRequests';
import './styles.css';

const App = ()=> {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/apply" element={<ApplyLeave />} />
          <Route path="/employee/requests" element={<MyRequests />} />
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

createRoot(document.getElementById('root')).render(<App />);
