import Dataloader from "dataloader";
import User from "../db/models/user";
import Post from "../db/models/post";
import Message from "../db/models/message";
import File from "../db/models/file";

const createLoader = (Model) => {
  const loader = new Dataloader(async (keys) => {
    const data = await Model.find({ _id: { $in: keys } });

    const dataMap = data.reduce((acc, curr) => {
      acc[curr._id] = curr;
      return acc;
    }, {});
    return keys.map((id) => dataMap[id]);
  });

  return {
    one: async (id) => loader.load(id.toString()),
    many: async (ids) => loader.loadMany(ids.map((id) => id.toString())),
  };
};

const context = ({ req }) => {
  const loaders = {
    user: createLoader(User),
    post: createLoader(Post),
    message: createLoader(Message),
    file: createLoader(File),
  };
  return {
    loaders,
    req,
  };
};

export default context;
