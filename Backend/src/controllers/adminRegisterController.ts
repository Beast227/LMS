import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Admin from '../models/Admin';

const handleNewAdmin = async (req: any, res: any) => {
    const { username, password } = req.body;

    // Validate request body
    if (!username?.trim() || !password?.trim()) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        // Check for duplicate usernames and emails in the database
        const duplicateUsername = await Admin.findOne({ username }).exec()


        if (duplicateUsername) {
            return res.status(409).json({ message: 'Username is already in use' }); // Conflict
        }

        // Encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);

        // Create and store the new admin
        const result = await Admin.create({
            username,
            password: hashedPwd
        });

        console.log(result);

        res.status(201).json({ success: `New admin ${username} created!` });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export default { handleNewAdmin };
