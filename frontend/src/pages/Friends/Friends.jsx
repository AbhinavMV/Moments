import { gql, useLazyQuery } from "@apollo/client";
import {
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { useState } from "react";
import FriendCard from "./FriendCard/FriendCard";
import useStyles from "./styles";

const ALL_USERS = gql`
  query AllUsers($search: String) {
    users(name: $search) {
      id
      name
    }
  }
`;

const Friends = () => {
  const classes = useStyles();
  const [getAllFriends, { loading, data: usersList }] = useLazyQuery(ALL_USERS, {
    onError(err) {
      if (err.graphQLErrors[0]?.extensions?.code === "UNAUTHENTICATED") window.location.href = "/";
    },
  });
  const [search, setSearch] = useState("");

  return (
    <Grid
      className={classes.root}
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Grid item className={classes.searchContainer}>
        <FormControl variant="outlined">
          <InputLabel htmlFor="friends-search-bar">Search</InputLabel>
          <OutlinedInput
            id="friends-search-bar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            labelWidth={60}
          />
        </FormControl>
        <Button
          color="primary"
          variant="outlined"
          style={{ marginLeft: 10 }}
          onClick={() => getAllFriends({ variables: { search } })}
        >
          Search
        </Button>
      </Grid>
      {usersList ? (
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
      ) : (
        <h1>Seach for a user</h1>
      )}
    </Grid>
  );
};

export default Friends;
