import multer from "multer";
import crypto from "crypto";
import { extname, resolve } from "path";

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, "..", "..", "tmp", "uploads"),
    filename: (req, file, callback) => {
      // req - request
      // file - dados do arquivo de upload
      // callback - função que irá tratar a requisição
      crypto.randomBytes(16, (err, res) => {
        if (err) return callback(err);
        return callback(null, res.toString("hex") + extname(file.originalname));
      });
    },
  }),
};
