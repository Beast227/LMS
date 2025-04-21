import Course from '../models/Courses';

export const CreateCourse = async (req: any, res: any) => {
  try {
    const {
      faculty_id,
      courseName,
      courseCode,
      courseDuration,
      descripion, // note: this spelling matches your schema, but "description" is the correct word
      ratings,
      enrolledUsers,
      assignment
    } = req.body;

    // Validate required fields
    if (
      !faculty_id ||
      !courseName ||
      !courseCode ||
      !courseDuration ||
      !descripion ||
      !assignment ||
      !Array.isArray(assignment) ||
      assignment.length === 0
    ) {
      return res.status(400).json({
        message: 'Missing required fields or assignment data',
        success: false
      });
    }

    // Check if course already exists
    const existingCourse = await Course.findOne({ courseCode });
    if (existingCourse) {
      return res.status(400).json({
        message: 'Course already exists',
        success: false
      });
    }

    // Create and save course
    const newCourse = await Course.create({
      faculty_id,
      courseName,
      courseCode,
      courseDuration,
      descripion,
      ratings: ratings || 0,
      enrolledUsers: enrolledUsers || [],
      assignment
    });

    return res.status(201).json({
      message: 'Course created successfully',
      success: true,
      course: newCourse
    });

  } catch (error) {
    console.error('Error creating course:', error);
    return res.status(500).json({
      message: 'Internal server error',
      success: false
    });
  }
};


export default {
    CreateCourse
}