import { UserInputError } from "apollo-server-errors";
import { PubSub, withFilter } from "graphql-subscriptions";

import Message from "../../db/models/message";
import User from "../../db/models/user";
import { isAuth } from "../../middleware/auth";

const pubsub = new PubSub();

export const messageQueries = {
  getMessages: async (_, { friendId }, context) => {
    const user = isAuth(context);
    try {
      //$or: [{ from: user.id }, { to: user.id }]
      const messages = await Message.find({
        from: { $in: [user.id, friendId] },
        to: { $in: [user.id, friendId] },
      });
      return messages;
    } catch (error) {
      throw new Error("Could not retrieve your messages something went wrong");
    }
  },
  getSomeMessages: async (_, { friendId, params = { page: 1, pageSize: 20 } }, context) => {
    const { page, pageSize } = params;
    const user = isAuth(context);
    return {
      results: async () => {
        const messages = await Message.find({
          from: { $in: [user.id, friendId] },
          to: { $in: [user.id, friendId] },
        })
          .sort({ createdAt: -1 })
          .skip(pageSize * (page - 1))
          .limit(pageSize);
        // console.log(messages);
        return context.loaders.message.many(messages.map(({ id }) => id));
      },
      info: async () => {
        const count = await Message.countDocuments({
          from: { $in: [user.id, friendId] },
          to: { $in: [user.id, friendId] },
        });
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
};

export const messageMutations = {
  sendMessage: async (_, { to, content }, context) => {
    const errors = {};
    //non empty content
    if (content.trim() === "") {
      errors.general = "Message cannot be empty";
      throw new UserInputError("Message must not be empty", { errors });
    }
    //authenticated user check
    const user = isAuth(context);
    //check both users exist
    const currUser = await User.findOne({ _id: user.id }, { posts: 0 });
    const friendExists = currUser.friends.find((user) => {
      return user._id.toString() === to;
    });
    if (!friendExists) throw new Error("User does not exists");

    //add the message in message document
    const message = await Message.create({
      from: user.id,
      to: friendExists._id,
      content,
    });
    pubsub.publish("NEW_MESSAGE", { messageCreated: { ...message._doc } });
    return {
      ...message._doc,
    };
  },
};

export const messageFields = {
  Message: {
    from: async (message) => {
      const user = await User.findById(message.from);
      return user;
    },

    to: async (message) => {
      const user = await User.findById(message.to);
      return user;
    },
  },
};

export const messageSubscription = {
  messageCreated: {
    subscribe: withFilter(
      (_, __, context) => {
        return pubsub.asyncIterator(["NEW_MESSAGE"]);
      },
      ({ messageCreated }, variables, { user }) => {
        if (messageCreated.from.toString() === user.id || messageCreated.to.toString() === user.id)
          return true;
        return false;
      }
    ),
  },
};
