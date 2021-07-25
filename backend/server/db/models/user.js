import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name cannot be empty"],
    },
    username: {
      type: String,
      required: [true, "Username cannot be empty"],
      unique: [true, "User already exists"],
    },
    email: {
      type: String,
      required: [true, "Email cannot be empty"],
      unique: [true, "Account already exists"],
    },
    password: {
      type: String,
      required: [true, "Password cannot be empty"],
      select: false,
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);
export default model("User", userSchema);
