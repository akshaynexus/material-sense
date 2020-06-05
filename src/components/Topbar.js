


import React, { Component } from 'react';
import AppBarMUI from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';


import Brightness6Icon from '@material-ui/icons/Brightness6';


import { Link } from "react-router-dom";


import TopbarSidedrawer from "./TopbarSidedrawer";

const styles = theme => ({
  root: {
    width: '100%',
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
      paddingTop: "0.em",
    },
  },


});

const logo = require("../images/logo.svg");

class AppBar extends Component {

  state = {
    isDrawerOpen: false,
  };

  toggleDrawer = (open) => () => {
    this.setState({
      isDrawerOpen: open,
    });
  };

  render() {

    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBarMUI position="static" color="default">
          <Toolbar >
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleDrawer(true)}>
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
          isDrawerOpen={this.state.isDrawerOpen}
          toggleDrawer={this.toggleDrawer}
        />
      </div>
    );
  }
}

export default withStyles(styles)(AppBar);