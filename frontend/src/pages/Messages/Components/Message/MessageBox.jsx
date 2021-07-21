import { gql, useSubscription } from "@apollo/client";
import { Avatar, Grid, IconButton, Typography } from "@material-ui/core";
import { useEffect, useRef } from "react";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useUserDetailsDispatch, useUserDetailsState } from "../../../../context/UserDetails";
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
      createdAt
    }
  }
`;
const MessageBox = () => {
  const { userDetails } = useUserDetailsState();
  const classes = useStyles(userDetails);
  const msgList = useRef(null);
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
    }
  }, [messageData, messageError]);

  const handleBackClick = () => {
    dispatch({ type: "CLEAR_SELECTION" });
  };

  if (!selectedFriend)
    return (
      <div className={classes.infoContainer}>
        <h1>Select a friend to message</h1>;
      </div>
    );
  else if (selectedFriend) {
    return (
      <>
        <div className={classes.header}>
          <Avatar style={{ margin: 5 }}>{selectedFriend?.name.charAt(0)}</Avatar>
          <Typography variant="h5">{selectedFriend.name}</Typography>
          <IconButton
            color="secondary"
            className={classes.backButton}
            onClick={() => handleBackClick(selectedFriend.id)}
          >
            <ArrowBackIcon />
          </IconButton>
        </div>
        <Grid container item className={classes.flexSection} xs={12}>
          <Grid item xs={12} className={classes.flexColScroll} ref={msgList}>
            {userDetails.currMessages?.length > 0 ? (
              userDetails.currMessages?.map((message, index) => (
                <Message key={index} userId={userDetails.id} message={message} />
              ))
            ) : (
              <h1>Send a Message</h1>
            )}
          </Grid>
          <Grid item>
            <SendMessage friendId={selectedFriend.id} />
          </Grid>
        </Grid>
      </>
    );
  }
};

export default MessageBox;
