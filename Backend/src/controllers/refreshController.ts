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
                const hackedAdmin = await Admin.findOne({ username: decoded.username }).exec();
                if (hackedAdmin) {
                    hackedAdmin.refreshToken = [];
                    const result = await hackedAdmin.save();
                    console.log(result);
                }
            }
        );
        return res.status(403).json({ message: "Refresh token reuse" }); // forbidden
    }

    const newRefreshTokenArray = foundAdmin.refreshToken.filter((rt: string) => rt.trim() !== refreshToken);
    
    // Evaluate JWT
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
        async (err: jwt.VerifyErrors | null, decoded: any) => {
            if (err) {
                console.log('Expired refresh token');
                foundAdmin.refreshToken = newRefreshTokenArray;
                const result = await foundAdmin.save();
                console.log(result);
                return res.status(403).json({ message : "Refresh token is expired" });
            }
            if (foundAdmin.username !== decoded.username) return res.status(403);

            // Refresh token was still valid
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username
                    }
                },
                process.env.ACCESS_TOKEN_SECRET!,
                { expiresIn: '60s' }
            );

            const newRefreshToken = jwt.sign(
                { "username": foundAdmin.username },
                process.env.REFRESH_TOKEN_SECRET!,
                { expiresIn: '7d' }
            );

            // Saving new refreshToken with current admin
            foundAdmin.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            const result = await foundAdmin.save();
            console.log(result);

            // Create secure cookie with refresh token
            res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000, secure: true }); // secure: true should be used in production

            res.json({ accessToken });
        }
    );
};

export default { handleAdminRefreshToken };