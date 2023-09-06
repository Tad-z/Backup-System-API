"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Create a Mongoose schema
const userSchema = new mongoose_1.default.Schema({
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
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
