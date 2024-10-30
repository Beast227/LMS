import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const teacherSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  ssn: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  emergencyContact: {
    type: String
  },
  refreshToken: [String]
});

export default mongoose.model('Teacher', teacherSchema);