import React from "react";
import ReactDOM from "react-dom";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import { createTheme } from "@material-ui/core";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { lightBlue, red } from "@material-ui/core/colors";

import "./index.css";
import App from "./App";
import { backendLink } from "./config";

const theme = createTheme({
  palette: {
    primary: lightBlue,
    secondary: red,
  },
});

const client = new ApolloClient({
  uri: backendLink,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
