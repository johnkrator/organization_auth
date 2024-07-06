interface OrganisationAttributes {
    orgId: string;
    name: string;
    description?: string;
}

class Organisation implements OrganisationAttributes {
    public orgId: string;
    public name: string;
    public description?: string;

    constructor(attributes: OrganisationAttributes) {
        this.orgId = attributes.orgId;
        this.name = attributes.name;
        this.description = attributes.description;
    }
}

export default Organisation;
