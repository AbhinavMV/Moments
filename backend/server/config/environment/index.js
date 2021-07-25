import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT;

const env = {
  development: process.env.NODE_ENV === "development",
  staging: process.env.NODE_ENV === "staging",
  test: process.env.NODE_ENV === "test",
  production: process.env.NODE_ENV === "production",
};

const mongo = { url: process.env.MONGO_URI };

const jwtSecret = process.env.JWT_SECRET;

const projectId = process.env.GCLOUD_PROJECT_ID;

const keyFilename = process.env.GCLOUD_APPLICATION_CREDENTIALS;

const bucketURL = process.env.GCLOUD_STORAGE_BUCKET_URL;

export { port, env, mongo, jwtSecret, projectId, keyFilename, bucketURL };
