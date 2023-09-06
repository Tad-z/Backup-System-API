import mongoose, { Document, Model, Schema } from 'mongoose';

// Define interface for the user document (optional, but recommended)
interface Ifile extends Document {
  file: string,
  userID: mongoose.Types.ObjectId,
  isUnsafe: boolean,
}

// Create a Mongoose schema
const fileSchema: Schema<Ifile> = new mongoose.Schema({
  file: {
    type: String,
    required: true
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isUnsafe: {
    type: Boolean,
    default: false,
  },
});

// Define and export the User model
const File: Model<Ifile> = mongoose.model<Ifile>('File', fileSchema);
export default File;
