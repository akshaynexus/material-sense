
import React from 'react';
import clsx from 'clsx';
import AppBarMUI from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
// import { withStyles } from '@material-ui/core/styles';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';


import Brightness6Icon from '@material-ui/icons/Brightness6';


import { Link } from "react-router-dom";


import TopbarSidedrawer from "./TopbarSidedrawer";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({

  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  link: {
    textDecoration: "none",
    color: "inherit",
  },
  title: {

    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  tagline: {
    marginLeft: 10,
    [theme.breakpoints.up("md")]: {
      paddingTop: "0.2em",
    },
  },
}));

const logo = require("../images/logo.svg");

const Topbar = ({ isDrawerOpen, toggleDrawer }) => {

  // const { classes } = this.props;

  const classes = useStyles();
  const theme = useTheme();

  return (

    <>
      <AppBarMUI
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: isDrawerOpen,
        })}
        color="default">
        <Toolbar >
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" color="inherit" className={classes.grow}>
            <Link to="/" className={classes.link}>
              <img width={20} src={logo} alt="" />
              <span className={classes.tagline}>Mineit Pool</span>
            </Link>
          </Typography>


          <IconButton aria-label="delete">
            <Brightness6Icon />
          </IconButton>


        </Toolbar>
      </AppBarMUI>
      <TopbarSidedrawer
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
      />
    </>
  );
}

export default Topbar;