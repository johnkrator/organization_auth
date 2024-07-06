"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./config/db");
const app = (0, express_1.default)();
app.get("/api/test", (_req, res) => {
    res.send("Hello World");
});
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
exports.default = app;
//# sourceMappingURL=index.js.map