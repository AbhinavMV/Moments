import { mkdir, createWriteStream } from "fs";
import shortid from "shortid";

import File from "../db/models/file";

const storeUpload = async ({ stream, filename, mimetype }) => {
  const id = shortid.generate();
  const path = `images/${id}-${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on("finish", () => resolve({ id, path, filename, mimetype }))
      .on("error", reject)
  );
};

const processUpload = async (upload) => {
  const { createReadStream, filename, mimetype } = await upload;
  const stream = createReadStream();
  const file = await storeUpload({ stream, filename, mimetype });
  return file;
};

const uploadFile = async (file) => {
  mkdir("images", { recursive: true }, (err) => {
    if (err) throw err;
  });
  const upload = await processUpload(file);
  const fileUploaded = await File.create(upload);
  return fileUploaded;
};
export default uploadFile;
