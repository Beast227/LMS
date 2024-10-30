import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Admin from '../models/Admin';

const handleLogin = async (req: any, res: any) => {
    const cookies = req.cookies;
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

    // Create Access Token
    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": foundAdmin.username
            }
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: '60s' } // Access token expiry
    );

    // Create a new Refresh Token
    const newRefreshToken = jwt.sign(
        { "username": foundAdmin.username },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: '1d' } // Refresh token expiry
    );

    // Initialize or filter the refresh tokens to exclude the current one (if exists in cookies)
    let newRefreshTokenArray = foundAdmin.refreshToken || [];

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
    foundAdmin.refreshToken = newRefreshTokenArray;

    // Save the updated admin with the new refresh token
    const result = await foundAdmin.save();
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

export default { handleLogin };
