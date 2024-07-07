import {Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import {AuthenticatedRequest} from "../../types/express";

interface UserPayload {
    userId: string;
}

export default (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({status: "Unauthorized", message: "No token provided", statusCode: 401});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({status: "Unauthorized", message: "Invalid token", statusCode: 401});
    }
};
