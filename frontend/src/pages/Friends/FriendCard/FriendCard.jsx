import { Card, CardMedia, Grid, IconButton, Typography } from "@material-ui/core";
import useStyles from "./styles";
import AddIcon from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import { useUserDetailsDispatch, useUserDetailsState } from "../../../context/UserDetails";
import { gql, useMutation } from "@apollo/client";

const ADD_FRIEND = gql`
  mutation addFriend($friendId: ID!) {
    addFriend(friendId: $friendId) {
      id
      name
      username
    }
  }
`;

const FriendCard = ({ user }) => {
  const classes = useStyles();
  const { userDetails } = useUserDetailsState();
  const dispatch = useUserDetailsDispatch();
  const [addFriend] = useMutation(ADD_FRIEND, {
    onCompleted: (data) => dispatch({ type: "ADD_FRIEND", payload: data.addFriend }),
    onError: (err) => console.log(err),
  });
  const handleClick = (id) => {
    addFriend({ variables: { friendId: id } });
  };

  return (
    <Grid item className={classes.root}>
      <Card className={classes.container}>
        <CardMedia
          className={classes.img}
          image="https://source.unsplash.com/random"
          title="User"
        />
        <Typography>{user.name}</Typography>
        {!userDetails.friends.find((friend) => friend.id === user.id) && (
          <IconButton className={classes.button} onClick={() => handleClick(user.id)}>
            <AddIcon />
          </IconButton>
        )}
      </Card>
    </Grid>
  );
};

export default FriendCard;
