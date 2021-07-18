import { gql, useMutation } from "@apollo/client";
import { IconButton, TextField } from "@material-ui/core";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import { useState } from "react";
import { useUserDetailsDispatch } from "../../../../context/UserDetails";

const SEND_MESSAGE = gql`
  mutation userToFriend($to: ID!, $message: String!) {
    sendMessage(to: $to, content: $message) {
      from {
        id
        username
      }
      to {
        id
        username
      }
      content
      createdAt
    }
  }
`;

const SendMessage = ({ friendId }) => {
  const [message, setMessage] = useState("");
  const dispatch = useUserDetailsDispatch();
  const [sendMessage, { error }] = useMutation(SEND_MESSAGE, {
    onError: (err) => console.log(err),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage({ variables: { to: friendId, message } });
    setMessage("");
  };

  return (
    <div style={{ marginBottom: 10 }}>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", alignItems: "flex-end", marginLeft: 20, marginRight: 10 }}
      >
        <TextField
          variant="outlined"
          fullWidth
          multiline
          maxRows={4}
          label="Send a Message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <IconButton type="submit">
          <SendRoundedIcon />
        </IconButton>
      </form>
    </div>
  );
};
export default SendMessage;
