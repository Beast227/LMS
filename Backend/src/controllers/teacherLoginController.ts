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

    if (!match) return res.status(401).json({ message: "Password incorrect. Try again " }); // Unauthorized

    // Create Access Token
    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "ssn": foundTeacher.ssn
            }
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: '60s' } // Access token expiry
    );

    // Create a new Refresh Token
    const newRefreshToken = jwt.sign(
        { "ssn": foundTeacher.ssn },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: '7d' } // Refresh token expiry
    );

    // Initialize or filter the refresh tokens to exclude the current one (if exists in cookies)
    let newRefreshTokenArray = foundTeacher.refreshToken || [];

    // If a refresh token exists in cookies, handle reuse detection and clear it
    if (cookies?.jwt) {
        const refreshToken = cookies.jwt;

        // Remove old refresh token from the array (if it's valid and found)
        newRefreshTokenArray = newRefreshTokenArray.filter(rt => rt !== refreshToken);

        // Clear the old token from the client-side cookie
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' });
    }

    // Add the new refresh token to the admin's refresh token list
    newRefreshTokenArray.push(newRefreshToken);

    // Update admin's refresh token array
    foundTeacher.refreshToken = newRefreshTokenArray;

    // Save the updated admin with the new refresh token
    const result = await foundTeacher.save();
    console.log(result);

    // Set the new refresh token in the client-side cookie
    res.cookie('jwt', newRefreshToken, {
        httpOnly: true,
        // sameSite: 'None', // Set 'Secure' and 'SameSite' options properly in production 
        // secure: true, // For production, ensure HTTPS
        maxAge: 24 * 60 * 60 * 1000 // Cookie expires in 1 day
    });

    // Send the access token to the client
    return res.json({ accessToken });
};

export default { handleTeacherLogin };
