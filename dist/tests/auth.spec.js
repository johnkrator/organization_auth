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
const supertest_1 = __importDefault(require("supertest"));
const db_1 = require("../src/config/db");
const user_1 = __importDefault(require("../src/models/user"));
const organisation_1 = __importDefault(require("../src/models/organisation"));
const src_1 = __importDefault(require("../src"));
// Mock the JWT secret
process.env.JWT_SECRET = "JWT_SECRET";
// Mock the User and Organisation models
jest.mock("../src/models/user");
jest.mock("../src/models/organisation");
let server;
describe("Auth API", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        jest.setTimeout(30000); // Increase the timeout to 30 seconds
        yield db_1.sequelize.sync({ force: true }); // Drop and recreate the database tables
        server = src_1.default.listen(3001); // Start the server on a different port for testing
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        server.close(); // Close the server after tests
        yield db_1.sequelize.close(); // Close the database connection
    }));
    describe("POST /auth/register", () => {
        it("should register a new user and return a JWT token", () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: "password123",
                phone: "1234567890",
            };
            const userResponse = Object.assign({ userId: 1 }, userData);
            const organisationResponse = {
                orgId: 1,
                name: "John's Organisation",
                description: "Default organisation for John Doe",
            };
            user_1.default.create.mockResolvedValue(userResponse);
            organisation_1.default.create.mockResolvedValue(organisationResponse);
            const response = yield (0, supertest_1.default)(src_1.default)
                .post("/auth/register")
                .send(userData)
                .expect("Content-Type", /json/)
                .expect(201);
            expect(response.body.status).toBe("success");
            expect(response.body.data.accessToken).toBeDefined();
            expect(response.body.data.user.email).toBe(userData.email);
        }));
        it("should fail if user creation fails", () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: "password123",
                phone: "1234567890",
            };
            user_1.default.create.mockRejectedValue(new Error("User creation failed"));
            const response = yield (0, supertest_1.default)(src_1.default)
                .post("/auth/register")
                .send(userData)
                .expect("Content-Type", /json/)
                .expect(400);
            expect(response.body.status).toBe("Bad request");
        }));
    });
    describe("POST /auth/login", () => {
        it("should log in an existing user and return a JWT token", () => __awaiter(void 0, void 0, void 0, function* () {
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
            user_1.default.findOne.mockResolvedValue(userResponse);
            const response = yield (0, supertest_1.default)(src_1.default)
                .post("/auth/login")
                .send(loginData)
                .expect("Content-Type", /json/)
                .expect(200);
            expect(response.body.status).toBe("success");
            expect(response.body.data.accessToken).toBeDefined();
            expect(response.body.data.user.email).toBe(loginData.email);
        }));
        it("should fail if the user does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
            const loginData = {
                email: "john.doe@example.com",
                password: "password123",
            };
            user_1.default.findOne.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(src_1.default)
                .post("/auth/login")
                .send(loginData)
                .expect("Content-Type", /json/)
                .expect(401);
            expect(response.body.status).toBe("Bad request");
        }));
        it("should fail if the password is incorrect", () => __awaiter(void 0, void 0, void 0, function* () {
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
            user_1.default.findOne.mockResolvedValue(userResponse);
            const response = yield (0, supertest_1.default)(src_1.default)
                .post("/auth/login")
                .send(loginData)
                .expect("Content-Type", /json/)
                .expect(401);
            expect(response.body.status).toBe("Bad request");
        }));
    });
});
//# sourceMappingURL=auth.spec.js.map