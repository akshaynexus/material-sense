import React, { Component } from "react";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import "./App.css";
import Routes from "./routes";
import { blue } from "@material-ui/core/colors";
import { SnackbarProvider } from "notistack";

// import SideDrawer from './SideDrawer';


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

const theme_two = createMuiTheme({
  palette: {
    secondary: {
      main: blue[600],
    },
    primary: {
      main: blue[800],
    },
    type: "light",
  },
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: ['"Lato"', "sans-serif"].join(","),
  },
});

class App extends Component {

  render() {

    // localStorage.setItem('isDarkTheme', JSON.stringify(true));
    const isDarkTheme = JSON.parse(localStorage.getItem('isDarkTheme', "true"));

    // let isDarkTheme = false;

    return (
      <div>
        <ThemeProvider theme={isDarkTheme ? theme : theme_two}>
          <SnackbarProvider maxSnack={5}>
            {/* <SideDrawer /> */}
            <Routes />
          </SnackbarProvider>
        </ThemeProvider>
      </div >
    );
  }
}

export default App;
