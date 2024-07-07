"use strict";
// import {Model, DataTypes, Optional} from "sequelize";
// import bcrypt from "bcryptjs";
// import {sequelize} from "../config/db";
// import {UserModel} from "../types/models";
//
// export interface UserAttributes {
//     userId: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//     password: string;
//     phone?: string;
// }
//
// interface UserCreationAttributes extends Optional<UserAttributes, "userId"> {
// }
//
// const User = sequelize.define<UserModel>("User", {
//     userId: {
//         type: DataTypes.UUID,
//         defaultValue: DataTypes.UUIDV4,
//         primaryKey: true,
//     },
//     firstName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     lastName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//         validate: {
//             isEmail: true,
//         },
//     },
//     password: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     phone: {
//         type: DataTypes.STRING,
//     },
// }, {
//     hooks: {
//         beforeCreate: async (user: UserModel) => {
//             const salt = await bcrypt.genSalt(10);
//             user.password = await bcrypt.hash(user.password, salt);
//         }
//     }
// });
//
// User.prototype.comparePassword = async function (candidatePassword: string): Promise<boolean> {
//     return await bcrypt.compare(candidatePassword, this.password);
// };
//
// export default User;
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
const sequelize_1 = require("sequelize");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../config/db");
class User extends sequelize_1.Model {
    comparePassword(candidatePassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcryptjs_1.default.compare(candidatePassword, this.password);
        });
    }
}
User.init({
    userId: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    sequelize: db_1.sequelize,
    modelName: "User",
});
User.beforeCreate((user) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcryptjs_1.default.genSalt(10);
    user.password = yield bcryptjs_1.default.hash(user.password, salt);
}));
exports.default = User;
//# sourceMappingURL=user.js.map