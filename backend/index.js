import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";

import { port } from "./config/environment";
import app from "./app";
import connectDB from "./db";
import schema from "./graphql/schema";
import { isAuth } from "./middleware/auth";

const start = async () => {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Connected to database");
    // app.listen(port);

    const server = createServer(app);
    server.listen(port, () => {
      new SubscriptionServer(
        {
          execute,
          subscribe,
          schema: schema,
          onConnect: (connectionParams, webSocket, context) => {
            if (connectionParams.authorization) {
              const user = isAuth(connectionParams);
              return {
                user,
              };
            }
            throw new Error("User not authenticated");
          },
        },
        {
          server: server,
          path: "/subscriptions",
        }
      );
    });
    console.log("Server running at port:", port);
  } catch (error) {
    // process.exit(1);
    console.log(error);
  }
};

start();
