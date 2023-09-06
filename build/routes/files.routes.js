"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const files_controllers_1 = require("../controllers/files.controllers");
const uploads_1 = __importDefault(require("../controllers/uploads"));
const auth_1 = __importDefault(require("../Authorization/auth"));
const admin_1 = __importDefault(require("../Authorization/admin"));
const router = express_1.default.Router();
router.post('/uploads', auth_1.default, uploads_1.default, files_controllers_1.fileUpload);
router.get('/download/:fileName', auth_1.default, files_controllers_1.fileDownload);
router.get('/', auth_1.default, files_controllers_1.getUserFiles);
router.get('/admin', auth_1.default, admin_1.default, files_controllers_1.getAllFiles);
router.put('/admin/markUnsafe/:fileId', auth_1.default, admin_1.default, files_controllers_1.markUnsafe);
exports.default = router;
