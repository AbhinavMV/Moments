import { gql, useQuery } from "@apollo/client";
import { Container, Grid, Typography } from "@material-ui/core";
import { useAuthState } from "../../context/auth";
import { useUserDetailsDispatch } from "../../context/UserDetails";

const USER_DETAILS = gql`
  query getUser($id: ID!) {
    getUserDetails(id: $id) {
      id
      name
      username
      friends {
        id
        name
        username
      }
    }
  }
`;

const Home = () => {
  const { user } = useAuthState();
  const dispatch = useUserDetailsDispatch();
  const { data } = useQuery(USER_DETAILS, {
    variables: { id: user.id },
    nextFetchPolicy: "network-only",
    onCompleted(data) {
      dispatch({ type: "SET_USER_DETAILS", payload: data.getUserDetails });
    },
  });
  return <Container maxWidth="lg">Home</Container>;
};

export default Home;
