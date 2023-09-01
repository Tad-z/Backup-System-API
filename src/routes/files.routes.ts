import express from 'express';
import { upload, fileUpload, fileDownload  } from '../controllers/files.controllers';
import auth from '../Authorization/auth';


const router = express.Router();

router.post('/uploads', auth, upload.single("file"), fileUpload);
router.get('/download/:fileName', auth, fileDownload);


export default router;
