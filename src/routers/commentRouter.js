const express = require("express");
const commentController = require("../controllers/commentController");
const commentRouter = express.Router();

commentRouter.get("/getCommentList", commentController.getComment);
commentRouter.post("/postComment", commentController.postComment);
commentRouter.put("/putComment/:id", commentController.putComment);
commentRouter.delete("/deleteComment/:id", commentController.deleteComment);
commentRouter.get(
  "/getCommentByRoomId/:id",
  commentController.getCommentByRoomId
);

module.exports = commentRouter;
