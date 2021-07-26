import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { CircularProgress, Container, Grid, makeStyles, Typography } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import CreatePost from "./Components/CreatePost";
import Post from "./Components/Post";
import { useAuthState } from "../../context/auth";
import { useUserDetailsDispatch } from "../../context/UserDetails";
import { usePostsDispatch, usePostsState } from "../../context/posts";
import { useEffect, useState } from "react";

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
  query allPosts($page: Int!, $pageSize: Int!) {
    posts(params: { page: $page, pageSize: $pageSize }) {
      info {
        pages
        count
        prev
        next
      }
      results {
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
  const [info, setInfo] = useState({ page: 1, pageSize: 10 });
  const { user } = useAuthState();
  const { posts } = usePostsState();
  const dispatch = useUserDetailsDispatch();
  const postsDispatch = usePostsDispatch();
  const { loading } = useQuery(USER_DETAILS, {
    variables: { id: user.id },
    nextFetchPolicy: "network-only",
    onError(err) {
      if (err.graphQLErrors[0]?.extensions?.code === "UNAUTHENTICATED") window.location.href = "/";
    },
    onCompleted(data) {
      dispatch({ type: "SET_USER_DETAILS", payload: data.getUserDetails });
    },
  });
  const [loadPosts, { loading: postLoading }] = useLazyQuery(POSTS, {
    fetchPolicy: "network-only",
    onError(err) {
      if (err.graphQLErrors[0]?.extensions?.code === "UNAUTHENTICATED") window.location.href = "/";
    },
    onCompleted: (data) => {
      postsDispatch({ type: "SET_POSTS", payload: data.posts.results });
      setInfo({ ...info, ...data.posts.info });
    },
  });
  useEffect(() => {
    loadPosts({ variables: { page: info.page, pageSize: info.pageSize } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleChange = (e, value) => {
    loadPosts({ variables: { page: value, pageSize: info.pageSize } });
    setInfo({ ...info, page: value });
  };
  if (loading) return <h1>Loading....</h1>;

  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="center" spacing={4} alignItems="flex-start">
        <Grid container item sm={9} direction="column">
          <Grid container item spacing={2} justifyContent="flex-start" alignItems="stretch">
            {!postLoading ? (
              posts?.length > 0 ? (
                posts?.map((post) => <Post key={post.id} post={post} />)
              ) : (
                <div style={{ marginTop: 50 }}>
                  <Typography variant="h4">No posts yet</Typography>
                </div>
              )
            ) : (
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  marginTop: 50,
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </div>
            )}
          </Grid>
          {info && info.pages > 1 && (
            <Grid container item justifyContent="center" alignItems="center">
              <Pagination count={info.pages || 1} page={info.page || 1} onChange={handleChange} />
            </Grid>
          )}
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
