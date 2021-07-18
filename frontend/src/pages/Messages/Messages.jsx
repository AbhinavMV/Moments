import { gql, useQuery } from "@apollo/client";
import { Container, Grid, makeStyles, Typography } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";

import FriendsList from "./Components/FriendsList";
import MessageBox from "./Components/Message/MessageBox";
import { useAuthState } from "../../context/auth";
import { useUserDetailsDispatch, useUserDetailsState } from "../../context/UserDetails";

const useStyles = makeStyles((theme) => ({
  friendsScreen: {
    [theme.breakpoints.down("xs")]: (props) =>
      props.userDetails?.friends.find((friend) => friend.selected) && { display: "none" },
  },
  msgScreen: {
    [theme.breakpoints.down("xs")]: (props) =>
      !props.userDetails?.friends.find((friend) => friend.selected) && { display: "none" },
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

const Messages = () => {
  const { userDetails } = useUserDetailsState();
  const classes = useStyles(userDetails);
  const { user } = useAuthState();
  const dispatch = useUserDetailsDispatch();
  const { data: FriendData } = useQuery(FRIENDS_LIST, {
    fetchPolicy: "network-only",
    variables: { id: user.id },
    onCompleted(data) {
      dispatch({ type: "SET_FRIENDS_MESSAGES", payload: data.getUserDetails });
    },
  });
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
            <FriendsList />
          </div>
        </Grid>
        {/* <Divider orientation="vertical" /> */}

        <Grid className={classes.msgScreen} container item sm={9}>
          <MessageBox />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Messages;
