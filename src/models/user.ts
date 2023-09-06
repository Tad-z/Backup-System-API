import mongoose, { Document, Model, Schema } from 'mongoose';

// Define interface for the user document (optional, but recommended)
interface IUser extends Document {
  fullName: string;
  emailAdress: string;
  password: string;
  role: string
}

// Create a Mongoose schema
const userSchema: Schema<IUser> = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  emailAdress: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  }
});

// Define and export the User model
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;
