// node-backend/models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    alias: 'id'         // allow using `user.id` instead of `_id`
  },
  userName: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false       // do not return by default
  },
  phoneNumber: {
    type: String,
    required: true,
    select: false       // hashed value only
  },
  budget: {
    type: String,
    required: true,
    select: true       
  },
  savings: {
    type: String,
    required: true,
    select: true       
  },
  roles: {
    type: [String],
    default: ['USER']
  }
}, {
  collection: 'finTechUsers',  // match Spring Boot’s @Document(collection="finTechUsers")
  timestamps: true             // adds createdAt & updatedAt
});

module.exports = mongoose.model('user', UserSchema);
