import express from "express";
import * as userController from "../controllers/users.controller";
import * as organisationController from "../controllers/organisation.controller";
import authMiddleware from "../middleware/auth";

const router = express.Router();

router.get("/users/:id", authMiddleware, userController.getUserById);
router.get("/organisations", authMiddleware, organisationController.getAllOrganisations);
router.get("/organisations/:orgId", authMiddleware, organisationController.getOrganisationById);
router.post("/organisations", authMiddleware, organisationController.createOrganisation);
router.post("/organisations/:orgId/users", authMiddleware, organisationController.addUserToOrganisation);

export default router;
