const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const managerOnly = require('../middleware/managerOnly');
const User = require('../models/User');
const Leave = require('../models/LeaveRequest');

function daysBetween(start, end){
  return Math.floor((new Date(end) - new Date(start)) / (1000*60*60*24)) + 1;
}

// Apply leave
router.post('/', auth, async (req,res)=> {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const totalDays = daysBetween(startDate, endDate);
    if(totalDays <= 0) return res.status(400).json({ msg: 'Invalid dates' });
    const user = await User.findById(req.userId);
    if(!user) return res.status(404).json({ msg: 'User not found' });
    // balance check (only informative; final check on approve)
    const bal = user.leaveBalance || {};
    if(leaveType==='sick' && bal.sickLeave < totalDays) return res.status(400).json({ msg: 'Insufficient sick leave' });
    if(leaveType==='casual' && bal.casualLeave < totalDays) return res.status(400).json({ msg: 'Insufficient casual leave' });
    if(leaveType==='vacation' && bal.vacation < totalDays) return res.status(400).json({ msg: 'Insufficient vacation leave' });

    // overlap check
    const overlap = await Leave.findOne({
      userId: req.userId,
      $or: [{ startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }],
      status: { $in: ['pending','approved'] }
    });
    if(overlap) return res.status(400).json({ msg: 'Overlapping leave exists' });

    const leave = new Leave({ userId: req.userId, leaveType, startDate, endDate, totalDays, reason });
    await leave.save();
    res.json(leave);
  } catch(err){ console.error(err); res.status(500).send('Server error'); }
});

// My requests
router.get('/my-requests', auth, async (req,res)=> {
  const leaves = await Leave.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(leaves);
});

// Cancel
router.delete('/:id', auth, async (req,res)=> {
  const leave = await Leave.findById(req.params.id);
  if(!leave) return res.status(404).json({ msg: 'Not found' });
  if(String(leave.userId) !== req.userId) return res.status(403).json({ msg: 'Not allowed' });
  if(leave.status !== 'pending') return res.status(400).json({ msg: 'Only pending can be cancelled' });
  await leave.remove();
  res.json({ msg: 'Cancelled' });
});

// Balance
router.get('/balance', auth, async (req,res)=> {
  const user = await User.findById(req.userId).select('leaveBalance');
  res.json(user.leaveBalance);
});

// Manager: all
router.get('/all', auth, managerOnly, async (req,res)=> {
  const leaves = await Leave.find().sort({ createdAt: -1 }).populate('userId','name email');
  res.json(leaves);
});

// Manager: pending
router.get('/pending', auth, managerOnly, async (req,res)=> {
  const leaves = await Leave.find({ status: 'pending' }).sort({ createdAt: -1 }).populate('userId','name email');
  res.json(leaves);
});

// Approve
router.put('/:id/approve', auth, managerOnly, async (req,res)=> {
  const leave = await Leave.findById(req.params.id);
  if(!leave) return res.status(404).json({ msg: 'Not found' });
  if(leave.status !== 'pending') return res.status(400).json({ msg: 'Already processed' });
  const user = await User.findById(leave.userId);
  const td = leave.totalDays;
  if(leave.leaveType==='sick' && user.leaveBalance.sickLeave < td) return res.status(400).json({ msg: 'Insufficient balance' });
  if(leave.leaveType==='casual' && user.leaveBalance.casualLeave < td) return res.status(400).json({ msg: 'Insufficient balance' });
  if(leave.leaveType==='vacation' && user.leaveBalance.vacation < td) return res.status(400).json({ msg: 'Insufficient balance' });

  if(leave.leaveType==='sick') user.leaveBalance.sickLeave -= td;
  if(leave.leaveType==='casual') user.leaveBalance.casualLeave -= td;
  if(leave.leaveType==='vacation') user.leaveBalance.vacation -= td;
  await user.save();

  leave.status = 'approved';
  leave.managerComment = req.body.managerComment || '';
  await leave.save();
  res.json(leave);
});

// Reject
router.put('/:id/reject', auth, managerOnly, async (req,res)=> {
  const leave = await Leave.findById(req.params.id);
  if(!leave) return res.status(404).json({ msg: 'Not found' });
  if(leave.status !== 'pending') return res.status(400).json({ msg: 'Already processed' });
  leave.status = 'rejected';
  leave.managerComment = req.body.managerComment || '';
  await leave.save();
  res.json(leave);
});

module.exports = router;
