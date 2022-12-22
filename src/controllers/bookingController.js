const express = require("express");
const app = express();
app.use(express.json());

const { successCode, failCode, errorCode } = require("../ultis/response");

const { PrismaClient } = require("@prisma/client");
const { object, date } = require("yup");
const moment = require("moment/moment");
const prisma = new PrismaClient();

const getBookingList = async (req, res) => {
  try {
    const bookingList = await prisma.booking.findMany();
    successCode(res, bookingList, "lấy danh sách thành công");
  } catch (err) {
    errorCode(res, "lấy danh sách không thành công");
  }
};

const postBooking = async (req, res) => {
  try {
    const { room_id, checkin, checkout, numberOfGuest, user_id } = req.body;

    const checkUser = await prisma.users.findMany({
      where: {
        user_id: user_id * 1,
      },
    });

    if (checkUser.length === 0) {
      failCode(res, "", "vui lòng đăng ký tài khoàn trước khi đặt phòng");
    } else {
      const checkRoom = await prisma.room.findMany({
        where: {
          room_id: room_id * 1,
        },
      });

      if (checkRoom.length === 0) {
        failCode(res, "", "phòng bạn đặt không có sẵn");
      } else {
        let newBooking = {
          room_id,
          booker_id: user_id * 1,
          checkin: new Date(checkin).toISOString(),
          checkout: new Date(checkout).toISOString(),
          numberOfGuest,
        };

        const result = await prisma.booking.create({
          data: newBooking,
        });

        successCode(res, result, "đặt phòng thành công");
      }
    }
  } catch (err) {
    errorCode(res, err.message);
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    // lấy thông tin đặt phòng theo mã người dùng
    let checkId = await prisma.users.findMany({
      where: {
        user_id: id * 1,
      },
    });

    if (checkId.length === 0) {
      failCode(res, "", "không tìm thấy người dùng");
    } else {
      const result = await prisma.booking.findMany({
        where: {
          booker_id: id * 1,
        },
      });
      successCode(res, result, "lấy dữ liệu thành công");
    }
  } catch (err) {
    errorCode(res, "lấy dữ liệu không thành công");
  }
};

const deleteBookingData = async (req, res) => {
  try {
    const { id } = req.params;

    let checkId = await prisma.booking.findMany({
      where: {
        booking_id: id * 1,
      },
    });

    if (checkId.length === 0) {
      failCode(res, "", "mã đặt phòng không tồn tại");
    } else {
      const result = await prisma.booking.delete({
        where: {
          booking_id: id * 1,
        },
      });

      successCode(res, result, "xoá thành công");
    }
  } catch (err) {
    errorCode(res, "xoá thất bại");
  }
};

const updateBookingData = async (req, res) => {
  try {
    const { id } = req.params;
    const { room_id, checkin, checkout, numberOfGuest, user_id } = req.body;

    let checkBookingId = await prisma.booking.findMany({
      where: {
        booking_id: id * 1,
      },
    });

    if (checkBookingId.length === 0) {
      failCode(res, "", "mã đặt phòng không tồn tại");
    } else {
      let checkRoomId = await prisma.room.findMany({
        where: {
          room_id: room_id * 1,
        },
      });

      if (checkRoomId.length === 0) {
        failCode(res, "", "không tồn tại phòng này");
      } else {
        let checkUserId = await prisma.users.findMany({
          where: {
            user_id: user_id * 1,
          },
        });

        if (checkUserId.length === 0) {
          failCode(res, "", "người dùng không tồn tại");
        } else {
          let newBookingData = {
            room_id,
            checkin: new Date(checkin).toISOString(),
            checkout: new Date(checkout).toISOString(),
            numberOfGuest,
            booker_id: user_id * 1,
          };

          const result = await prisma.booking.update({
            where: {
              booking_id: id * 1,
            },
            data: newBookingData,
          });

          successCode(res, result, "cập nhật thành công");
        }
      }
    }
  } catch (err) {
    errorCode(res, "cập nhật thất bại");
  }
};

module.exports = {
  getBookingList,
  postBooking,
  getBookingById,
  updateBookingData,
  deleteBookingData,
};
