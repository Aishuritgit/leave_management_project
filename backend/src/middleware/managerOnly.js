const User = require('../models/User');
module.exports = async function(req,res,next){
  const user = await User.findById(req.userId);
  if(!user || user.role !== 'manager') return res.status(403).json({ msg: 'Manager only' });
  next();
};
