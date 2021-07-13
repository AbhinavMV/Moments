import express from "express";
import graphQLServer from "./graphql";
import cors from "cors";

const app = express();
app.use("/graphql", express.json());
app.use("*", cors());
graphQLServer.applyMiddleware({
  app,
});
// app.get("/", (req, res) => {
//   res.send("Welcome");
// });

export default app;
