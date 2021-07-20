import { gql, useMutation } from "@apollo/client";
import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { ImagesLink } from "../../../config";
import { usePostsDispatch } from "../../../context/posts";
import { useAuthState } from "../../../context/auth";

const LIKE_POST = gql`
  mutation likePost($id: ID!) {
    likePost(id: $id) {
      likes {
        id
      }
    }
  }
`;

const DELETE_POST = gql`
  mutation deletePost($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`;

const Post = ({ post }) => {
  const { user } = useAuthState();
  const postDispatch = usePostsDispatch();
  const [likePost] = useMutation(LIKE_POST, {
    onError: (err) => console.log(err),
    onCompleted: (data) => postDispatch({ type: "LIKE_POST", id: post.id, payload: data.likePost }),
  });
  const [deletePost] = useMutation(DELETE_POST, {
    onError: (err) => console.log(err),
    onCompleted: (data) => postDispatch({ type: "DELETE_POST", payload: data.deletePost }),
  });

  return (
    <Grid container item xs={12} sm={6} lg={4} justifyContent="center">
      <Card
        elevation={1}
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          width: "100%",
          maxWidth: 300,
          height: 310,
          borderRadius: 20,
        }}
      >
        <CardMedia
          component="img"
          alt="POST1"
          height="200"
          image={
            post.imageUrl
              ? `${ImagesLink}${post.imageUrl?.path}`
              : "https://source.unsplash.com/random/300x300"
          }
          title="Post"
          style={{ backgroundBlendMode: "darken" }}
        />
        <div style={{ position: "absolute", top: "10px", left: "10px", color: "white" }}>
          <Avatar>{post.creator.name.charAt(0)}</Avatar>
        </div>
        <div>
          <Button style={{ color: "white", position: "absolute", top: "10px", right: "-10px" }}>
            <MoreVertIcon />
          </Button>
        </div>

        <CardActionArea>
          <CardContent
            style={{
              height: 30,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <Typography variant="body1" color="textSecondary" component="p">
              {post.caption}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions style={{ justifyContent: "space-between" }}>
          <IconButton size="small" onClick={() => likePost({ variables: { id: post.id } })}>
            {post.likes?.filter((like) => like.id === user.id).length > 0 ? (
              <FavoriteIcon color="secondary" />
            ) : (
              <FavoriteBorderOutlinedIcon />
            )}

            <Typography vairant="caption">{post.likes ? post.likes.length : 0}</Typography>
          </IconButton>
          {post.creator.id === user.id && (
            <IconButton size="small" onClick={() => deletePost({ variables: { id: post.id } })}>
              <DeleteIcon />
            </IconButton>
          )}
        </CardActions>
      </Card>
    </Grid>
  );
};

export default Post;
