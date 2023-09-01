import express from 'express';
import { createUser, logIn, getUser, getAllUsers } from '../controllers/user.controllers';
import auth from '../Authorization/auth';


const router = express.Router();

router.post('/signup', createUser);
router.post('/login', logIn)
router.get('/', auth, getUser)
router.get("/users", getAllUsers)

export default router;
