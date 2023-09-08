import { Request, Response, NextFunction } from "express";

const isAdmin = async(req: Request, res: Response, next: NextFunction) => {
    if(req.user?.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            message: "Access denied, not admin"
        })
    }
}

export default isAdmin