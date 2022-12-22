const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static("."));
const fs = require("fs");

const { successCode, failCode, errorCode } = require("../ultis/response");

const { PrismaClient } = require("@prisma/client");
const { object, string, number, boolean } = require("yup");
const prisma = new PrismaClient();

const getRoomList = async (req, res) => {
  try {
    let result = await prisma.room.findMany();

    successCode(res, result, "lấy danh sách thành công");
  } catch (err) {
    errorCode(res, "lấy danh sách không thành công");
  }
};

const createRoom = async (req, res) => {
  try {
    const {
      creator_id,
      location_id,
      room_name,
      capacity,
      bed_room,
      bed,
      bath_room,
      description,
      price,
      washing_machine,
      iron,
      tv,
      air_conditioner,
      wifi,
      kitchen,
      parking_lot,
      swimming_pool,
      pic_description,
    } = req.body;

    let checkIsAdmin = await prisma.users.findMany({
      where: {
        user_id: creator_id * 1,
        role: "admin",
      },
    });

    if (checkIsAdmin.length === 0) {
      failCode(res, "", "chỉ có admin mới được tạo phòng!!");
    } else {
      let checkLocation = await prisma.location.findMany({
        where: {
          location_id: location_id * 1,
        },
      });

      if (checkLocation.length === 0) {
        failCode(res, "", "vui lòng tạo địa điểm trước khi tạo phòng");
      } else {
        const newRoom = {
          creator_id,
          location_id,
          room_name,
          capacity,
          bed_room,
          bed,
          bath_room,
          description,
          price,
          washing_machine,
          iron,
          tv,
          air_conditioner,
          wifi,
          kitchen,
          parking_lot,
          swimming_pool,
          pic_description,
        };

        const inputValidation = object({
          room_name: string()
            .required()
            .max(10, "room name cannot exceed 10 characters"),
          capacity: number().positive("số lượng người phải là số dương"),
          bed_room: number().positive("số lượng phòng ngủ phải là số dương"),
          bed: number().positive("số lượng giường phải là số dương"),
          bath_room: number().positive("số lượng phòng tắm phải là số dương"),
          description: string(),
          price: number().positive("giá thuê phòng phải là số dương"),
          washing_machine: boolean().required(),
          iron: boolean().required(),
          tv: boolean().required(),
          air_conditioner: boolean().required(),
          wifi: boolean().required(),
          kitchen: boolean().required(),
          parking_lot: boolean().required(),
          swimming_pool: boolean().required(),
          pic_description: string(),
        });

        const newValidatedRoom = await inputValidation.validate(await newRoom);

        const result = await prisma.room.create({
          data: newValidatedRoom,
        });

        successCode(res, result, "tạo phòng thành công");
      }
    }
  } catch (err) {
    errorCode(res, `cập nhật thất bại: ${err.message}`);
  }
};

const getRoomByLocation = async (req, res) => {
  try {
    const { locationID } = req.params;

    const checkLocationId = await prisma.location.findMany({
      where: {
        location_id: locationID * 1,
      },
    });

    if (checkLocationId.length === 0) {
      failCode(res, "", "địa điểm này không tồn tại hoặc chưa được tạo");
    } else {
      const result = await prisma.room.findMany({
        where: {
          location_id: locationID * 1,
        },
      });

      successCode(res, result, "lấy thông tin thành công");
    }
  } catch (err) {
    errorCode(res, "lấy thông tin thất bại");
  }
};

const getRoomPagination = async (req, res) => {
  try {
    const { pageIndex, pageSize, keyWord } = req.query;

    const result = await prisma.room.findMany({
      skip: (pageIndex * 1 - 1) * (pageSize * 1),
      take: pageSize * 1,
      where: {
        room_name: {
          contains: keyWord,
        },
      },
    });

    if (result.length === 0) {
      failCode(res, "", "không tìm thấy dữ liệu");
    } else {
      successCode(res, result, "tìm kiếm thành công");
    }
  } catch (err) {
    errorCode(res, "tìm kiếm thất bại");
  }
};

const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await prisma.room.findUnique({
      where: {
        room_id: id * 1,
      },
    });

    if (result == null) {
      failCode(res, "", "mã phòng không đúng hoặc không tồn tại");
    } else {
      successCode(res, result, "tìm kiếm thành công");
    }
  } catch (err) {
    errorCode(res, "lấy thông tin thất bại");
  }
};

