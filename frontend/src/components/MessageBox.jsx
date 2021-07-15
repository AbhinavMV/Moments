import { gql, useSubscription } from "@apollo/client";
import { Grid } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { useEffect, useRef } from "react";
import { useUserDetailsDispatch, useUserDetailsState } from "../context/UserDetails";
import Message from "./Message";
import SendMessage from "./SendMessage";
import useStyles from "./StyleMessage";

const MESSAGES_SUBSCRIPTION = gql`
  subscription OnMessageAdded {
    messageCreated {
      from {
        id
        username
      }
      to {
        id
        username
      }
      content
    }
  }
`;
const MessageBox = () => {
  const classes = useStyles();
  const msgList = useRef(null);
  const { userDetails } = useUserDetailsState();
  const { friends } = userDetails;
  const selectedFriend = friends.find((friend) => friend.selected === true);
  const dispatch = useUserDetailsDispatch();
  const { data: messageData, error: messageError } = useSubscription(MESSAGES_SUBSCRIPTION);

  useEffect(() => {
    scrolltoBottom();
  }, [selectedFriend, messageData]);

  const scrolltoBottom = () => {
    if (msgList.current) {
      // console.log(msgList);
      msgList?.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behaviour: "smooth" });
      });
    }
  };

  useEffect(() => {
    if (messageError) console.log(messageError);
    if (messageData) {
      dispatch({ type: "ADD_MESSAGE", payload: messageData.messageCreated });
      console.log();
    }
  }, [messageData, messageError]);

  if (!selectedFriend) return <h1>Select a friend to message</h1>;
  else if (selectedFriend) {
    return (
      <Grid
        container
        item
        className={classes.flexSection}
        xs={12}
        direction="column"
        style={{
          backgroundColor: grey[200],
        }}
      >
        <Grid item xs={12} className={classes.flexColScroll} ref={msgList}>
          {userDetails.currMessages?.length > 0 ? (
            userDetails.currMessages?.map((message, index) => (
              <Message key={index} userId={userDetails.id} message={message} />
            ))
          ) : (
            <h1>Send a Message</h1>
          )}
        </Grid>
        <Grid item xs={12}>
          <SendMessage friendId={selectedFriend.id} />
        </Grid>
      </Grid>
    );
  }
};

export default MessageBox;
