const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  profile_pic: { type: String, required: false },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  jwt_token: { type: String, required: true },
  mobile: { type: String, required: false },
  address:{type:String,required:false},
  user_status:{type:String,default: 'active' },
  subscription_status: { type: String, default: 'inactive' },
  properties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],

}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user password with hashed password
UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
