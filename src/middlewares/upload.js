const multer = require("multer");
const express = require("express");
const app = express();
app.use(express.static("."));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd() + "/public/img");
  },
  filename: (req, file, cb) => {
    const newFileName = Date.now() + "_" + file.originalname;
    cb(null, newFileName);
  },
});

const upload = multer({ storage });

module.exports = upload;
