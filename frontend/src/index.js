import React from "react";
import ReactDOM from "react-dom";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import { createTheme } from "@material-ui/core";

import { lightBlue, red } from "@material-ui/core/colors";

import "./index.css";
import App from "./App";

const theme = createTheme({
  palette: {
    primary: lightBlue,
    secondary: red,
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
