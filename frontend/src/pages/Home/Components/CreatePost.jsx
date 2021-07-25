import { useMutation } from "@apollo/client";
import { Button, makeStyles, TextField, Typography } from "@material-ui/core";
import gql from "graphql-tag";
import { useState } from "react";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { usePostsDispatch } from "../../../context/posts";
const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    border: 1,
  },
  imageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  image: {
    height: 200,
    width: 200,
    [theme.breakpoints.up("lg")]: {
      height: 300,
      width: 300,
    },
  },
  submitButton: {
    marginTop: 10,
    width: "fit-content",
    alignSelf: "center",
  },
}));

const CREATE_POST = gql`
  mutation SingleFileUpload($caption: String!, $file: Upload) {
    createPost(post: { caption: $caption, imageUrl: $file }) {
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
    }
  }
`;

const CreatePost = () => {
  const classes = useStyles();
  const postsDispatch = usePostsDispatch();
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [createPost] = useMutation(CREATE_POST, {
    onError: (err) => console.log(err),
    onCompleted: (data) => postsDispatch({ type: "ADD_POST", payload: data.createPost }),
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ variables: { caption, file } });
    setCaption("");
    setFile(null);
  };
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
  };
  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <Typography variant="h4" component="h4">
        New Post
      </Typography>
      <div className={classes.imageContainer}>
        {file && <img className={classes.image} src={file && URL.createObjectURL(file)} alt="" />}
        <label htmlFor="fileUpload">
          <Typography>
            <AddAPhotoIcon style={{ marginRight: 5 }} />
            Add an Image
          </Typography>
        </label>
        <input
          id="fileUpload"
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>
      <TextField
        variant="outlined"
        fullWidth
        multiline
        label="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <Button className={classes.submitButton} type="submit" variant="contained" color="primary">
        Post
      </Button>
    </form>
  );
};

export default CreatePost;
