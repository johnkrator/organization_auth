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
describe("Organisation API", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        jest.setTimeout(30000); // Increase the timeout to 30 seconds
        yield db_1.sequelize.sync({ force: true }); // Drop and recreate the database tables
        server = src_1.default.listen(3001); // Start the server on a different port for testing
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        server.close(); // Close the server after tests
        yield db_1.sequelize.close(); // Close the database connection
    }));
    describe("GET /api/organisations", () => {
        it("should retrieve all organisations for a user", () => __awaiter(void 0, void 0, void 0, function* () {
            const userMock = {
                userId: 1,
                getOrganisations: jest.fn().mockResolvedValue([{ orgId: 1, name: "Test Org" }])
            };
            user_1.default.findByPk.mockResolvedValue(userMock);
            const response = yield (0, supertest_1.default)(src_1.default)
                .get("/api/organisations")
                .set("Authorization", "Bearer valid-token")
                .expect("Content-Type", /json/)
                .expect(200);
            expect(response.body.status).toBe("success");
            expect(response.body.data.organisations).toHaveLength(1);
            expect(response.body.data.organisations[0].name).toBe("Test Org");
        }));
    });
    describe("GET /api/organisations/:orgId", () => {
        it("should retrieve an organisation by ID if the user has access", () => __awaiter(void 0, void 0, void 0, function* () {
            const userMock = {
                userId: 1,
                hasOrganisation: jest.fn().mockResolvedValue(true)
            };
            const organisationMock = { orgId: 1, name: "Test Org" };
            user_1.default.findByPk.mockResolvedValue(userMock);
            organisation_1.default.findByPk.mockResolvedValue(organisationMock);
            const response = yield (0, supertest_1.default)(src_1.default)
                .get("/api/organisations/1")
                .set("Authorization", "Bearer valid-token")
                .expect("Content-Type", /json/)
                .expect(200);
            expect(response.body.status).toBe("success");
            expect(response.body.data.name).toBe("Test Org");
        }));
        it("should return 404 if the organisation is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            organisation_1.default.findByPk.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(src_1.default)
                .get("/api/organisations/1")
                .set("Authorization", "Bearer valid-token")
                .expect("Content-Type", /json/)
                .expect(404);
            expect(response.body.status).toBe("Not found");
        }));
        it("should return 403 if the user does not have access", () => __awaiter(void 0, void 0, void 0, function* () {
            const userMock = {
                userId: 1,
                hasOrganisation: jest.fn().mockResolvedValue(false)
            };
            const organisationMock = { orgId: 1, name: "Test Org" };
            user_1.default.findByPk.mockResolvedValue(userMock);
            organisation_1.default.findByPk.mockResolvedValue(organisationMock);
            const response = yield (0, supertest_1.default)(src_1.default)
                .get("/api/organisations/1")
                .set("Authorization", "Bearer valid-token")
                .expect("Content-Type", /json/)
                .expect(403);
            expect(response.body.status).toBe("Forbidden");
        }));
    });
    describe("POST /api/organisations", () => {
        it("should create a new organisation", () => __awaiter(void 0, void 0, void 0, function* () {
            const userMock = {
                userId: 1,
                addOrganisation: jest.fn()
            };
            const organisationMock = { orgId: 1, name: "Test Org", description: "A test organisation" };
            user_1.default.findByPk.mockResolvedValue(userMock);
            organisation_1.default.create.mockResolvedValue(organisationMock);
            const organisationData = {
                name: "Test Org",
                description: "A test organisation"
            };
            const response = yield (0, supertest_1.default)(src_1.default)
                .post("/api/organisations")
                .set("Authorization", "Bearer valid-token")
                .send(organisationData)
                .expect("Content-Type", /json/)
                .expect(201);
            expect(response.body.status).toBe("success");
            expect(response.body.data.name).toBe("Test Org");
        }));
        it("should return 422 if the organisation creation fails validation", () => __awaiter(void 0, void 0, void 0, function* () {
            const validationError = {
                name: "SequelizeValidationError",
                errors: [{ path: "name", message: "Name is required" }]
            };
            organisation_1.default.create.mockRejectedValue(validationError);
            const organisationData = {
                description: "A test organisation"
            };
            const response = yield (0, supertest_1.default)(src_1.default)
                .post("/api/organisations")
                .set("Authorization", "Bearer valid-token")
                .send(organisationData)
                .expect("Content-Type", /json/)
                .expect(422);
            expect(response.body.errors).toHaveLength(1);
            expect(response.body.errors[0].message).toBe("Name is required");
        }));
    });
    describe("POST /api/organisations/:orgId/users", () => {
        it("should add a user to an organisation", () => __awaiter(void 0, void 0, void 0, function* () {
            const organisationMock = {
                orgId: 1,
                addUser: jest.fn()
            };
            const userMock = {
                userId: 2,
            };
            organisation_1.default.findByPk.mockResolvedValue(organisationMock);
            user_1.default.findByPk.mockResolvedValue(userMock);
            const response = yield (0, supertest_1.default)(src_1.default)
                .post("/api/organisations/1/users")
                .send({ userId: 2 })
                .expect("Content-Type", /json/)
                .expect(200);
            expect(response.body.status).toBe("success");
            expect(response.body.message).toBe("User added to organisation successfully");
        }));
        it("should return 404 if the organisation or user is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            organisation_1.default.findByPk.mockResolvedValue(null);
            user_1.default.findByPk.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(src_1.default)
                .post("/api/organisations/1/users")
                .send({ userId: 2 })
                .expect("Content-Type", /json/)
                .expect(404);
            expect(response.body.status).toBe("Not found");
        }));
    });
});
//# sourceMappingURL=organization.spec.js.map