const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static("."));
const fs = require("fs");

const { object, string } = require("yup");
const { errorCode, successCode, failCode } = require("../ultis/response");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getLocationList = async (req, res) => {
  try {
    const result = await prisma.location.findMany();
    successCode(res, result, "lấy danh sách thành công");
  } catch (err) {
    errorCode(res, "lấy danh sách thất bại");
  }
};

const addLocation = async (req, res) => {
  try {
    const { location_name, province, country, descrption_img } = req.body;

    const checkLocationName = await prisma.location.findMany({
      where: {
        location_name,
      },
    });

    if (checkLocationName.length != 0) {
      failCode(res, "", "địa chỉ không đuọc trùng");
    } else {
      const newLocation = {
        location_name,
        province,
        country,
        descrption_img,
      };

      const validateInput = object({
        location_name: string().required(),
        province: string().required(),
        country: string().required(),
        descrption_img: string(),
      });

      let newValidatedLocation = await validateInput.validate(
        await newLocation
      );

      const result = await prisma.location.create({
        data: newValidatedLocation,
      });
      successCode(res, result, "thêm mới thành công");
    }
  } catch (err) {
    errorCode(res, `thêm địa điểm thất bại: ${err.message}`);
  }
};

const getLocationPagination = async (req, res) => {
  try {
    const { pageIndex, pageSize, keyWord } = req.query;

    const result = await prisma.location.findMany({
      skip: (pageIndex * 1 - 1) * (pageSize * 1),
      take: pageSize * 1,
      where: {
        location_name: {
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
    errorCode(res, `tìm kiếm thất bại : ${err.message}`);
  }
};

const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await prisma.location.findUnique({
      where: {
        location_id: id * 1,
      },
    });

    if (result != null) {
      successCode(res, result, "tìm kiếm thành công");
    } else {
      failCode(res, "", "mã địa điểm không hợp lệ hoặc không tồn tại");
    }
  } catch (err) {
    errorCode(res, `tìm kiếm thất bại: ${err.message}`);
  }
};

const updateLocationById = async (req, res) => {
  try {
    const { id } = req.params;

    const checkId = await prisma.location.findUnique({
      where: {
        location_id: id * 1,
      },
    });

    if (checkId == null) {
      failCode(res, "", "mã địa chỉ không đúng hoặc không tồn tại");
    } else {
      const { location_name, province, country, descrption_img } = req.body;

      const newLocation = {
        location_name,
        province,
        country,
        descrption_img,
      };

      const validateInput = object({
        location_name: string().required(),
        province: string().required(),
        country: string().required(),
        descrption_img: string(),
      });

      let newValidatedLocation = await validateInput.validate(
        await newLocation
      );

      const result = await prisma.location.update({
        where: {
          location_id: id * 1,
        },
        data: newValidatedLocation,
      });
      successCode(res, result, "cập nhật thành công");
    }
  } catch (err) {
    errorCode(res, `cập nhật thất bại : ${err.message}`);
  }
};

const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const checkId = await prisma.location.findUnique({
      where: {
        location_id: id * 1,
      },
    });

    if (checkId == null) {
      failCode(res, "", "mã địa điểm không đúng hoặc không tồn tại");
    } else {
      const result = await prisma.location.delete({
        where: {
          location_id: id * 1,
        },
      });

      successCode(res, result, "xoá thành công");
    }
  } catch (err) {
    errorCode(res, "xoá thất bại");
  }
};

const uploadLocationPic = async (req, res) => {
  try {
    fs.readFile(req.file.path, async (err, data) => {
      const fileName =
        `data:${req.file.mimetype};base64,` +
        Buffer.from(data).toString("base64");

      fs.unlinkSync(req.file.path);

      const { id } = req.params;

      let checkLocationId = await prisma.location.findUnique({
        where: {
          location_id: id * 1,
        },
      });

      if (checkLocationId === null) {
        failCode(res, "", "mã vị trí không đúng hoặc không tồn tại");
      } else {
        let result = await prisma.location.update({
          where: {
            location_id: id * 1,
          },
          data: {
            descrption_img: fileName,
          },
        });

        successCode(res, result, "upload hình vị trí thành công");
      }
    });
  } catch (err) {
    errorCode(res, `upload hình vị trí thất bại: ${err.message}`);
  }
};

module.exports = {
  getLocationList,
  addLocation,
  getLocationPagination,
  getLocationById,
  updateLocationById,
  deleteLocation,
  uploadLocationPic,
};
