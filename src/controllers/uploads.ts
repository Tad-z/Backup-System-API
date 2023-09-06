import multer from "multer";
import util from "util"


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});

let upload = multer({
  storage: storage,
  limits: {
    fileSize: 200 * 1024 * 1024,
  },
}).single("file");

let uploadFilesMiddleware = util.promisify(upload);
export default uploadFilesMiddleware;