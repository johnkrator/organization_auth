import request from "supertest";
import {sequelize} from "../src/config/db";
import User from "../src/models/user";
import Organisation from "../src/models/organisation";
import app from "../src";

// Mock the JWT secret
process.env.JWT_SECRET = "JWT_SECRET";

// Mock the User and Organisation models
jest.mock("../src/models/user");
jest.mock("../src/models/organisation");

let server: any;

describe("Auth API", () => {
    beforeAll(async () => {
        jest.setTimeout(30000); // Increase the timeout to 30 seconds

        await sequelize.sync({force: true}); // Drop and recreate the database tables

        server = app.listen(3001); // Start the server on a different port for testing
    });

    afterAll(async () => {
        server.close(); // Close the server after tests
        await sequelize.close(); // Close the database connection
    });

    describe("POST /auth/register", () => {
        it("should register a new user and return a JWT token", async () => {
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: "password123",
                phone: "1234567890",
            };

            const userResponse = {
                userId: 1,
                ...userData,
            };

            const organisationResponse = {
                orgId: 1,
                name: "John's Organisation",
                description: "Default organisation for John Doe",
            };

            (User.create as jest.Mock).mockResolvedValue(userResponse);
            (Organisation.create as jest.Mock).mockResolvedValue(organisationResponse);

            const response = await request(app)
                .post("/auth/register")
                .send(userData)
                .expect("Content-Type", /json/)
                .expect(201);

            expect(response.body.status).toBe("success");
            expect(response.body.data.accessToken).toBeDefined();
            expect(response.body.data.user.email).toBe(userData.email);
        });

        it("should fail if user creation fails", async () => {
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: "password123",
                phone: "1234567890",
            };

            (User.create as jest.Mock).mockRejectedValue(new Error("User creation failed"));

            const response = await request(app)
                .post("/auth/register")
                .send(userData)
                .expect("Content-Type", /json/)
                .expect(400);

            expect(response.body.status).toBe("Bad request");
        });
    });

    describe("POST /auth/login", () => {
        it("should log in an existing user and return a JWT token", async () => {
            const loginData = {
                email: "john.doe@example.com",
                password: "password123",
            };

            const userResponse = {
                userId: 1,
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                phone: "1234567890",
                comparePassword: jest.fn().mockResolvedValue(true),
            };

            (User.findOne as jest.Mock).mockResolvedValue(userResponse);

            const response = await request(app)
                .post("/auth/login")
                .send(loginData)
                .expect("Content-Type", /json/)
                .expect(200);

            expect(response.body.status).toBe("success");
            expect(response.body.data.accessToken).toBeDefined();
            expect(response.body.data.user.email).toBe(loginData.email);
        });

        it("should fail if the user does not exist", async () => {
            const loginData = {
                email: "john.doe@example.com",
                password: "password123",
            };

            (User.findOne as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .post("/auth/login")
                .send(loginData)
                .expect("Content-Type", /json/)
                .expect(401);

            expect(response.body.status).toBe("Bad request");
        });

        it("should fail if the password is incorrect", async () => {
            const loginData = {
                email: "john.doe@example.com",
                password: "password123",
            };

            const userResponse = {
                userId: 1,
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                phone: "1234567890",
                comparePassword: jest.fn().mockResolvedValue(false),
            };

            (User.findOne as jest.Mock).mockResolvedValue(userResponse);

            const response = await request(app)
                .post("/auth/login")
                .send(loginData)
                .expect("Content-Type", /json/)
                .expect(401);

            expect(response.body.status).toBe("Bad request");
        });
    });
});
