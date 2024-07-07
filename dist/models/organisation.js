"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
class Organisation extends sequelize_1.Model {
}
Organisation.init({
    orgId: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    sequelize: db_1.sequelize,
    modelName: "Organisation",
});
exports.default = Organisation;
//# sourceMappingURL=organisation.js.map