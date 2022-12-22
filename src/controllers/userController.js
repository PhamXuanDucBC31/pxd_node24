const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static("."));
const fs = require("fs");

const { object, string } = require("yup");
const { successCode, failCode, errorCode } = require("../ultis/response");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getUser = async (req, res) => {
  try {
    const userList = await prisma.users.findMany();
    successCode(res, userList, "lấy danh sách người dùng thành công");
  } catch (err) {
    errorCode(res, `lấy danh sách thất bại: ${err}`);
  }
};

const postNewUser = async (req, res) => {
  const { name, email, pass_word, phone, birth_day, gender, role } = req.body;
  let newUser = {
    name,
    email,
    pass_word,
    phone,
    birth_day,
    gender,
    role,
  };

  let userSchema = object({
    name: string().required().max(20, "Name cannot exceed 10 characters"),
    email: string().required().email(),
    pass_word: string()
      .required()
      .min(4, "password must be at least 4 character long"),
    phone: string(),
    birth_day: string(),
    gender: string().required(),
    role: string().required(),
  });

  try {
    const user = await userSchema.validate(await newUser);

    let result = await prisma.users.create({ data: user });

    successCode(res, result, "register success");
  } catch (err) {
    errorCode(res, err.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    let checkUserId = await prisma.users.findMany({
      where: {
        user_id: id * 1,
      },
    });

    if (checkUserId.length === 0) {
      failCode(res, "", "mã người dùng không tồn tại");
    } else {
      let result = await prisma.users.delete({
        where: {
          user_id: id * 1,
        },
      });

      successCode(res, result, "xoá thành công");
    }
  } catch (err) {
    errorCode(res, err.message);
  }
};

const getUserInfoById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.users.findMany({
      where: {
        user_id: id * 1,
      },
    });

    if (user.length === 0) {
      failCode(res, "", "không tìm thấy người dùng");
    } else {
      successCode(res, user, "lấy thông tin người dùng thành công");
    }
  } catch (err) {
    errorCode(res, "lấy thông tin thất bại");
  }
};

const getUserPagination = async (req, res) => {
  try {
    const { pageIndex, pageSize, keyWord } = req.query;

    const result = await prisma.users.findMany({
      skip: (pageIndex * 1 - 1) * (pageSize * 1),
      take: pageSize * 1,
      where: {
        name: {
          contains: keyWord,
        },
      },
    });

    if (result.length === 0) {
      failCode(res, "", "không có dữ liệu cần tìm");
    } else {
      successCode(res, result, "tìm kiếm thành công");
    }
  } catch (err) {
    errorCode(res, "tìm kiếm thất bại");
  }
};

const udpateUserById = async (req, res) => {
  try {
    const { id } = req.params;

    let checkUserId = await prisma.users.findMany({
      where: {
        user_id: id * 1,
      },
    });

    if (checkUserId.length === 0) {
      failCode(res, "", "mã nhân viên không tồn tại");
    } else {
      const { name, email, pass_word, phone, birth_day, gender, role } =
        req.body;
      let newUser = {
        name,
        email,
        pass_word,
        phone,
        birth_day,
        gender,
        role,
      };

      let userSchema = object({
        name: string().required().max(20, "Name cannot exceed 10 characters"),
        email: string().required().email(),
        pass_word: string()
          .required()
          .min(4, "password must be at least 4 character long"),
        phone: string(),
        birth_day: string(),
        gender: string().required(),
        role: string().required(),
      });

      const user = await userSchema.validate(await newUser);

      let result = await prisma.users.update({
        where: {
          user_id: id * 1,
        },
        data: user,
      });

      successCode(res, result, "cập nhật thành công");
    }
  } catch (err) {
    errorCode(res, err.message);
  }
};

const getUserInfoByName = async (req, res) => {
  try {
    const { name } = req.params;

    let checkUserName = await prisma.users.findMany({
      where: {
        name: {
          contains: name,
        },
      },
    });

    if (checkUserName.length === 0) {
      failCode(res, "", "không tìm thấy");
    } else {
      successCode(res, checkUserName, "tìm kiếm thành công");
    }
  } catch (err) {
    errorCode(res, "tìm kiếm thất bại");
  }
};

const uploadAvatar = async (req, res) => {
  try {
    fs.readFile(req.file.path, async (err, data) => {
      const fileName =
        `data:${req.file.mimetype};base64,` +
        Buffer.from(data).toString("base64");

      fs.unlinkSync(req.file.path);

      const { id } = req.params;

      let checkUserId = await prisma.users.findUnique({
        where: {
          user_id: id * 1,
        },
      });

      if (checkUserId === null) {
        failCode(res, "", "mã người dùng không đúng hoặc không tồn tại");
      } else {
        let result = await prisma.users.update({
          where: {
            user_id: id * 1,
          },
          data: {
            avt: fileName,
          },
        });

        successCode(res, result, "upload thành công");
      }
    });
  } catch (err) {
    errorCode(res, "upload thất bại");
  }
};

module.exports = {
  getUser,
  postNewUser,
  deleteUser,
  getUserInfoById,
  getUserPagination,
  udpateUserById,
  getUserInfoByName,
  uploadAvatar,
};
