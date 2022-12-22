const express = require("express");
const app = express();
app.use(express.json());

const { object, string } = require("yup");
const { successCode, failCode, errorCode } = require("../ultis/response");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getComment = async (req, res) => {
  try {
    const commentList = await prisma.comments.findMany();
    res.send(commentList);
  } catch (err) {
    errorCode(res, "information retrieval failure");
  }
};

const postComment = async (req, res) => {
  try {
    const { commentator_id, room_id, content, comment_rate } = req.body;
    const newComment = {
      commentator_id,
      room_id,
      comment_day: new Date(),
      content,
      comment_rate,
    };
    const checkUser = await prisma.users.findMany({
      where: {
        user_id: commentator_id,
      },
    });

    if (checkUser.length === 0) {
      failCode(
        res,
        "",
        "tài khoản không tồn tại, vui lòng đăng kí trước khi bình luận"
      );
    } else {
      let addNewComment = await prisma.comments.create({
        data: newComment,
      });
      successCode(res, addNewComment, "thêm bình luận thành công");
    }
  } catch (err) {
    errorCode(res, err.message);
  }
};

const putComment = async (req, res) => {
  try {
    const { id } = req.params;
    const getCommentById = await prisma.comments.findMany({
      where: {
        comment_id: id * 1,
      },
    });

    if (getCommentById.length === 0) {
      failCode(res, "", "mã bình luận không đúng");
    } else {
      const { commentator_id, room_id, content, comment_rate } = req.body;

      const commentUpdated = await prisma.comments.update({
        where: {
          comment_id: id * 1,
        },
        data: {
          commentator_id,
          room_id,
          comment_day: new Date(),
          content,
          comment_rate,
        },
      });

      successCode(res, commentUpdated, "cập nhật thành công");
    }
  } catch (err) {
    errorCode(res, "cập nhật comment thất bại");
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    let checkID = await prisma.comments.findMany({
      where: {
        comment_id: id * 1,
      },
    });

    if (checkID.length === 0) {
      failCode(res, "", "mã comment không tồn tại");
    } else {
      const deleteComment = await prisma.comments.delete({
        where: {
          comment_id: id * 1,
        },
      });

      successCode(res, deleteComment, "xoá thành công");
    }
  } catch (err) {
    errorCode(res, "xoá comment thất bại");
  }
};

const getCommentByRoomId = async (req, res) => {
  try {
    const { id } = req.params;
    let checkID = await prisma.room.findMany({
      where: {
        room_id: id * 1,
      },
    });

    if (checkID.length === 0) {
      failCode(res, "", "mã phòng không tồn tại");
    } else {
      const commentByRoomId = await prisma.comments.findMany({
        where: {
          room_id: id * 1,
        },
      });

      successCode(res, commentByRoomId, "tìm kiếm thành công");
    }
  } catch (err) {
    errorCode(res, "lấy bình luận thất bại");
  }
};

module.exports = {
  getComment,
  postComment,
  putComment,
  deleteComment,
  getCommentByRoomId,
};
