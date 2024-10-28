import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const adminSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  refreshToken: [String]
});

export default mongoose.model('Admin', adminSchema);