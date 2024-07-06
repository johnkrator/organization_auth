import express, {Application} from "express";
import {dbConnected} from "./config/db";

const app: Application = express();

app.get("/api/test", (_req, res) => {
    res.send("Hello World");
});

const port = process.env.PORT;

dbConnected
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error: any) => {
        console.error("Server failed to start due to database connection error:", error);
        process.exit(1);
    });

export default app;
