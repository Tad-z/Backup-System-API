import multer from "multer";
import { Request, Response } from "express";
import File from "../models/file";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 200 * 1024 * 1024,
  },
});

export const fileUpload = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const upload = new File({
      file: req.file?.path,
    });
    const result = await upload.save();
    res.status(200).json({
      result,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.log(error);

    if (error instanceof multer.MulterError) {
      if (error.code == "LIMIT_FILE_SIZE") {
        return res.status(500).send({
          message: "File size cannot be larger than 200MB!",
        });
      }
    }
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const fileDownload = async (req: Request, res: Response) => {
  try {
    const name = req.params.fileName;

    const fileName = `src\\uploads\\${name}`;

    // Find the file record in your database
    const file = await File.findOne({ file: fileName });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Send the file as an attachment for download
    res.download(file.file);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
