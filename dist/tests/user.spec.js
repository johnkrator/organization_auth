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
const src_1 = __importDefault(require("../src"));
// Mock the User model
jest.mock("../src/models/user");
describe("User API", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.sequelize.sync({ force: true }); // Drop and recreate the database tables
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.sequelize.close(); // Close the database connection
    }));
    describe("GET /api/users/:id", () => {
        it("should retrieve a user by ID", () => __awaiter(void 0, void 0, void 0, function* () {
            const userMock = {
                userId: 1,
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                phone: "1234567890"
            };
            user_1.default.findByPk.mockResolvedValue(userMock);
            const response = yield (0, supertest_1.default)(src_1.default)
                .get("/api/users/1")
                .expect("Content-Type", /json/)
                .expect(200);
            expect(response.body.status).toBe("success");
            expect(response.body.data.email).toBe(userMock.email);
        }));
        it("should return 404 if the user is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            user_1.default.findByPk.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(src_1.default)
                .get("/api/users/1")
                .expect("Content-Type", /json/)
                .expect(404);
            expect(response.body.status).toBe("Not found");
        }));
        it("should return 500 if there is a server error", () => __awaiter(void 0, void 0, void 0, function* () {
            user_1.default.findByPk.mockRejectedValue(new Error("Server error"));
            const response = yield (0, supertest_1.default)(src_1.default)
                .get("/api/users/1")
                .expect("Content-Type", /json/)
                .expect(500);
            expect(response.body.status).toBe("Server error");
        }));
    });
});
//# sourceMappingURL=user.spec.js.map