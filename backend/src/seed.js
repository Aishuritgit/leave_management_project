require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function seed(){
  await mongoose.connect(process.env.MONGO_URI);
  const existing = await User.findOne({ email: 'manager@example.com' });
  if(existing) {
    console.log('Seed already done');
    process.exit(0);
  }
  const mpass = await bcrypt.hash('manager123', 10);
  const manager = new User({ name: 'Manager One', email: 'manager@example.com', password: mpass, role: 'manager' });
  await manager.save();
  const epass = await bcrypt.hash('employee123', 10);
  const emp = new User({ name: 'Employee One', email: 'employee@example.com', password: epass, role: 'employee' });
  await emp.save();
  console.log('Seed completed. manager@example.com / manager123  | employee@example.com / employee123');
  process.exit(0);
}

seed().catch(err=>{ console.error(err); process.exit(1); });
