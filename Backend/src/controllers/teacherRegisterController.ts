import Teacher from "../models/Teacher"
import bcrypt from "bcrypt"
import generatePassword from "../config/generatePassword"
import Admin from "../models/Admin"

const handleTeacherRegistration = async (req : any, res : any) => {
    try {
        
        const { fullName , dob, ssn, gender, email } = req.body
        const password = generatePassword()

        const cookies = req.cookies
        if (!cookies || !cookies.jwt) return res.status(204).json({ message: 'Cookies not found'})
        const refreshToken = cookies.jwt

        // Is refreshToken in db?
        const foundAdmin = await Admin.findOne({
            refreshToken
        })
        .exec()
        if(!foundAdmin) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' })
            return res.status(204).json({ message: 'User not found'})
        }

        // If teacher is already present
        const foundTeacher = await Teacher.findOne({
            $or: [{ssn},{email}]
        })
        if(foundTeacher){
            return res.status(401).json({ message: "Unauthorized request"})
        }

        // Hashing the password
        const hashedPwd = await bcrypt.hash(password, 10)

        // Creation of the new teacher instance
        const result = await Teacher.create({
            fullName, dob, ssn, gender, email, password: hashedPwd
        })
        console.log(result)

        return res.status(200).json({ message: 'Teacher is successfully stored'})

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export default { handleTeacherRegistration }