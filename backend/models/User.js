const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: String,
  avatar: String,
  role: { type: String, enum: ["driver", "business"], required: true },
  profileCompleted: { type: Boolean, default: false },
  driver: {
    vehicleNumber: String,
    licenseNumber: String,
    phone: String,
    // more fields to be added
  },
  business: {
    businessName: String,
    businessAddress: String,
    contactNumber: String,
    // more fields to be added
  },

} , {timestamps : true});

module.exports = mongoose.model('User' , UserSchema);