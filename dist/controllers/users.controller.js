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
exports.getUserById = void 0;
const user_1 = __importDefault(require("../models/user"));
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findByPk(req.params.id, {
            attributes: ["userId", "firstName", "lastName", "email", "phone"],
        });
        if (!user) {
            return res.status(404).json({ status: "Not found", message: "User not found", statusCode: 404 });
        }
        res.status(200).json({
            status: "success",
            message: "User retrieved successfully",
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({ status: "Server error", message: "An error occurred", statusCode: 500 });
    }
});
exports.getUserById = getUserById;
//# sourceMappingURL=users.controller.js.map