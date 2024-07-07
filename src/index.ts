import express, {Application} from "express";
import {dbConnected, sequelize} from "./config/db";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import apiRoutes from "./routes/api.routes";
import User from "./models/user";
import Organisation from "./models/organisation";
import {generalErrorHandler, notFoundErrorHandler} from "./middleware/errorMiddleware";

const app: Application = express();

app.get("/api/test", (_req, res) => {
    res.send("Hello World");
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Relationships
User.belongsToMany(Organisation, {through: "UserOrganisation", as: "Organisations"});
Organisation.belongsToMany(User, {through: "UserOrganisation", as: "Users"});

// Sync the database with the models
sequelize.sync()
    .then(() => {
        console.log("Database & tables created!");
    })
    .catch((error) => console.error("Unable to sync database:", error));

app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

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

// Error middleware
app.use(notFoundErrorHandler);
app.use(generalErrorHandler);

export default app;
