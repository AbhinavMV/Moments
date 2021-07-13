import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/environment/index";

export const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email, username: user.username }, jwtSecret, {
    expiresIn: "1h",
  });
};
