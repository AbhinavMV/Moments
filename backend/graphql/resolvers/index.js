import { postQueries, postMutations, postFields } from "./post";
import { userQueries, userMutations, userFields } from "./user";
import { messageQueries, messageMutations, messageSubscription, messageFields } from "./message";
const resolvers = {
  Query: {
    ...postQueries,
    ...userQueries,
    ...messageQueries,
  },
  Mutation: {
    ...postMutations,
    ...userMutations,
    ...messageMutations,
  },
  Subscription: {
    ...messageSubscription,
  },
  ...postFields,
  ...userFields,
  ...messageFields,
};
export default resolvers;
