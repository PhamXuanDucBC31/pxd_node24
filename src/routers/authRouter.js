const express = require("express");
const authController = require("../controllers/authController");
const authRouter = express.Router();

authRouter.post("/login", authController.login);
authRouter.post("/signUp", authController.signUp);

module.exports = authRouter;
