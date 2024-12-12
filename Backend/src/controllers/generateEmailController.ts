import Teacher from "../models/Teacher";

const generateUniqueEmail = async (req: any, res: any) => {

    try {
        const { fullName } = req.body;
    
        const domain = "@canaraengineering.in";
        let cleanName = fullName.trim().replace(/\s+/g, ''); // Replace spaces with '.' and trim extra spaces
        let email = `${cleanName}${domain}`.toLowerCase(); // Convert to lowercase for consistency
        let suffix = 1;
    
        // Check if email already exists in the database
        while (await Teacher.findOne({ email }).exec()) {
            email = `${cleanName}${suffix}${domain}`.toLowerCase();
            suffix++;
        }

        return res.status(200).json({ 'message': 'Successfully generated email', 'email': email })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' })
    }

};


export default { generateUniqueEmail };