const express = require("express");
const roomController = require("../controllers/roomController");
const upload = require("../middlewares/upload");
const roomRouter = express.Router();

roomRouter.get("/getRoomList", roomController.getRoomList);
roomRouter.post("/createRoom", roomController.createRoom);
roomRouter.get(
  "/getRoomByLocation/:locationID",
  roomController.getRoomByLocation
);
roomRouter.get("/getRoomPagination", roomController.getRoomPagination);
roomRouter.get("/getRoomById/:id", roomController.getRoomById);
roomRouter.put("/updateRoomInfo/:id", roomController.updateRoomInfo);
roomRouter.delete("/deleteRoom/:id", roomController.deleteRoom);
roomRouter.post(
  "/uploadRoomPic/:id",
  upload.single("upload"),
  roomController.uploadRoomPic
);

module.exports = roomRouter;
