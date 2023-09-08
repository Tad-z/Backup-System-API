import { Request, Response } from "express";
import File from "../models/file";
import cron from "node-cron";
import multer from "multer";
import fs from "fs"

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

export const streamVideoFiles = async (req: Request, res: Response) => {
  try {
    const name = req.params.videoName;

    const filePath = `src\\uploads\\${name}`;
    // The fs.statSync() method is used to synchronously return information about the given file path
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    // This line checks if the incoming request contains a "Range" header. 
    // The "Range" header is typically included in partial content requests 
    // and indicates which portion of the file the client is requesting.
    // indicates part of a document a server should return i.e seeking a particular time in the video
    const range = req.headers.range;

    if (range) {
      // These lines parse the "Range" header to determine the start and end byte positions for the requested range.
      //  It splits the header value and converts the values to integers. 
      // If an end byte position is not specified in the header, it's assumed to be the last byte of the file
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      
      // These lines calculate the size of the data chunk to be streamed and create a readable stream (file)
      //  for the specified portion of the video file using fs.createReadStream
      const chunksize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      
      // This block defines the HTTP response headers that will be sent to the client. 
      // It specifies information about the data range being sent, 
      // the content length, and the content type (in this case, "video/mp4" for video files).
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4', // Set the appropriate content type
      }
      // file.pipe(res):Finally, we pipe (stream) the data from the file readable stream to the res response stream. 
      // This effectively sends the specified portion of the video file to the client.
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      // We use fs.createReadStream to create a readable stream for the entire video file 
      // and then pipe it to the response stream (res), effectively sending the complete video file to the client.
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4', // Set the appropriate content type
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    console.log(error)
  }
};
