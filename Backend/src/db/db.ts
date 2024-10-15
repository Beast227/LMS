import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
    } catch (err: any) {
        console.error(`Error: ${err.message}`);
    }
};

export default connectDB;