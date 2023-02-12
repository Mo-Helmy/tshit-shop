import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import { type } from 'os';

const dateNow = new Date().getTime();

interface ModifiedFile extends Express.Multer.File {
  title: String;
}

const multerDiskStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    console.log(req.body);
    console.log(req.file);
    console.log(req.files);
    console.log(file);
    const fileWithTitle = file as ModifiedFile;
    console.log(fileWithTitle);
    (async () => {
      try {
        await fs.mkdir(
          path.join(
            __dirname,
            `../../assets/designs/${
              (file as ModifiedFile).title + '-' + dateNow
            }`
          )
        );
      } catch (error) {
      } finally {
        callback(
          null,
          `assets/designs/${(file as ModifiedFile).title + '-' + dateNow}`
        );
      }
    })();
  },
  filename: function (req, file, callback) {
    if (file.fieldname === 'lightDesign')
      callback(
        null,
        // req.body.title.trim().replaceAll(' ', '-') +
        (file as ModifiedFile) + '-' + 'light' + '-' + dateNow + '.png'
      );
    if (file.fieldname === 'darkDesign')
      callback(
        null,
        // req.body.title.trim().replaceAll(' ', '-') +
        (file as ModifiedFile) + '-' + 'dark' + '-' + dateNow + '.png'
      );
  },
});

export const uploadDesign = multer({ storage: multerDiskStorage });
