import { gql, useQuery } from "@apollo/client";
import { Container, Divider, Grid, Typography } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";

import FriendsList from "../../components/FriendsList";
import MessageBox from "../../components/MessageBox";
import { useAuthState } from "../../context/auth";
import { useUserDetailsDispatch } from "../../context/UserDetails";

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
    <Container maxWidth="lg">
      <Grid container alignItems="stretch" justifyContent="center" style={{ width: "100%" }}>
        <Grid
          container
          item
          sm={4}
          alignContent="stretch"
          style={{
            backgroundColor: grey[200],
            flexGrow: 1,
            minHeight: 0,
          }}
        >
          <div
            style={{
              backgroundColor: grey[200],
              flexGrow: 1,
              minHeight: 0,
            }}
          >
            <Typography variant="h6" component="h4">
              Friends List
            </Typography>
            <FriendsList />
          </div>
        </Grid>
        <Divider orientation="vertical" />
        <Grid container item xs={12} sm={7}>
          <MessageBox />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Messages;
