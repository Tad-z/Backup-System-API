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
exports.markUnsafe = exports.fileDownload = exports.getAllFiles = exports.getUserFiles = exports.fileUpload = void 0;
const file_1 = __importDefault(require("../models/file"));
const fileUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        console.log("Request Body:", req.body);
        console.log("Request Headers:", req.headers);
        if (!req.body.user || !req.body.user.userID) {
            return res.status(401).json({ message: "gUnauthorized access" });
        }
        const userID = req.body.user.userID;
        console.log(userID);
        const upload = new file_1.default({
            userID,
            file: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path,
        });
        const result = yield upload.save();
        res.status(200).json({
            result,
            message: "File uploaded successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.fileUpload = fileUpload;
const getUserFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = yield file_1.default.find({ userID: req.body.user.userID }).exec();
        if (!files)
            return res.json([]);
        const count = files.length;
        return res.status(200).json({
            count,
            files,
            message: "Files retrieved successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUserFiles = getUserFiles;
const getAllFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = yield file_1.default.find().exec();
        if (!files)
            return res.json([]);
        const count = files.length;
        return res.status(200).json({
            count,
            files,
            message: "Files retrieved successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllFiles = getAllFiles;
const fileDownload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.params.fileName;
        const fileName = `src\\uploads\\${name}`;
        // Find the file record in your database
        const file = yield file_1.default.findOne({ file: fileName });
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }
        // Send the file as an attachment for download
        res.download(file.file);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.fileDownload = fileDownload;
const markUnsafe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fileId = req.params.fileId;
    try {
        const file = yield file_1.default.findById(fileId);
        if (!file) {
            return res.status(404).json({ message: 'File not found.' });
        }
        file.isUnsafe = true;
        yield file.save();
        return res.status(200).json(file);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.markUnsafe = markUnsafe;
