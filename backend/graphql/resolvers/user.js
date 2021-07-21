import { AuthenticationError, UserInputError } from "apollo-server-express";
import bcrypt from "bcryptjs";

import User from "../../db/models/user";
import Post from "../../db/models/post";
import Message from "../../db/models/message";
import { isAuth } from "../../middleware/auth";
import { generateToken } from "../../utils/utils";
import { validateLoginInput, validateNewUser } from "../../utils/validators";

export const userQueries = {
  getUserDetails: async (_, { id }, context) => {
    const user = isAuth(context);
    try {
      // const userDetails = await User.findOne({ _id: id });
      // return {
      //   ...userDetails._doc,
      //   id: userDetails._id,
      // };
      return context.loaders.user.one(id);
    } catch (error) {
      console.log("GET USER ERROR");
      throw new Error("Something went wrong");
    }
  },
  users: async (_, { name }, context) => {
    const user = isAuth(context);
    try {
      const users = await User.find({
        name: new RegExp(name, "i"),
      });
      return context.loaders.user.many(users.map(({ id }) => id));
    } catch (error) {
      throw new Error("Something went wrong");
    }
  },
  login: async (_, { email, password }) => {
    const { errors, valid } = validateLoginInput(email, password);
    if (!valid) throw new UserInputError("Input is incorrect", { errors });
    //find user in database using email
    const user = await User.findOne({ email }, { username: 1, password: 1, posts: 1, friends: 1 });
    if (!user) {
      errors.general = "User not found";
      throw new UserInputError("Wrong credentials", { errors });
    }
    //comparing password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      errors.general = "Wrong Credentails";
      throw new UserInputError("Wrong credentials", { errors });
    }
    //generate token
    const token = generateToken({ _id: user._id, username: user.username, email });
    return {
      ...user._doc,
      email,
      password: null,
      id: user._id,
      token,
    };
  },
};

export const userMutations = {
  createUser: async (_, { user }) => {
    //validate arguments
    const { errors, valid } = validateNewUser(user);
    if (!valid) throw new UserInputError("Input is incorrect", { errors });
    const { username, name, email, password } = user;
    //validate unique username and email
    try {
      const existingUser = await User.find({ $or: [{ username: username }, { email: email }] });
      if (existingUser.length !== 0) {
        errors.general = "Username/email is already taken";
        throw new AuthenticationError("Username or email is already taken", { errors });
      }
      //encrypt password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new User({ name, username, email, password: hashedPassword });
      const result = await newUser.save();
      //create a token
      const token = generateToken(result._doc);
      return {
        ...result._doc,
        password: null,
        id: result._id,
        token,
      };
    } catch (error) {
      throw new Error(error);
    }
  },
  addFriend: async (_, { friendId }, context) => {
    const user = isAuth(context);
    try {
      //if friend id exists
      const friendExists = await User.findOne({ _id: friendId });
      if (!friendExists) throw new Error("User does not exists");

      //add friend id to user friends list
      await User.findByIdAndUpdate(user.id, { $push: { friends: friendId } });

      //add user id to friend id's friends list
      const friend = await User.findByIdAndUpdate(friendId, { $push: { friends: user.id } });

      return {
        ...friend._doc,
        id: friend._id,
      };
    } catch (error) {
      console.log("ADD FRIEND ERROR", error);
      throw new Error("Soemthing went wrong");
    }
  },
};

export const userFields = {
  User: {
    posts: async (user) => {
      const posts = await Post.find({ _id: { $in: user.posts } });
      return posts;
    },
    friends: async (user) => {
      const friends = await User.find({ _id: { $in: user.friends } });
      return friends;
    },
    latestMessage: async (user, _, context) => {
      const userF = isAuth(context);
      const message = await Message.find({
        from: { $in: [userF.id, user.id] },
        to: { $in: [userF.id, user.id] },
      })
        .sort({ createdAt: -1 })
        .limit(1);
      return message;
    },
  },
};
