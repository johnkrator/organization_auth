"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("./config/db");
exports.app = (0, express_1.default)();
exports.app.get("/api/test", (_req, res) => {
    res.send("Hello World");
});
const port = process.env.PORT;
db_1.dbConnected
    .then(() => {
    exports.app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
    .catch((error) => {
    console.error("Server failed to start due to database connection error:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map