import { makeStyles } from "@material-ui/core";
import { grey, lightBlue } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
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
    borderRadius: 50,
    color: "white",
    minWidth: "80%",
    wordBreak: "break-word",
    width: "fit-content",
    textAlign: "center",
    padding: 10,
  },
}));

export default useStyles;
