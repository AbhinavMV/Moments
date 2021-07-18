import { gql, useQuery } from "@apollo/client";
import { Grid } from "@material-ui/core";
import React from "react";
import FriendCard from "./FriendCard/FriendCard";
import useStyles from "./styles";

const ALL_USERS = gql`
  query AllUsers {
    users {
      id
      name
    }
  }
`;

const Friends = () => {
  const { loading, data: usersList } = useQuery(ALL_USERS, {
    onError: (err) => console.log(err),
  });

  const classes = useStyles();
  return (
    <Grid
      className={classes.root}
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Grid item>Search</Grid>
      <Grid
        className={classes.friendsContainer}
        container
        justifyContent="center"
        alignItems="stretch"
        item
        xs={12}
        spacing={2}
      >
        {!loading && usersList.users.map((user) => <FriendCard key={user.id} user={user} />)}
      </Grid>
    </Grid>
  );
};

export default Friends;
