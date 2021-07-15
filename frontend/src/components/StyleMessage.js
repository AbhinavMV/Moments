import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  flexSection: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },

  flexColScroll: {
    flex: "1 1 auto",
    flexDirection: "column",
    overflowY: "auto",
    height: "74vh",
  },

  flexNoShrink: {
    flexShrink: 0,
  },
}));

export default useStyles;
