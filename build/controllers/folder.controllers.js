"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFolder = exports.getFolders = exports.createFolder = void 0;
const folder_1 = __importDefault(require("../models/folder"));
const file_1 = __importDefault(require("../models/file"));
const createFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.name) {
            return res.status(400).json({
                message: "Folder as to be named",
            });
        }
        const checkName = folder_1.default.find({ name: req.body.name }).exec();
        if ((yield checkName).length >= 1) {
            return res.status(409).json({
                message: `Folder name already exists`,
            });
        }
        const name = req.body.name;
        const userID = req.body.user.userID;
        const filesID = req.body.filesID;
        const folder = new folder_1.default({
            name,
            userID,
            filesID,
        });
        let result = yield folder.save();
        res.json(result);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.createFolder = createFolder;
const getFolders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.user.userID;
        const folders = yield folder_1.default.find({ userID: userId });
        res.status(200).json(folders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getFolders = getFolders;
// Delete a folder and its contents (files)
const deleteFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const folderId = req.query.folderId;
        console.log(folderId);
        const userId = req.body.user.userID;
        console.log(userId);
        // Check if the folder belongs to the user
        const folder = yield folder_1.default.findOne({ _id: folderId, userID: userId });
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }
        // Delete associated files
        yield file_1.default.deleteMany({ _id: { $in: folder.filesID } });
        // Delete the folder
        yield folder_1.default.findByIdAndRemove(folderId);
        res.status(204).end();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteFolder = deleteFolder;
