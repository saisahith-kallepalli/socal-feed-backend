const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const pathName = path.join(__dirname, "../postFiles");
    cb(null, pathName);
  },
  filename: (req, file, cb) => {
    fileName = Date.now() + "-" + file.originalname;
    cb(null, file.originalname);
  },
});
let upload = multer({ storage: storage });
module.exports = {
  upload,
};
