const express = require("express");
const app = express();
app.use(express.json());

const { object, string } = require("yup");
const { successCode, failCode, errorCode } = require("../ultis/response");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const login = async (req, res) => {
  const { name, pass_word } = req.body;
  const checkUser = await prisma.users.findMany({
    where: {
      name,
    },
  });

  try {
    if (checkUser.length != 0) {
      if (pass_word != checkUser[0].pass_word) {
        failCode(res, "", "mật khẩu không đúng");
      } else {
        successCode(res, checkUser, "đăng nhập thành công");
      }
    } else {
      failCode(res, "", "tài khoản không đúng");
    }
  } catch (err) {
    errorCode(res, "đăng nhập thất bại");
  }
};

const signUp = async (req, res) => {
  const { name, email, pass_word, phone, birth_day, gender } = req.body;
  let newUser = {
    name,
    email,
    pass_word,
    phone,
    birth_day,
    gender,
    role: "user",
  };

  let userSchema = object({
    name: string().required().max(20, "Name cannot exceed 20 characters"),
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

module.exports = {
  login,
  signUp,
};
