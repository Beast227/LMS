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
  }
});

export default mongoose.model('Admin', adminSchema);