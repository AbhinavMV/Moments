import jwt from "jsonwebtoken";
import { AuthenticationError } from "apollo-server-errors";
import { jwtSecret } from "../config/environment";

export const isAuth = (context) => {
  const authHeader = context.req?.headers.authorization || context.authorization || "";
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, jwtSecret);
        return user;
      } catch (error) {
        throw new AuthenticationError("Invalid or expired token");
      }
    }
    throw new AuthenticationError("Invalid token");
  }
  throw new Error("User not authenticated");
};
