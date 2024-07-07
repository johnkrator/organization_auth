import {Model, DataTypes, Optional} from "sequelize";
import {sequelize} from "../config/db";

interface OrganisationAttributes {
    orgId: string;
    name: string;
    description?: string;
}

interface OrganisationCreationAttributes extends Optional<OrganisationAttributes, "orgId"> {
}

class Organisation extends Model<OrganisationAttributes, OrganisationCreationAttributes> implements OrganisationAttributes {
    public orgId!: string;
    public name!: string;
    public description?: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Organisation.init(
    {
        orgId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: "Organisation",
    }
);

export default Organisation;
