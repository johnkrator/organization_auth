import request from "supertest";
import {sequelize} from "../src/config/db";
import User from "../src/models/user";
import app from "../src";

// Mock the User model
jest.mock("../src/models/user");

describe("User API", () => {
    beforeAll(async () => {
        await sequelize.sync({force: true}); // Drop and recreate the database tables
    });

    afterAll(async () => {
        await sequelize.close(); // Close the database connection
    });

    describe("GET /api/users/:id", () => {
        it("should retrieve a user by ID", async () => {
            const userMock = {
                userId: 1,
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                phone: "1234567890"
            };

            (User.findByPk as jest.Mock).mockResolvedValue(userMock);

            const response = await request(app)
                .get("/api/users/1")
                .expect("Content-Type", /json/)
                .expect(200);

            expect(response.body.status).toBe("success");
            expect(response.body.data.email).toBe(userMock.email);
        });

        it("should return 404 if the user is not found", async () => {
            (User.findByPk as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .get("/api/users/1")
                .expect("Content-Type", /json/)
                .expect(404);

            expect(response.body.status).toBe("Not found");
        });

        it("should return 500 if there is a server error", async () => {
            (User.findByPk as jest.Mock).mockRejectedValue(new Error("Server error"));

            const response = await request(app)
                .get("/api/users/1")
                .expect("Content-Type", /json/)
                .expect(500);

            expect(response.body.status).toBe("Server error");
        });
    });
});
