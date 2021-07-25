import { UserInputError } from "apollo-server-express";
import fs from "fs";
import Post from "../../db/models/post";
import User from "../../db/models/user";
import File from "../../db/models/file";
import { isAuth } from "../../middleware/auth";
import { validatePostInput } from "../../utils/validators";
import uploadFile, { deleteFile } from "../../utils/imageFirebaseUpload";
export const postQueries = {
  posts: async (_, { params = { page: 1, pageSize: 1 } }, context) => {
    const { pageSize, page } = params;
    // try {
    //   const allPosts = await Post.find().sort({ createdAt: -1 });
    //   return context.loaders.post.many(allPosts.map(({ id }) => id));
    // } catch (error) {
    //   throw new Error(error);
    // }
    return {
      results: async () => {
        const posts = await Post.find()
          .sort({ createdAt: -1 })
          .skip(pageSize * (page - 1))
          .limit(pageSize);
        return context.loaders.post.many(posts.map(({ id }) => id));
      },
      info: async () => {
        const count = await Post.countDocuments();
        const pages = Math.ceil(count / pageSize);
        const prev = page > 1 ? page - 1 : null;
        const next = page < pages ? page + 1 : null;
        return {
          count,
          pages,
          prev,
          next,
        };
      },
    };
  },
  post: async (_, { id }, context) => {
    try {
      // const singlePost = await Post.findById(id);
      // return singlePost;
      return context.loaders.post.one(id);
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
  likePost: async (_, { id }, context) => {
    //user logged in
    const user = isAuth(context);

    //post exist or not
    const post = await Post.findById(id);
    if (!post) throw new Error("Post does not exist");
    //push used id into the post like array
    const userLiked = post._doc.likes.filter((u) => {
      return u.toString() === user.id.toString();
    });
    let updatedPost = null;
    if (!userLiked.length > 0) {
      updatedPost = await Post.findByIdAndUpdate(id, { $push: { likes: user.id } }, { new: true });
    } else {
      updatedPost = await Post.findByIdAndUpdate(id, { $pull: { likes: user.id } }, { new: true });
    }
    return updatedPost;
  },
  deletePost: async (_, { id }, context) => {
    //authentication
    const user = isAuth(context);
    //post exists
    try {
      const postExists = await Post.findById(id);
      if (!postExists) throw new Error("Post does not exists");
      //check if creator is same as authenticated user
      //then delete
      if (postExists.creator.toString() === user.id.toString()) {
        await User.findByIdAndUpdate(user.id, { $pull: { posts: id } });
        const file = await File.findByIdAndDelete(postExists._doc.imageUrl);
        // if (file) fs.unlinkSync(file.path);
        if (file) deleteFile(file.filename);
        const deletedPost = await Post.findByIdAndDelete(id);
        return deletedPost;
      }
    } catch (error) {
      throw new Error("Something went wrong");
    }
  },
  //implement post update later
};

export const postFields = {
  Post: {
    creator: async (post) => {
      const user = await User.findById(post.creator);
      return user;
    },
    imageUrl: async (post) => {
      const file = await File.findById(post.imageUrl);
      return file;
    },
    likes: async (post) => {
      const likesArr = await User.find({ _id: { $in: post.likes } });
      return likesArr;
    },
  },
};
