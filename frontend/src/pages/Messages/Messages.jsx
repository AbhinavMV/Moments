import { gql, useLazyQuery } from "@apollo/client";
import { Container, Grid, makeStyles, Typography } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";

import FriendsList from "./Components/FriendsList";
import MessageBox from "./Components/Message/MessageBox";
import { useAuthState } from "../../context/auth";
import { useUserDetailsDispatch, useUserDetailsState } from "../../context/UserDetails";
import { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  friendsScreen: {
    [theme.breakpoints.only("xs")]: {
      display: (props) => (props.active ? "none" : "block"),
    },
  },
  msgScreen: {
    [theme.breakpoints.only("xs")]: {
      display: (props) => !props.active && "none",
      height: "85vh",
    },
  },
}));

const FRIENDS_LIST = gql`
  query getUser($id: ID!) {
    getUserDetails(id: $id) {
      id
      friends {
        id
        name
        username
        latestMessage {
          content
          createdAt
        }
      }
    }
  }
`;
const MESSAGES = gql`
  query Message($friendId: ID!, $page: Int!, $pageSize: Int!) {
    getSomeMessages(friendId: $friendId, params: { page: $page, pageSize: $pageSize }) {
      results {
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
      info {
        count
        next
        pages
      }
    }
  }
`;
const Messages = () => {
  const { userDetails } = useUserDetailsState();
  const classes = useStyles({ active: userDetails.friends.find((friend) => friend.selected) });
  const { user } = useAuthState();
  const dispatch = useUserDetailsDispatch();
  const [info, setInfo] = useState({ page: 1, pageSize: 20 });
  const [getFriendsData] = useLazyQuery(FRIENDS_LIST, {
    fetchPolicy: "network-only",
    variables: { id: user.id },
    onCompleted(data) {
      dispatch({ type: "SET_FRIENDS_MESSAGES", payload: data.getUserDetails });
    },
  });

  const [getFriendMessages] = useLazyQuery(MESSAGES, {
    fetchPolicy: "network-only",
    onError(err) {
      if (err.graphQLErrors[0]?.extensions?.code === "UNAUTHENTICATED") window.location.href = "/";
    },
    onCompleted: (data) => {
      dispatch({ type: "SET_USER_MESSAGE", payload: data.getSomeMessages });
      setInfo(data.getSomeMessages.info);
    },
  });
  useEffect(() => {
    getFriendsData();
  }, [getFriendsData]);

  return (
    <Container maxWidth="lg" style={{ height: "85vh" }}>
      <Grid
        container
        alignItems="stretch"
        spacing={1}
        justifyContent="center"
        style={{ width: "100%" }}
      >
        <Grid
          className={classes.friendsScreen}
          container
          item
          sm={3}
          alignContent="stretch"
          style={{
            backgroundColor: grey[200],
          }}
        >
          <div
            style={{
              backgroundColor: grey[200],
              width: "100%",
            }}
          >
            <Typography variant="h6" component="h4">
              Friends List
            </Typography>
            <FriendsList getFriendMessages={getFriendMessages} />
          </div>
        </Grid>

        <Grid className={classes.msgScreen} container item sm={9}>
          <MessageBox info={info} setInfo={setInfo} getFriendMessages={getFriendMessages} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Messages;
