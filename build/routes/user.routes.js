"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controllers_1 = require("../controllers/user.controllers");
const auth_1 = __importDefault(require("../Authorization/auth"));
const router = express_1.default.Router();
router.post('/signup', user_controllers_1.createUser);
router.post('/login', user_controllers_1.logIn);
router.get('/', auth_1.default, user_controllers_1.getUser);
router.get("/users", user_controllers_1.getAllUsers);
router.delete("/", user_controllers_1.deleteAllUsers);
exports.default = router;
