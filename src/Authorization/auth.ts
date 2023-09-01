import jwt, { Secret } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";


interface DecodedToken {
  fullName: string;
  userID: string;
  // Add other properties here if needed
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized Access",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_KEY as Secret
    ) as DecodedToken;
    req.body.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized access",
    });
  }
};

export default auth;
