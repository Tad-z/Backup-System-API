import express from 'express';
import { fileUpload, fileDownload, getAllFiles, markUnsafe, getUserFiles, streamVideoFiles, streamAudioFiles  } from '../controllers/files.controllers';
import uploadFilesMiddleware from '../controllers/uploads'
import auth from '../Authorization/auth';
import isAdmin from '../Authorization/admin';



const router = express.Router();

router.post('/uploads', auth, uploadFilesMiddleware, fileUpload);
router.get('/download/:fileName', auth, fileDownload);
router.get('/',auth, getUserFiles)
router.get('/admin',auth, isAdmin, getAllFiles)
router.patch('/admin/markUnsafe/:fileId',auth, isAdmin, markUnsafe)
router.get('/stream/video/:videoName',auth, streamVideoFiles)
router.get('/stream/audio/:audioName',auth, streamAudioFiles)



export default router;
