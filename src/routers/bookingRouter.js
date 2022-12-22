const express = require("express");
const bookingController = require("../controllers/bookingController");
const bookingRouter = express.Router();

bookingRouter.get("/getBookingList", bookingController.getBookingList);
bookingRouter.post("/postBooking", bookingController.postBooking);
bookingRouter.get("/getBookingById/:id", bookingController.getBookingById);
bookingRouter.put(
  "/updateBookingData/:id",
  bookingController.updateBookingData
);
bookingRouter.delete(
  "/deleteBookingData/:id",
  bookingController.deleteBookingData
);

module.exports = bookingRouter;
