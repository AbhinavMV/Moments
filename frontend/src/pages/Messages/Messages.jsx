import { gql } from "@apollo/client";

const MESSAGES_SUBSCRIPTION = gql`
  subscription OnMessageAdded {
    messageCreated {
      from {
        username
      }
      to {
        username
      }
      content
    }
  }
`;

const Messages = () => {
  return <div>Messages Screen</div>;
};

export default Messages;
