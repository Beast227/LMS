import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Teacher from '../models/Teacher';

const handleTeacherLogin = async (req: any, res: any) => {
    const cookies = req.cookies;
    const { ssn, password } = req.body;

    // Validate input
    if (!ssn || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Find admin by either username or email
    const foundTeacher = await Teacher.findOne({
        ssn
    }).exec();

    if (!foundTeacher) return res.status(401).json({ message: "Username not found" }); // Unauthorized

    // Compare provided password with stored hashed password
    const match = await bcrypt.compare(password, foundTeacher.password);

    if (!match) return res.status(401).json({ message: "Invalid Credentials" }); // Unauthorized

    // Create a new Refresh Token
    const newRefreshToken = jwt.sign(
        { 
            "username": foundTeacher.email,
            "id": foundTeacher._id
        },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: '1d' } // Refresh token expiry
    );

    // Set the new refresh token in the client-side cookie
    res.cookie('jwt', newRefreshToken, {
        httpOnly: true,
        // sameSite: 'None', // Set 'Secure' and 'SameSite' options properly in production 
        // secure: true, // For production, ensure HTTPS
        maxAge: 24 * 60 * 60 * 1000 // Cookie expires in 1 day
    });

    // Send the access token to the client
    return res.status(200).json({ message: "Login Successful" })
};

export default { handleTeacherLogin };
