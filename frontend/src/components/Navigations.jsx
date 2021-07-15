import { AppBar, Avatar, Button, IconButton, Toolbar, Typography } from "@material-ui/core";
import StarOutlinedIcon from "@material-ui/icons/StarOutlined";
import ChatIcon from "@material-ui/icons/Chat";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import { makeStyles } from "@material-ui/core/styles";
import { Link, useHistory } from "react-router-dom";
import { useAuthDispatch, useAuthState } from "../context/auth";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    flexShrink: 0,
    marginBottom: theme.spacing(10),
  },
  menuButton: {
    marginRight: 2,
  },
  title: {
    flexGrow: 1,
  },
  userIcons: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
    color: "inherit",
  },
}));

export default function Navigation() {
  const classes = useStyles();
  const { user } = useAuthState();
  const dispatch = useAuthDispatch();
  const history = useHistory();
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    history.push("/auth");
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <StarOutlinedIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <Link className={classes.link} to="/">
              Moments
            </Link>
          </Typography>
          {!user ? (
            <Button color="inherit" onClick={() => history.push("/")}>
              Login
            </Button>
          ) : (
            <div className={classes.userIcons}>
              <IconButton aria-label="messages">
                <Link className={classes.link} to="/messages">
                  <ChatIcon style={{ color: "white", marginTop: 10 }} />
                </Link>
              </IconButton>
              <IconButton onClick={handleLogout} aria-label="logout">
                <ExitToAppIcon style={{ color: "white" }} />
              </IconButton>
              <IconButton aria-label="profile">
                <Avatar alt={user?.name} src={user?.imageUrl}>
                  "A"
                </Avatar>
              </IconButton>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
