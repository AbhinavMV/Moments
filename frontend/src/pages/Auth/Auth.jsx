import { useLazyQuery, gql } from "@apollo/client";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Avatar, Button, Container, Grid, IconButton, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core";

import Input from "./Input";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing(2),
  },
  lockIcon: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    margin: theme.spacing(2),
    width: "100%",
  },
}));

const initial = {
  fname: "",
  lname: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const LOGIN = gql`
  query signin($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      token
    }
  }
`;

const Auth = ({ setUser }) => {
  const classes = useStyles();
  const [formData, setFormData] = useState(initial);
  const [isSignUp, setIsSignUp] = useState(true);
  const [signin, { data, error }] = useLazyQuery(LOGIN);
  const history = useHistory();

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    await signin({
      variables: { email: formData.email, password: formData.password },
    });
    if (data) {
      localStorage.setItem("profile", JSON.stringify(data.login));
      setUser(data.login);
      history.push("/");
    }
  };

  return (
    <Container maxWidth="xs">
      <div className={classes.formContainer}>
        <Avatar className={classes.lockIcon}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h4" component="h4">
          {isSignUp ? "Sign Up" : "Sign In"}
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form} autoComplete="off">
          <Grid container spacing={1} justifyContent="center" direction="column">
            {isSignUp && (
              <Grid container item spacing={1}>
                <Input
                  half
                  name="fname"
                  label="First Name"
                  value={formData.fname}
                  onChange={handleChange}
                />
                <Input
                  half
                  name="lname"
                  label="Last Name"
                  value={formData.lname}
                  onChange={handleChange}
                />
              </Grid>
            )}
            {isSignUp && (
              <Input
                name="username"
                label="Username"
                value={formData.username}
                onChange={handleChange}
              />
            )}
            <Input
              name="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              password
              name="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
            />
            {isSignUp && (
              <Input
                password
                name="confirmPassword"
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            )}
            {error && <Alert severity="error">{error.message}</Alert>}
            <Grid item xs={12}>
              <Button
                className={classes.submitButton}
                fullWidth
                size="large"
                variant="contained"
                color="secondary"
                type="submit"
              >
                {!isSignUp ? "Sign In" : "Sign Up"}
              </Button>
            </Grid>
            <Grid container item xs={12}>
              {!isSignUp && <IconButton size="small">Forgot Password?</IconButton>}
              <IconButton
                size="small"
                style={{ marginLeft: "auto" }}
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setFormData(initial);
                }}
              >
                {!isSignUp ? "Create a new Account" : "Already have an account? Sign In"}
              </IconButton>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default Auth;
