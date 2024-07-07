import {Request, Response} from "express";
import Organisation from "../models/organisation";
import User from "../models/user";
import {AuthenticatedRequest} from "../../types/express";

export const getAllOrganisations = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = await User.findByPk(req.user!.userId);
        const organisations = await (user as any).getOrganisations();

        res.status(200).json({
            status: "success",
            message: "Organisations retrieved successfully",
            data: {organisations},
        });
    } catch (error) {
        res.status(500).json({status: "Server error", message: "An error occurred", statusCode: 500});
    }
};

export const getOrganisationById = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = await User.findByPk(req.user!.userId);
        const organisation = await Organisation.findByPk(req.params.orgId);

        if (!organisation) {
            return res.status(404).json({status: "Not found", message: "Organisation not found", statusCode: 404});
        }

        const hasAccess = await (user as any).hasOrganisation(organisation);
        if (!hasAccess) {
            return res.status(403).json({status: "Forbidden", message: "Access denied", statusCode: 403});
        }

        res.status(200).json({
            status: "success",
            message: "Organisation retrieved successfully",
            data: organisation,
        });
    } catch (error) {
        res.status(500).json({status: "Server error", message: "An error occurred", statusCode: 500});
    }
};

export const createOrganisation = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const {name, description} = req.body;
        const user = await User.findByPk(req.user!.userId);

        const organisation = await Organisation.create({name, description});
        await (user as any).addOrganisation(organisation);

        res.status(201).json({
            status: "success",
            message: "Organisation created successfully",
            data: organisation,
        });
    } catch (error: any) {
        if (error.name === "SequelizeValidationError") {
            const errors = error.errors.map((err: any) => ({field: err.path, message: err.message}));
            return res.status(422).json({errors});
        }
        res.status(400).json({status: "Bad Request", message: "Client error", statusCode: 400});
    }
};

export const addUserToOrganisation = async (req: Request, res: Response) => {
    try {
        const {userId} = req.body;
        const organisation = await Organisation.findByPk(req.params.orgId);
        const user = await User.findByPk(userId);

        if (!organisation || !user) {
            return res.status(404).json({
                status: "Not found",
                message: "Organisation or user not found",
                statusCode: 404
            });
        }

        await (organisation as any).addUser(user);

        res.status(200).json({
            status: "success",
            message: "User added to organisation successfully",
        });
    } catch (error) {
        res.status(500).json({status: "Server error", message: "An error occurred", statusCode: 500});
    }
};
