import { gql, useLazyQuery } from "@apollo/client";
import { Avatar, Card, CardContent, CardMedia, Grid, Typography } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import { useUserDetailsDispatch, useUserDetailsState } from "../../../context/UserDetails";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  flexSection: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },

  flexColScroll: {
    flex: "1 1 auto",
    flexDirection: "column",
    overflowY: "auto",
    height: "80vh",
  },

  flexNoShrink: {
    flexShrink: 0,
  },
}));
const MESSAGES = gql`
  query Message($friendId: ID!) {
    getMessages(friendId: $friendId) {
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
const FriendsList = () => {
  const { userDetails } = useUserDetailsState();
  const classes = useStyles();
  const dispatch = useUserDetailsDispatch();
  const [getFriendMessages, { loading }] = useLazyQuery(MESSAGES, {
    fetchPolicy: "network-only",
    onError(err) {
      if (err.graphQLErrors[0].extensions?.code === "UNAUTHENTICATED") window.location.href = "/";
    },
    onCompleted: (data) => dispatch({ type: "SET_USER_MESSAGE", payload: data.getMessages }),
  });

  const handleClick = (friend) => {
    dispatch({ type: "SELECT_USER", payload: friend.id });
    getFriendMessages({ variables: { friendId: friend.id } });
  };

  return (
    <Grid
      container
      item
      xs={12}
      direction="column"
      className={classes.flexSection}
      // alignContent="stretch"
    >
      <Grid item xs={12} className={classes.flexColScroll}>
        {userDetails.friends &&
          userDetails.friends.map((friend) => (
            <Grid item key={friend.id} xs={12}>
              <Card
                variant="outlined"
                className={classes.root}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  backgroundColor: !friend.selected && grey[100],
                }}
                onClick={() => handleClick(friend)}
              >
                <Avatar style={{ marginLeft: 10 }}>{friend.username.charAt(0)}</Avatar>
                <div className={classes.details}>
                  <CardContent>
                    <Typography component="h5" variant="h5">
                      {friend.username}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      {friend.latestMessage?.length > 0
                        ? friend.latestMessage[0]?.content.slice(0, 25) + "..."
                        : "Start a conversation"}
                    </Typography>
                  </CardContent>
                </div>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Grid>
  );
};

export default FriendsList;
