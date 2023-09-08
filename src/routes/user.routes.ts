import express from 'express';
import { createUser, logIn, getUser, getAllUsers, deleteAllUsers } from '../controllers/user.controllers';
import auth from '../Authorization/auth';
import isAdmin from '../Authorization/admin';



const router = express.Router();

router.post('/signup', createUser);
router.post('/login', logIn)
router.get('/', auth, getUser)
router.get("/admin", auth, isAdmin, getAllUsers)
router.delete("/", deleteAllUsers);

export default router;
