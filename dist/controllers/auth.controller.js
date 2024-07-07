"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const user_1 = __importDefault(require("../models/user"));
const organisation_1 = __importDefault(require("../models/organisation"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password, phone } = req.body;
        // Start a transaction
        const transaction = yield db_1.sequelize.transaction();
        try {
            // Create the user
            const user = yield user_1.default.create({
                firstName,
                lastName,
                email,
                password,
                phone,
            }, { transaction });
            // Create the organisation
            const organisation = yield organisation_1.default.create({
                name: `${firstName}'s Organisation`,
                description: `Default organisation for ${firstName} ${lastName}`,
            }, { transaction });
            // Link user and organisation (assuming you have a UserOrganisation model)
            try {
                yield db_1.sequelize.models.UserOrganisation.create({
                    UserUserId: user.userId,
                    OrganisationOrgId: organisation.orgId,
                }, { transaction });
            }
            catch (error) {
                console.error("Error creating UserOrganisation:", error);
                throw error; // Re-throw to trigger transaction rollback
            }
            yield transaction.commit();
            // Generate JWT token
            const token = jsonwebtoken_1.default.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
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
        }
        catch (error) {
            yield transaction.rollback();
            console.error("Error during registration:", error);
            res.status(400).json({ status: "Bad request", message: "Registration unsuccessful", statusCode: 400 });
        }
    }
    catch (error) {
        console.error("Error during registration:", error);
        res.status(400).json({ status: "Bad request", message: "Registration unsuccessful", statusCode: 400 });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        console.log("Attempting login for email:", email);
        // Fetch the user using Sequelize
        const user = yield user_1.default.findOne({ where: { email } });
        if (!user) {
            console.log("User not found for email:", email);
            return res.status(401).json({ status: "Bad request", message: "Authentication failed", statusCode: 401 });
        }
        console.log("User found:", user.userId);
        // Verify password
        const isPasswordValid = yield user.comparePassword(password);
        if (!isPasswordValid) {
            console.log("Invalid password for user:", user.userId);
            return res.status(401).json({ status: "Bad request", message: "Authentication failed", statusCode: 401 });
        }
        console.log("Password valid for user:", user.userId);
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
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
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(401).json({ status: "Bad request", message: "Authentication failed", statusCode: 401 });
    }
});
exports.login = login;
//# sourceMappingURL=auth.controller.js.map