const express = require("express");
const locationController = require("../controllers/locationController");
const locationRouter = express.Router();
const upload = require("../middlewares/upload");

locationRouter.get("/getLocationList", locationController.getLocationList);
locationRouter.post("/addLocation", locationController.addLocation);
locationRouter.get(
  "/getLocationPagination",
  locationController.getLocationPagination
);
locationRouter.get("/getLocation/:id", locationController.getLocationById);
locationRouter.put(
  "/updateLocation/:id",
  locationController.updateLocationById
);
locationRouter.delete("/deleteLocation/:id", locationController.deleteLocation);
locationRouter.post(
  "/uploadLocationPic/:id",
  upload.single("upload"),
  locationController.uploadLocationPic
);

module.exports = locationRouter;
