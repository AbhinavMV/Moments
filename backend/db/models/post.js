import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    caption: {
      type: String,
      required: [true, "Caption cannot be empty"],
    },
    imageUrl: {
      type: String,
      default: null,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
export default model("Post", postSchema);
