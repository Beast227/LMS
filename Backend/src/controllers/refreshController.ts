import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';

const handleAdminRefreshToken = async (req: any, res: any) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: "Cookies are not found" }); // No content
    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

    const foundAdmin = await Admin.findOne({ refreshToken: refreshToken }).exec();

    // Detected refresh token reuse!
    if (!foundAdmin) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET!,
            async (err: jwt.VerifyErrors | null, decoded: any) => {
                if (err) return res.sendStatus(403);
                console.log('Attempted refresh token reuse!');
            }
        );
        return res.status(403).json({ message: "Refresh token reuse" }); // forbidden
    }
    
    // Evaluate JWT
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
        async (err: jwt.VerifyErrors | null, decoded: any) => {
            if (err) {
                console.log('Expired refresh token');
                return res.status(403).json({ message : "Refresh token is expired" });
            }
            if (foundAdmin.username !== decoded.username) return res.status(403);

            const newRefreshToken = jwt.sign(
                { 
                    "username": foundAdmin.username,
                    "id": foundAdmin._id.toString()
                },
                process.env.REFRESH_TOKEN_SECRET!,
                { expiresIn: '7d' }
            );

            // Create secure cookie with refresh token
            res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000, secure: true }); // secure: true should be used in production

            return res.status(200).json({ message: "New Token is generated" })
        }
    );
};

export default { handleAdminRefreshToken };