import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const assignmentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    marks: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    }
})

const courseSchema = new Schema({
  faculty_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  assignment: {
    type: assignmentSchema,
    required: true
  },
  descripion: {
    type: String,
    required: true
  },
  ratings: {
    type: Number,
    default: 0
  },
  courseDuration: {
    type: Number,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  courseCode: {
    type: String
  }
});

export default mongoose.model('Course', courseSchema);