import Teacher from "../models/Teacher";

const generateUniqueEmail = async (name: string): Promise<string> => {
    const domain = "@canaraengineering.in";
    let email = `${name}${domain}`.toLowerCase(); // Convert to lowercase for consistency
    let suffix = 1;

    // Check if email already exists in the database
    while (await Teacher.findOne({ email }).exec()) {
        email = `${name}${suffix}${domain}`.toLowerCase();
        suffix++;
    }

    return email;
};

export default generateUniqueEmail;