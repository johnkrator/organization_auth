import dotenv from "dotenv";
import {Pool} from "pg";
import {Sequelize} from "sequelize";

dotenv.config();

const adminPool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

const databaseName = new URL(process.env.POSTGRES_URL).pathname.split("/")[1];

const createDatabaseIfNotExists = async () => {
    const client = await adminPool.connect();
    try {
        const result = await client.query(`SELECT 1
                                           FROM pg_database
                                           WHERE datname = '${databaseName}'`);
        if (result.rowCount === 0) {
            await client.query(`CREATE DATABASE ${databaseName}`);
            console.log(`Database ${databaseName} created successfully`);
        } else {
            console.log(`Database ${databaseName} already exists`);
        }
    } catch (error) {
        console.error("Error checking/creating database:", error);
        throw error;
    } finally {
        client.release();
    }
};

export const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

export const sequelize = new Sequelize(process.env.POSTGRES_URL, {
    dialect: "postgres",
    logging: false,
});

export const dbConnected = new Promise<void>(async (resolve, reject) => {
    try {
        await createDatabaseIfNotExists();
        await sequelize.authenticate();
        console.log("Connected to database");
        resolve();
    } catch (error) {
        console.error("Failed to connect to database:", error);
        reject(error);
    }
});


// import dotenv from "dotenv";
// import {Pool} from "pg";
//
// dotenv.config();
//
// const adminPool = new Pool({
//     connectionString: process.env.POSTGRES_URL, // URL for connecting to PostgreSQL server
// });
//
// const databaseName = new URL(process.env.POSTGRES_URL).pathname.split("/")[1];
//
// const createDatabaseIfNotExists = async () => {
//     const client = await adminPool.connect();
//     try {
//         const result = await client.query(`SELECT 1
//                                            FROM pg_database
//                                            WHERE datname = '${databaseName}'`);
//         if (result.rowCount === 0) {
//             await client.query(`CREATE DATABASE ${databaseName}`);
//             console.log(`Database ${databaseName} created successfully`);
//         } else {
//             console.log(`Database ${databaseName} already exists`);
//         }
//     } catch (error) {
//         console.error("Error checking/creating database:", error);
//         throw error;
//     } finally {
//         client.release();
//     }
// };
//
// export const pool = new Pool({
//     connectionString: process.env.POSTGRES_URL,
// });
//
// export const dbConnected = new Promise<void>(async (resolve, reject) => {
//     try {
//         await createDatabaseIfNotExists();
//         const client = await pool.connect();
//         client.release();
//         console.log("Connected to database");
//         resolve();
//     } catch (error) {
//         console.error("Failed to connect to database:", error);
//         reject(error);
//     }
// });
