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

describe("Organisation API", () => {
    beforeAll(async () => {
        jest.setTimeout(30000); // Increase the timeout to 30 seconds

        await sequelize.sync({force: true}); // Drop and recreate the database tables

        server = app.listen(3001); // Start the server on a different port for testing
    });

    afterAll(async () => {
        server.close(); // Close the server after tests
        await sequelize.close(); // Close the database connection
    });

    describe("GET /api/organisations", () => {
        it("should retrieve all organisations for a user", async () => {
            const userMock = {
                userId: 1,
                getOrganisations: jest.fn().mockResolvedValue([{orgId: 1, name: "Test Org"}])
            };

            (User.findByPk as jest.Mock).mockResolvedValue(userMock);

            const response = await request(app)
                .get("/api/organisations")
                .set("Authorization", "Bearer valid-token")
                .expect("Content-Type", /json/)
                .expect(200);

            expect(response.body.status).toBe("success");
            expect(response.body.data.organisations).toHaveLength(1);
            expect(response.body.data.organisations[0].name).toBe("Test Org");
        });
    });

    describe("GET /api/organisations/:orgId", () => {
        it("should retrieve an organisation by ID if the user has access", async () => {
            const userMock = {
                userId: 1,
                hasOrganisation: jest.fn().mockResolvedValue(true)
            };

            const organisationMock = {orgId: 1, name: "Test Org"};

            (User.findByPk as jest.Mock).mockResolvedValue(userMock);
            (Organisation.findByPk as jest.Mock).mockResolvedValue(organisationMock);

            const response = await request(app)
                .get("/api/organisations/1")
                .set("Authorization", "Bearer valid-token")
                .expect("Content-Type", /json/)
                .expect(200);

            expect(response.body.status).toBe("success");
            expect(response.body.data.name).toBe("Test Org");
        });

        it("should return 404 if the organisation is not found", async () => {
            (Organisation.findByPk as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .get("/api/organisations/1")
                .set("Authorization", "Bearer valid-token")
                .expect("Content-Type", /json/)
                .expect(404);

            expect(response.body.status).toBe("Not found");
        });

        it("should return 403 if the user does not have access", async () => {
            const userMock = {
                userId: 1,
                hasOrganisation: jest.fn().mockResolvedValue(false)
            };

            const organisationMock = {orgId: 1, name: "Test Org"};

            (User.findByPk as jest.Mock).mockResolvedValue(userMock);
            (Organisation.findByPk as jest.Mock).mockResolvedValue(organisationMock);

            const response = await request(app)
                .get("/api/organisations/1")
                .set("Authorization", "Bearer valid-token")
                .expect("Content-Type", /json/)
                .expect(403);

            expect(response.body.status).toBe("Forbidden");
        });
    });

    describe("POST /api/organisations", () => {
        it("should create a new organisation", async () => {
            const userMock = {
                userId: 1,
                addOrganisation: jest.fn()
            };

            const organisationMock = {orgId: 1, name: "Test Org", description: "A test organisation"};

            (User.findByPk as jest.Mock).mockResolvedValue(userMock);
            (Organisation.create as jest.Mock).mockResolvedValue(organisationMock);

            const organisationData = {
                name: "Test Org",
                description: "A test organisation"
            };

            const response = await request(app)
                .post("/api/organisations")
                .set("Authorization", "Bearer valid-token")
                .send(organisationData)
                .expect("Content-Type", /json/)
                .expect(201);

            expect(response.body.status).toBe("success");
            expect(response.body.data.name).toBe("Test Org");
        });

        it("should return 422 if the organisation creation fails validation", async () => {
            const validationError = {
                name: "SequelizeValidationError",
                errors: [{path: "name", message: "Name is required"}]
            };

            (Organisation.create as jest.Mock).mockRejectedValue(validationError);

            const organisationData = {
                description: "A test organisation"
            };

            const response = await request(app)
                .post("/api/organisations")
                .set("Authorization", "Bearer valid-token")
                .send(organisationData)
                .expect("Content-Type", /json/)
                .expect(422);

            expect(response.body.errors).toHaveLength(1);
            expect(response.body.errors[0].message).toBe("Name is required");
        });
    });

    describe("POST /api/organisations/:orgId/users", () => {
        it("should add a user to an organisation", async () => {
            const organisationMock = {
                orgId: 1,
                addUser: jest.fn()
            };

            const userMock = {
                userId: 2,
            };

            (Organisation.findByPk as jest.Mock).mockResolvedValue(organisationMock);
            (User.findByPk as jest.Mock).mockResolvedValue(userMock);

            const response = await request(app)
                .post("/api/organisations/1/users")
                .send({userId: 2})
                .expect("Content-Type", /json/)
                .expect(200);

            expect(response.body.status).toBe("success");
            expect(response.body.message).toBe("User added to organisation successfully");
        });

        it("should return 404 if the organisation or user is not found", async () => {
            (Organisation.findByPk as jest.Mock).mockResolvedValue(null);
            (User.findByPk as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .post("/api/organisations/1/users")
                .send({userId: 2})
                .expect("Content-Type", /json/)
                .expect(404);

            expect(response.body.status).toBe("Not found");
        });
    });
});
