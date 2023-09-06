import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user"; // Make sure the path is correct

const validateEmail = (email: string): boolean => {
  const regex = new RegExp(
    "([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)"
  );
  const testEmail = regex.test(email);
  return testEmail;
};

export const createUser = async (req: Request, res: Response) => {
  if (!req.body.emailAdress || !req.body.fullName || !req.body.password) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  if (validateEmail(req.body.emailAdress) === false) {
    return res.status(401).json({
      message: "Email Address is not valid",
    });
  }

  try {
    const user = await User.findOne({ emailAdress: req.body.emailAdress });

    if (user) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        console.log(err);
      } else {
        const newUser = new User({
          fullName: req.body.fullName.toLowerCase(),
          emailAdress: req.body.emailAdress,
          password: hash,
          role: req.body.role
        });

        try {
          const result = await newUser.save();

          if (result) {
            console.log(result);
            res.status(200).json({
              result,
              message: "You have signed up successfully",
            });
          } else {
            console.log("Error occurred");
            res.status(400).json({
              message: "An error occurred",
            });
          }
        } catch (error) {
          console.log(error);
          res.status(500).json({
            message: "Internal server error",
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const logIn = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({
      emailAdress: req.body.emailAdress,
    }).exec();
    if (!user) {
      return res.status(401).json({
        message: `email or password is incorrect`,
      });
    }
    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) {
      return res.status(401).json({
        message: `email or password incorrect`,
      });
    } else if (result) {
      const jwtKey = process.env.JWT_KEY;
      if (!jwtKey) {
        throw new Error("JWT secret key is missing in environment variables.");
      }
      const token = jwt.sign(
        {
          fullName: user.fullName,
          userID: user._id,
          role: user.role,
        },
        jwtKey,
        {
          expiresIn: "1h",
        }
      );
      return res.status(200).json({
        message: `Authentication successful`,
        token: token,
      });
    }
    return res.status(401).json({
      message: `email or password incorrect`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    let userId = req.user?.userID;
    console.log(userId);
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }

    return res.status(200).json({
      user,
      message: "Found User",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().exec();
    if (!users.length) return res.json([]);
    const count = users.length;
    return res.status(200).json({
      message: "users retrieved successfully",
      count,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    await User.deleteMany({}).then((data) => {
      res.status(204).json({
        message: `${data.deletedCount} Users were deleted from cart successfully!`,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}