import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let destinationFolder = "";

    //el nombre del archivo debe empezar con "profile","product" o "document"
    if (file.originalname.startsWith("profile")) {
      destinationFolder = "./public/profiles";
    } else if (file.originalname.startsWith("product")) {
      destinationFolder = "./public/products";
    } else if (file.originalname.startsWith("document")) {
      destinationFolder = "./public/documents";
    }

    cb(null, destinationFolder);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const uploader = multer({ storage });
