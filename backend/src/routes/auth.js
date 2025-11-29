const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.post('/register', async (req,res)=> {
  try {
    const { name, email, password, role } = req.body;
    if(!name || !email || !password) return res.status(400).json({ msg: 'Please provide all fields' });
    const exists = await User.findOne({ email });
    if(exists) return res.status(400).json({ msg: 'Email already used' });
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = new User({ name, email, password: hashed, role: role || 'employee' });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch(err) { console.error(err); res.status(500).send('Server error'); }
});

router.post('/login', async (req,res)=> {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch(err){ console.error(err); res.status(500).send('Server error'); }
});

router.get('/me', auth, async (req,res)=> {
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
});

module.exports = router;
