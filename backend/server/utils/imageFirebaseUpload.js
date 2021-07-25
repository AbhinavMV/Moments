import { Storage } from "@google-cloud/storage";
import shortid from "shortid";
import { v4 as uuidv4 } from "uuid";
import { projectId, credentials, bucketURL } from "../config/environment";
import File from "../db/models/file";

const storage = new Storage({
  projectId,
  credentials,
});

const bucket = storage.bucket(bucketURL);

const storeUpload = async ({ stream, filename, mimetype }) => {
  const id = shortid.generate();
  const blob = bucket.file(`${id}-${filename}`);
  const blobStream = await blob.createWriteStream({
    metadata: {
      contentType: mimetype,
      metadata: {
        firebaseStorageDownloadTokens: uuidv4(),
      },
    },
  });
  return new Promise((resolve, reject) =>
    stream
      .pipe(blobStream)
      .on("finish", () => {
        resolve({
          id,
          path: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURI(
            blob.name
          )}?alt=media`,
          filename: `${id}-${filename}`,
          mimetype,
        });
      })
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
  // mkdir("images", { recursive: true }, (err) => {
  //   if (err) throw err;
  // });
  const upload = await processUpload(file);
  const fileUploaded = await File.create(upload);
  return fileUploaded;
};

export const deleteFile = (filename) => {
  const file = bucket.file(filename);
  file.delete();
};
export default uploadFile;
