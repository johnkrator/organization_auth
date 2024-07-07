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

import {Model, DataTypes, Optional, Association} from "sequelize";
import bcrypt from "bcryptjs";
import {sequelize} from "../config/db";
import Organisation from "./organisation";

interface UserAttributes {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "userId"> {
}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public userId!: string;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public password!: string;
    public phone?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Define the association
    public Organisations?: Organisation[];

    public static associations: {
        Organisations: Association<User, Organisation>;
    };

    public async comparePassword(candidatePassword: string): Promise<boolean> {
        return await bcrypt.compare(candidatePassword, this.password);
    }
}

User.init(
    {
        userId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: "User",
    }
);

User.beforeCreate(async (user: User) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
});

export default User;
