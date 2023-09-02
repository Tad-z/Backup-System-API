import express from "express";
import auth from "../Authorization/auth";
import {
  createFolder,
  getFolders,
  deleteFolder,
} from "../controllers/folder.controllers";

const router = express.Router();

router.post("/", auth, createFolder);
router.get("/", auth, getFolders);
router.delete("/", auth, deleteFolder);

export default router;
