"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./config/db");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const api_routes_1 = __importDefault(require("./routes/api.routes"));
const user_1 = __importDefault(require("./models/user"));
const organisation_1 = __importDefault(require("./models/organisation"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const app = (0, express_1.default)();
app.get("/api/test", (_req, res) => {
    res.send("Hello World");
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Relationships
user_1.default.belongsToMany(organisation_1.default, { through: "UserOrganisation", as: "Organisations" });
organisation_1.default.belongsToMany(user_1.default, { through: "UserOrganisation", as: "Users" });
// Sync the database with the models
db_1.sequelize.sync()
    .then(() => {
    console.log("Database & tables created!");
})
    .catch((error) => console.error("Unable to sync database:", error));
app.use("/v1/auth", auth_routes_1.default);
app.use("/v1/api", api_routes_1.default);
const port = process.env.PORT;
db_1.dbConnected
    .then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
    .catch((error) => {
    console.error("Server failed to start due to database connection error:", error);
    process.exit(1);
});
// Error middleware
app.use(errorMiddleware_1.notFoundErrorHandler);
app.use(errorMiddleware_1.generalErrorHandler);
exports.default = app;
//# sourceMappingURL=index.js.map