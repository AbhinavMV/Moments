import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  root: {
    width: 300,
  },
  container: {
    display: "flex",
    alignItems: "center",
    borderRadius: 20,
  },
  img: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: 10,
  },
  button: {
    marginLeft: "auto",
  },
}));
