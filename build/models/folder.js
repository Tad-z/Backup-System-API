"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Create a Mongoose schema
const folderSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    userID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    filesID: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'File'
        }]
});
// Define and export the User model
const Folder = mongoose_1.default.model('Folder', folderSchema);
exports.default = Folder;
