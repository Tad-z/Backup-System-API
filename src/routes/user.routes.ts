import express from 'express';
import { createUser, logIn } from '../controllers/user.controllers';


const router = express.Router();

router.post('/signup', createUser);
router.post('/login', logIn)

export default router;
