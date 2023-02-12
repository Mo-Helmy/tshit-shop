import e from 'express';
import multer from 'multer';

const dateNow = new Date().getTime();

const multerDiskStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, `assets/designs/`);
  },
  filename: function (req, file, callback) {
    callback(
      null,
      `${dateNow}` +
        Math.random().toString(36).substring(2) +
        '-' +
        file.originalname.replaceAll(' ', '-')
    );
  },
});

const fileFilter = (
  req: e.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const uploadDesign = multer({ storage: multerDiskStorage, fileFilter });
