const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const managerOnly = require('../middleware/managerOnly');
const Leave = require('../models/LeaveRequest');
const User = require('../models/User');

router.get('/employee', auth, async (req,res)=>{
  const total = await Leave.countDocuments({ userId: req.userId });
  const pending = await Leave.countDocuments({ userId: req.userId, status: 'pending' });
  const approved = await Leave.countDocuments({ userId: req.userId, status: 'approved' });
  const balance = (await User.findById(req.userId)).leaveBalance;
  res.json({ total, pending, approved, balance });
});

router.get('/manager', auth, managerOnly, async (req,res)=>{
  const pending = await Leave.countDocuments({ status: 'pending' });
  const approved = await Leave.countDocuments({ status: 'approved' });
  const rejected = await Leave.countDocuments({ status: 'rejected' });
  const employees = await User.countDocuments({ role: 'employee' });
  res.json({ pending, approved, rejected, employees });
});

module.exports = router;
