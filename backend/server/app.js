import express from "express";
import graphQLServer from "./graphql";
import cors from "cors";
import path from "path";
import { graphqlUploadExpress } from "graphql-upload";
const app = express();
app.use("*", cors());
app.use("/images", express.static(path.join(process.cwd(), "images")));
app.use("/graphql", express.json());
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
graphQLServer.applyMiddleware({
  app,
});
app.get("/", (req, res) => {
  res.send("Welcome");
});

export default app;
