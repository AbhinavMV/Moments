import { makeStyles } from "@material-ui/core";
import { grey, lightBlue } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  header: {
    width: "100%",
    height: 60,
    backgroundColor: grey[300],
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  backButton: {
    marginLeft: "auto",
    marginRight: 10,
  },
  flexSection: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    width: "100%",
    backgroundColor: grey[200],
  },

  flexColScroll: {
    flex: "1 1 auto",
    flexDirection: "column",
    overflowY: "auto",
    height: "65vh",
    flexShrink: 1,
    padding: 15,
  },

  flexNoShrink: {
    flexShrink: 0,
  },

  infoContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  //message
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    flexShrink: 1,
  },
  messageConatiner: {
    marginLeft: (props) => props.userId === props.message?.from.id && "auto",
    display: "flex",
    flexDirection: "column",

    margin: 5,
  },
  message: {
    backgroundColor: (props) =>
      props.userId === props.message?.from.id ? lightBlue[700] : lightBlue[300],
    marginLeft: (props) => props.userId === props.message?.from.id && "auto",
    borderRadius: 20,
    color: "white",
    minWidth: "20%",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    width: "fit-content",
    textAlign: "left",
    padding: 10,
  },
}));

export default useStyles;
