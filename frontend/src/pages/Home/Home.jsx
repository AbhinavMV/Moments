import { gql, useQuery } from "@apollo/client";
import { Container, Grid, Typography, makeStyles } from "@material-ui/core";
import CreatePost from "./Components/CreatePost";
import Post from "./Components/Post";
import { useAuthState } from "../../context/auth";
import { useUserDetailsDispatch } from "../../context/UserDetails";
import { usePostsDispatch, usePostsState } from "../../context/posts";

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

const POSTS = gql`
  query allPosts {
    posts {
      id
      caption
      imageUrl {
        path
      }
      createdAt
      creator {
        id
        name
      }
      likes {
        id
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  createPost: {
    [theme.breakpoints.only("xs")]: {
      order: -1,
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  const { user } = useAuthState();
  const { posts } = usePostsState();
  const dispatch = useUserDetailsDispatch();
  const postsDispatch = usePostsDispatch();
  const { loading } = useQuery(USER_DETAILS, {
    variables: { id: user.id },
    nextFetchPolicy: "network-only",
    onError: (err) => console.log(err.graphQLErrors[0]),
    onCompleted(data) {
      dispatch({ type: "SET_USER_DETAILS", payload: data.getUserDetails });
    },
  });
  const { loading: postLoading } = useQuery(POSTS, {
    onCompleted: (data) => postsDispatch({ type: "SET_POSTS", payload: data.posts }),
  });
  if (loading) return <h1>Loading....</h1>;
  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="center" spacing={2} alignItems="flex-start">
        <Grid container item sm={9} spacing={2} justifyContent="flex-start" alignItems="stretch">
          {!postLoading && posts?.map((post) => <Post key={post.id} post={post} />)}
        </Grid>
        <Grid
          className={classes.createPost}
          container
          item
          sm={3}
          justifyContent="center"
          alignItems="flex-start"
        >
          <CreatePost />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
