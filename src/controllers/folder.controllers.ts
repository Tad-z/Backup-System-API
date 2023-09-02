import Folder from "../models/folder";
import User from "../models/user";
import File from "../models/file";
import { Request, Response } from "express";

export const createFolder = async (req: Request, res: Response) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({
        message: "Folder as to be named",
      });
    }
    const checkName = Folder.find({ name: req.body.name }).exec();
    if ((await checkName).length >= 1) {
      return res.status(409).json({
        message: `Folder name already exists`,
      });
    }
    const name = req.body.name;
    const userID = req.body.user.userID;
    const filesID = req.body.filesID;

    const folder = new Folder({
      name,
      userID,
      filesID,
    });

    let result = await folder.save();
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getFolders = async(req: Request, res: Response) => {
    try {
        const userId = req.body.user.userID;
        const folders = await Folder.find({ userID: userId });
    
        res.status(200).json(folders);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
}

// Delete a folder and its contents (files)
export const deleteFolder = async (req: Request, res: Response) => {
    try {
      const folderId = req.query.folderId;
      console.log(folderId);
      
      const userId = req.body.user.userID;
      console.log(userId);
      
  
      // Check if the folder belongs to the user
      const folder = await Folder.findOne({ _id: folderId, userID: userId });
  
      if (!folder) {
        return res.status(404).json({ message: 'Folder not found' });
      }
  
      // Delete associated files
      await File.deleteMany({ _id: { $in: folder.filesID } });
  
      // Delete the folder
      await Folder.findByIdAndRemove(folderId);
  
      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
