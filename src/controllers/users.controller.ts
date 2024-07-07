import {Request, Response} from "express";
import User from "../models/user";

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: ["userId", "firstName", "lastName", "email", "phone"],
        });

        if (!user) {
            return res.status(404).json({status: "Not found", message: "User not found", statusCode: 404});
        }

        res.status(200).json({
            status: "success",
            message: "User retrieved successfully",
            data: user,
        });
    } catch (error) {
        res.status(500).json({status: "Server error", message: "An error occurred", statusCode: 500});
    }
};
