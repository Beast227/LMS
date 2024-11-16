import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Admin from '../models/Admin';

const handleLogin = async (req: any, res: any) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Find admin by either username or email
    const foundAdmin = await Admin.findOne({
        username
    }).exec();

    if (!foundAdmin) return res.status(401).json({ message: "Username not found" }); // Unauthorized

    // Compare provided password with stored hashed password
    const match = await bcrypt.compare(password, foundAdmin.password);

    if (!match) return res.status(401).json({ message: "Incorrect credentials. Kindly check your username or password" }); // Unauthorized

    // Create a new Refresh Token
    const newRefreshToken = jwt.sign(
        { 
            "username": foundAdmin.username,
            "id": foundAdmin._id
        },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: '1d' } // Refresh token expiry
    );

    // Set the new refresh token in the client-side cookie
    res.cookie('jwt', newRefreshToken, {
        httpOnly: true,
        sameSite: 'Lax', // Set 'Secure' and 'SameSite' options properly in production 
        secure: false, // For production, ensure HTTPS
        maxAge: 24 * 60 * 60 * 1000 // Cookie expires in 1 day
    });

    // Send the access token to the client
    return res.status(200).json({ message: "Successfully logged in" })
};

export default { handleLogin };
