import React, { useState } from "react";
import { Route, HashRouter, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Wizard from "./components/Wizard";
import Cards from "./components/Cards";
import Signup from "./components/Signup";
import Stats from "./components/Stats";
import Blocks from "./components/Blocks";
import Miners from "./components/Miners";
import Payments from "./components/Payments";
import CssBaseline from "@material-ui/core/CssBaseline";
import ScrollToTop from "./components/ScrollTop";
import Topbar from "./components/Topbar";
import clsx from "clsx";

import { makeStyles, useTheme } from "@material-ui/core/styles";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
}));

export default (props) => {
  const classes = useStyles();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <HashRouter>
        <ScrollToTop>
          <div className={classes.root}>
            <CssBaseline />
            <Topbar isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
            <main
              className={clsx(classes.content, {
                [classes.contentShift]: isDrawerOpen,
              })}
            >
              <div className={classes.drawerHeader} />
              <Switch>
                <Route exact path="/" component={Cards} />
                <Route exact path="/stats" component={Stats} />
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/blocks" component={Blocks} />
                <Route exact path="/miners" component={Miners} />
                <Route exact path="/payments" component={Payments} />
                <Route exact path="/signup" component={Signup} />
                <Route exact path="/wizard" component={Wizard} />
                <Route exact path="/cards" component={Cards} />
              </Switch>
            </main>
          </div>
        </ScrollToTop>
      </HashRouter>
    </>
  );
};
