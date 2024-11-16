import Teacher from "../models/Teacher"
import bcrypt from "bcrypt"
import generatePassword from "../config/generatePassword"
import Admin from "../models/Admin"
import jwt from "jsonwebtoken"

const handleTeacherRegistration = async (req : any, res : any) => {
    try {
        
        const { fullName , dob, gender, email } = req.body
        const password = generatePassword()

        const cookies = req.cookies
        if (!cookies || !cookies.jwt) return res.status(401).json({ message: 'Cookies not found'})
        const refreshToken = cookies.jwt

        // Ensure REFRESH_TOKEN_SECRET is defined
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
        if (!refreshTokenSecret) {
            console.error('REFRESH_TOKEN_SECRET is not defined');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        let _id;
        jwt.verify(
            refreshToken,
            refreshTokenSecret, // Ensure this is a string
            (err: any, decoded: any) => {
                if (err) return res.status(403).json({ message: 'Invalid refresh token' });
                _id = decoded.id;
            }
        );

        // Is refreshToken in db?
        const foundAdmin = await Admin.findOne({
            _id
        })
        .exec()
        if(!foundAdmin) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' })
            return res.status(401).json({ message: 'Admin not found'})
        }

        // If teacher is already present
        const foundTeacher = await Teacher.findOne({
            email
        })
        if(foundTeacher){
            return res.status(401).json({ message: "Unauthorized request"})
        }

        // Hashing the password
        const hashedPwd = await bcrypt.hash(password, 10)

        // Creation of the new teacher instance
        const result = await Teacher.create({
            fullName, dob, gender, email, password: hashedPwd
        })
        console.log(result)

        return res.status(200).json({ message: 'Teacher is successfully stored', password: password })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export default { handleTeacherRegistration }