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
exports.deleteAllUsers = exports.getAllUsers = exports.getUser = exports.logIn = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user")); // Make sure the path is correct
const validateEmail = (email) => {
    const regex = new RegExp("([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)");
    const testEmail = regex.test(email);
    return testEmail;
};
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.emailAdress || !req.body.fullName || !req.body.password) {
        return res.status(400).json({
            message: "Missing required fields",
        });
    }
    if (validateEmail(req.body.emailAdress) === false) {
        return res.status(401).json({
            message: "Email Address is not valid",
        });
    }
    try {
        const user = yield user_1.default.findOne({ emailAdress: req.body.emailAdress });
        if (user) {
            return res.status(409).json({
                message: "User already exists",
            });
        }
        bcrypt_1.default.hash(req.body.password, 10, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log(err);
            }
            else {
                const newUser = new user_1.default({
                    fullName: req.body.fullName.toLowerCase(),
                    emailAdress: req.body.emailAdress,
                    password: hash,
                });
                try {
                    const result = yield newUser.save();
                    if (result) {
                        console.log(result);
                        res.status(200).json({
                            result,
                            message: "You have signed up successfully",
                        });
                    }
                    else {
                        console.log("Error occurred");
                        res.status(400).json({
                            message: "An error occurred",
                        });
                    }
                }
                catch (error) {
                    console.log(error);
                    res.status(500).json({
                        message: "Internal server error",
                    });
                }
            }
        }));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.createUser = createUser;
const logIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findOne({
            emailAdress: req.body.emailAdress,
        }).exec();
        if (!user) {
            return res.status(401).json({
                message: `email or password is incorrect`,
            });
        }
        const result = yield bcrypt_1.default.compare(req.body.password, user.password);
        if (!result) {
            return res.status(401).json({
                message: `email or password incorrect`,
            });
        }
        else if (result) {
            const jwtKey = process.env.JWT_KEY;
            if (!jwtKey) {
                throw new Error("JWT secret key is missing in environment variables.");
            }
            const token = jsonwebtoken_1.default.sign({
                fullName: user.fullName,
                userID: user._id,
                role: user.role,
            }, jwtKey, {
                expiresIn: "1h",
            });
            return res.status(200).json({
                message: `Authentication successful`,
                token: token,
            });
        }
        return res.status(401).json({
            message: `email or password incorrect`,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.logIn = logIn;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = req.body.user.userID;
        console.log(userId);
        const user = yield user_1.default.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({
                message: "User does not exist",
            });
        }
        return res.status(200).json({
            user,
            message: "Found User",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.getUser = getUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find().exec();
        if (!users.length)
            return res.json([]);
        const count = users.length;
        return res.status(200).json({
            message: "users retrieved successfully",
            count,
            users,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.getAllUsers = getAllUsers;
const deleteAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_1.default.deleteMany({}).then((data) => {
            res.status(204).json({
                message: `${data.deletedCount} Users were deleted from cart successfully!`,
            });
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.deleteAllUsers = deleteAllUsers;
