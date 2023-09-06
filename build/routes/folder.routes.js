"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../Authorization/auth"));
const folder_controllers_1 = require("../controllers/folder.controllers");
const router = express_1.default.Router();
router.post("/", auth_1.default, folder_controllers_1.createFolder);
router.get("/", auth_1.default, folder_controllers_1.getFolders);
router.delete("/", auth_1.default, folder_controllers_1.deleteFolder);
exports.default = router;