const updateRoomInfo = async (req, res) => {
  try {
    const { id } = req.params;

    const checkRoomId = await prisma.room.findUnique({
      where: {
        room_id: id * 1,
      },
    });

    if (checkRoomId == null) {
      failCode(res, "", "mã phòng không đúng hoặc không tồn tại");
    } else {
      const {
        creator_id,
        location_id,
        room_name,
        capacity,
        bed_room,
        bed,
        bath_room,
        description,
        price,
        washing_machine,
        iron,
        tv,
        air_conditioner,
        wifi,
        kitchen,
        parking_lot,
        swimming_pool,
        pic_description,
      } = req.body;

      let checkIsAdmin = await prisma.users.findMany({
        where: {
          user_id: creator_id * 1,
          role: "admin",
        },
      });

      if (checkIsAdmin.length === 0) {
        failCode(res, "", "chỉ có admin mới được tạo phòng!!");
      } else {
        let checkLocation = await prisma.location.findMany({
          where: {
            location_id: location_id * 1,
          },
        });

        if (checkLocation.length === 0) {
          failCode(res, "", "vui lòng tạo địa điểm trước khi cập nhật phòng");
        } else {
          const newRoom = {
            creator_id,
            location_id,
            room_name,
            capacity,
            bed_room,
            bed,
            bath_room,
            description,
            price,
            washing_machine,
            iron,
            tv,
            air_conditioner,
            wifi,
            kitchen,
            parking_lot,
            swimming_pool,
            pic_description,
          };

          const inputValidation = object({
            room_name: string()
              .required()
              .max(10, "room name cannot exceed 10 characters")
              .matches(),
            capacity: number().positive("số lượng người phải là số dương"),
            bed_room: number().positive("số lượng phòng ngủ phải là số dương"),
            bed: number().positive("số lượng giường phải là số dương"),
            bath_room: number().positive("số lượng phòng tắm phải là số dương"),
            description: string(),
            price: number().positive("giá thuê phòng phải là số dương"),
            washing_machine: boolean().required(),
            iron: boolean().required(),
            tv: boolean().required(),
            air_conditioner: boolean().required(),
            wifi: boolean().required(),
            kitchen: boolean().required(),
            parking_lot: boolean().required(),
            swimming_pool: boolean().required(),
            pic_description: string(),
          });

          const newValidatedRoom = await inputValidation.validate(
            await newRoom
          );

          const result = await prisma.room.update({
            where: {
              room_id: id * 1,
            },
            data: newValidatedRoom,
          });

          successCode(res, result, "cập nhật thông tin phòng thành công");
        }
      }
    }
  } catch (err) {
    errorCode(res, `cập nhật thất bại: ${err.message}`);
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const checkId = await prisma.room.findUnique({
      where: {
        room_id: id * 1,
      },
    });

    if (checkId == null) {
      failCode(res, "", "mã phòng không hợp lệ hoặc không tồn tại");
    } else {
      const result = await prisma.room.delete({
        where: {
          room_id: id * 1,
        },
      });

      successCode(res, result, "xoá thành công");
    }
  } catch (err) {
    errorCode(res, "xoá thất bại");
  }
};

const uploadRoomPic = async (req, res) => {
  try {
    fs.readFile(req.file.path, async (err, data) => {
      const fileName =
        `data:${req.file.mimetype};base64,` +
        Buffer.from(data).toString("base64");

      fs.unlinkSync(req.file.path);

      const { id } = req.params;

      let checkRoomId = await prisma.room.findUnique({
        where: {
          room_id: id * 1,
        },
      });

      if (checkRoomId === null) {
        failCode(res, "", "mã phòng không đúng hoặc không tồn tại");
      } else {
        let result = await prisma.room.update({
          where: { room_id: id * 1 },
          data: {
            pic_description: fileName,
          },
        });

        successCode(res, result, "upload hình phòng thành công");
      }
    });
  } catch (err) {
    errorCode(res, `upload hình phòng thất bại: ${err.message}`);
  }
};

module.exports = {
  getRoomList,
  createRoom,
  getRoomByLocation,
  getRoomPagination,
  getRoomById,
  updateRoomInfo,
  deleteRoom,
  uploadRoomPic,
};
