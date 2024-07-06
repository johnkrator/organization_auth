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
exports.dbConnected = exports.pool = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config();
const adminPool = new pg_1.Pool({
    connectionString: process.env.POSTGRES_URL, // URL for connecting to PostgreSQL server
});
const databaseName = new URL(process.env.POSTGRES_URL).pathname.split("/")[1];
const createDatabaseIfNotExists = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield adminPool.connect();
    try {
        const result = yield client.query(`SELECT 1
                                           FROM pg_database
                                           WHERE datname = '${databaseName}'`);
        if (result.rowCount === 0) {
            yield client.query(`CREATE DATABASE ${databaseName}`);
            console.log(`Database ${databaseName} created successfully`);
        }
        else {
            console.log(`Database ${databaseName} already exists`);
        }
    }
    catch (error) {
        console.error("Error checking/creating database:", error);
        throw error;
    }
    finally {
        client.release();
    }
});
exports.pool = new pg_1.Pool({
    connectionString: process.env.POSTGRES_URL,
});
exports.dbConnected = new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield createDatabaseIfNotExists();
        const client = yield exports.pool.connect();
        client.release();
        console.log("Connected to database");
        resolve();
    }
    catch (error) {
        console.error("Failed to connect to database:", error);
        reject(error);
    }
}));
//# sourceMappingURL=db.js.map