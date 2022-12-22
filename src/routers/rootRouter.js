const express = require("express");
const rootRouter = express.Router();

const authRouter = require("../routers/authRouter");
const bookingRouter = require("./bookingRouter");
const commentRouter = require("./commentRouter");
const locationRouter = require("./locationRouter");
const roomRouter = require("./roomRouter");
const userRouter = require("./userRouter");

rootRouter.use("/auth", authRouter);
rootRouter.use("/user", userRouter);
rootRouter.use("/comment", commentRouter);
rootRouter.use("/booking", bookingRouter);
rootRouter.use("/room", roomRouter);
rootRouter.use("/location", locationRouter);

module.exports = rootRouter;
