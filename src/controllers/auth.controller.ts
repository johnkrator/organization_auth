import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {sequelize} from "../config/db";
import User from "../models/user";
import Organisation from "../models/organisation";

export const register = async (req: Request, res: Response) => {
    try {
        const {firstName, lastName, email, password, phone} = req.body;

        // Start a transaction
        const transaction = await sequelize.transaction();

        try {
            // Create the user
            const user = await User.create(
                {
                    firstName,
                    lastName,
                    email,
                    password,
                    phone,
                },
                {transaction}
            );

            // Create the organisation
            const organisation = await Organisation.create(
                {
                    name: `${firstName}'s Organisation`,
                    description: `Default organisation for ${firstName} ${lastName}`,
                },
                {transaction}
            );

            // Link user and organisation (assuming you have a UserOrganisation model)
            try {
                await sequelize.models.UserOrganisation.create(
                    {
                        UserUserId: user.userId,
                        OrganisationOrgId: organisation.orgId,
                    },
                    {transaction}
                );
            } catch (error) {
                console.error("Error creating UserOrganisation:", error);
                throw error; // Re-throw to trigger transaction rollback
            }

            await transaction.commit();

            // Generate JWT token
            const token = jwt.sign({userId: user.userId}, process.env.JWT_SECRET!, {expiresIn: "1h"});

            res.status(201).json({
                status: "success",
                message: "Registration successful",
                data: {
                    accessToken: token,
                    user: {
                        userId: user.userId,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phone: user.phone,
                    },
                },
            });
        } catch (error) {
            await transaction.rollback();
            console.error("Error during registration:", error);
            res.status(400).json({status: "Bad request", message: "Registration unsuccessful", statusCode: 400});
        }
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(400).json({status: "Bad request", message: "Registration unsuccessful", statusCode: 400});
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;

        console.log("Attempting login for email:", email);

        // Fetch the user using Sequelize
        const user = await User.findOne({where: {email}});

        if (!user) {
            console.log("User not found for email:", email);
            return res.status(401).json({status: "Bad request", message: "Authentication failed", statusCode: 401});
        }

        console.log("User found:", user.userId);

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            console.log("Invalid password for user:", user.userId);
            return res.status(401).json({status: "Bad request", message: "Authentication failed", statusCode: 401});
        }

        console.log("Password valid for user:", user.userId);

        // Generate JWT token
        const token = jwt.sign({userId: user.userId}, process.env.JWT_SECRET!, {expiresIn: "1h"});

        console.log("JWT token generated for user:", user.userId);

        res.status(200).json({
            status: "success",
            message: "Login successful",
            data: {
                accessToken: token,
                user: {
                    userId: user.userId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                },
            },
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(401).json({status: "Bad request", message: "Authentication failed", statusCode: 401});
    }
};
