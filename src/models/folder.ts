import mongoose, { Document, Model, Schema } from 'mongoose';

// Define interface for the user document (optional, but recommended)
interface Ifolder extends Document {
  name: string,
  userID: mongoose.Types.ObjectId,
  filesID: mongoose.Types.ObjectId[]
}

// Create a Mongoose schema
const folderSchema: Schema<Ifolder> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  filesID: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  }]
});

// Define and export the User model
const Folder: Model<Ifolder> = mongoose.model<Ifolder>('Folder', folderSchema);
export default Folder;
