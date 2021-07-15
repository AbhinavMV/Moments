import { gql, useLazyQuery } from "@apollo/client";
import { Card, CardContent, Grid, Typography } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import { useUserDetailsDispatch, useUserDetailsState } from "../context/UserDetails";

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
    minHeight: 0,
  },
  flexColScroll: {
    flexGrow: 1,
    overflow: "auto",
    minHeight: "100%",
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
    }
  }
`;
const FriendsList = () => {
  const { userDetails } = useUserDetailsState();
  const classes = useStyles();
  const dispatch = useUserDetailsDispatch();
  const [getFriendMessages, { loading }] = useLazyQuery(MESSAGES, {
    fetchPolicy: "network-only",
    onError: (err) => console.log(err.graphQLErrors[0]),
    onCompleted: (data) => dispatch({ type: "SET_USER_MESSAGE", payload: data.getMessages }),
  });

  const handleClick = (friend) => {
    dispatch({ type: "SELECT_USER", payload: friend.id });
    getFriendMessages({ variables: { friendId: friend.id } });
  };

  return (
    <Grid
      className={classes.flexColScroll}
      container
      item
      xs={12}
      direction="column"
      alignContent="stretch"
    >
      {userDetails.friends.map((friend) => (
        <Grid item key={friend.id} xs={12}>
          <Card
            variant="outlined"
            className={classes.root}
            style={{ backgroundColor: !friend.selected && grey[100] }}
            onClick={() => handleClick(friend)}
          >
            <div className={classes.details}>
              <CardContent>
                <Typography component="h5" variant="h5">
                  {friend.username}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {friend.name}
                </Typography>
              </CardContent>
            </div>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default FriendsList;
