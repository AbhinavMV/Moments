import { UserInputError } from "apollo-server-express";
import Post from "../../db/models/post";
import User from "../../db/models/user";
import { isAuth } from "../../middleware/auth";
import { validatePostInput } from "../../utils/validators";
import uploadFile from "../../utils/fileUpload";
import File from "../../db/models/file";
export const postQueries = {
  posts: async () => {
    try {
      const allPosts = await Post.find().sort({ createdAt: -1 });
      return allPosts;
    } catch (error) {
      throw new Error(error);
    }
  },
  post: async (_, { id }) => {
    try {
      const singlePost = await Post.findById(id).populate("imageUrl");
      return singlePost;
    } catch (error) {
      throw new Error(error);
    }
  },
};

export const postMutations = {
  createPost: async (_, { post }, context) => {
    const user = isAuth(context);
    try {
      const userExists = await User.findById(user.id);
      if (!userExists) throw new Error("User does not exists");
      //validate incoming data
      const { errors, valid } = validatePostInput(post.caption);
      if (!valid) throw new UserInputError("Input cannot be empty", { errors });
      let img = null;
      if (post.imageUrl) {
        const upload = await uploadFile(post.imageUrl);
        img = upload.id;
      }
      const newPost = new Post({ ...post, imageUrl: img, creator: user.id });
      const result = await newPost.save();
      await User.findByIdAndUpdate(user.id, { $push: { posts: result.id } });
      return result;
    } catch (error) {
      throw new Error("Something went wrong");
    }
  },
  //implement post update later
};

export const postFields = {
  Post: {
    creator: async (post) => {
      const user = User.findById(post.creator);
      return user;
    },
    imageUrl: async (post) => {
      const file = File.findById(post.imageUrl);
      return file;
    },
  },
};
