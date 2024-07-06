interface UserAttributes {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
}

class User implements UserAttributes {
    public userId: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public phone?: string;

    constructor(attributes: UserAttributes) {
        this.userId = attributes.userId;
        this.firstName = attributes.firstName;
        this.lastName = attributes.lastName;
        this.email = attributes.email;
        this.password = attributes.password;
        this.phone = attributes.phone;
    }
}

export default User;
