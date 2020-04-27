import React, { Component } from "react";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import "./App.css";
import Routes from "./routes";
import { blue } from "@material-ui/core/colors";
import { SnackbarProvider } from "notistack";

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: blue[600],
    },
    primary: {
      main: blue[800],
    },
    type: "dark",
  },
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: ['"Lato"', "sans-serif"].join(","),
  },
});

class App extends Component {
  render() {
    return (
      <div>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={3}>
            <Routes />
          </SnackbarProvider>
        </ThemeProvider>
      </div>
    );
  }
}

export default App;
