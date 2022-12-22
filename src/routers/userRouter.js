const express = require("express");
const userController = require("../controllers/userController");
const userRouter = express.Router();
const upload = require("../middlewares/upload");

userRouter.get("/getUser", userController.getUser);
userRouter.post("/postNewUser", userController.postNewUser);
userRouter.delete("/deleteUser/:id", userController.deleteUser);
userRouter.get("/getUserById/:id", userController.getUserInfoById);
userRouter.get("/getUserPagination", userController.getUserPagination);
userRouter.put("/updateUser/:id", userController.udpateUserById);
userRouter.get("/getUserInfoByName/:name", userController.getUserInfoByName);
userRouter.post(
  "/uploadAvatar/:id",
  upload.single("upload"),
  userController.uploadAvatar
);

module.exports = userRouter;
