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
exports.addUserToOrganisation = exports.createOrganisation = exports.getOrganisationById = exports.getAllOrganisations = void 0;
const organisation_1 = __importDefault(require("../models/organisation"));
const user_1 = __importDefault(require("../models/user"));
const getAllOrganisations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findByPk(req.user.userId);
        const organisations = yield user.getOrganisations();
        res.status(200).json({
            status: "success",
            message: "Organisations retrieved successfully",
            data: { organisations },
        });
    }
    catch (error) {
        res.status(500).json({ status: "Server error", message: "An error occurred", statusCode: 500 });
    }
});
exports.getAllOrganisations = getAllOrganisations;
const getOrganisationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findByPk(req.user.userId);
        const organisation = yield organisation_1.default.findByPk(req.params.orgId);
        if (!organisation) {
            return res.status(404).json({ status: "Not found", message: "Organisation not found", statusCode: 404 });
        }
        const hasAccess = yield user.hasOrganisation(organisation);
        if (!hasAccess) {
            return res.status(403).json({ status: "Forbidden", message: "Access denied", statusCode: 403 });
        }
        res.status(200).json({
            status: "success",
            message: "Organisation retrieved successfully",
            data: organisation,
        });
    }
    catch (error) {
        res.status(500).json({ status: "Server error", message: "An error occurred", statusCode: 500 });
    }
});
exports.getOrganisationById = getOrganisationById;
const createOrganisation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.body;
        const user = yield user_1.default.findByPk(req.user.userId);
        const organisation = yield organisation_1.default.create({ name, description });
        yield user.addOrganisation(organisation);
        res.status(201).json({
            status: "success",
            message: "Organisation created successfully",
            data: organisation,
        });
    }
    catch (error) {
        if (error.name === "SequelizeValidationError") {
            const errors = error.errors.map((err) => ({ field: err.path, message: err.message }));
            return res.status(422).json({ errors });
        }
        res.status(400).json({ status: "Bad Request", message: "Client error", statusCode: 400 });
    }
});
exports.createOrganisation = createOrganisation;
const addUserToOrganisation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const organisation = yield organisation_1.default.findByPk(req.params.orgId);
        const user = yield user_1.default.findByPk(userId);
        if (!organisation || !user) {
            return res.status(404).json({
                status: "Not found",
                message: "Organisation or user not found",
                statusCode: 404
            });
        }
        yield organisation.addUser(user);
        res.status(200).json({
            status: "success",
            message: "User added to organisation successfully",
        });
    }
    catch (error) {
        res.status(500).json({ status: "Server error", message: "An error occurred", statusCode: 500 });
    }
});
exports.addUserToOrganisation = addUserToOrganisation;
//# sourceMappingURL=organisation.controller.js.map