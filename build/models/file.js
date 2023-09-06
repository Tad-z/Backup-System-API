"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Create a Mongoose schema
const fileSchema = new mongoose_1.default.Schema({
    file: {
        type: String,
        required: true
    },
    userID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isUnsafe: {
        type: Boolean,
        default: false,
    },
});
// Define and export the User model
const File = mongoose_1.default.model('File', fileSchema);
exports.default = File;
