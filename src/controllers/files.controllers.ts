import { Request, Response } from "express";
import File from "../models/file";
import cron from "node-cron";
import multer from "multer";

async function deleteUnsafeFiles() {
  try {
    const unsafeFiles = await File.find({ isUnsafe: true });
    if (unsafeFiles) {
      for (const file of unsafeFiles) {
        await File.findByIdAndRemove(file._id).then((data) => {
          if (!data) {
            return "file not found";
          } else {
            console.log("deleted");
          }
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
}

cron.schedule("*/30 * * * *", () => {
  deleteUnsafeFiles();
});

export const fileUpload = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!req.user || !req.user.userID) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    const userID = req.user.userID;
    const upload = new File({
      userID,
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
      if (error.code === "LIMIT_FILE_SIZE") {
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

export const getUserFiles = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userID;
    const files = await File.find({ userID: userId }).exec();
    if (!files) return res.json([]);
    const count = files.length;
    return res.status(200).json({
      count,
      files,
      message: "Files retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllFiles = async (req: Request, res: Response) => {
  try {
    const files = await File.find().exec();
    if (!files) return res.json([]);
    const count = files.length;
    return res.status(200).json({
      count,
      files,
      message: "Files retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
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

export const markUnsafe = async (req: Request, res: Response) => {
  const fileId = req.params.fileId;

  try {
    await File.findByIdAndUpdate(fileId, { isUnsafe: true }).then((data) => {
      if (!data) {
        res.json({
          message: `File was not found`,
        });
      } else {
        res.json({
          data,
          message: "File was updated successfully.",
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
