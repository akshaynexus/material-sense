import React from 'react';
import clsx from 'clsx';
import { Route, HashRouter, Switch } from "react-router-dom";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Dashboard from "./components/Dashboard";
import Wizard from "./components/Wizard";
import Cards from "./components/Cards";
import Signup from "./components/Signup";
import Stats from "./components/Stats";
import Blocks from "./components/Blocks";
import Miners from "./components/Miners";
import Payments from "./components/Payments";

import { Link, withRouter } from "react-router-dom";
import { Link as MaterialLink } from "@material-ui/core";

import SvgIcon from "@material-ui/core/SvgIcon";

import Menu from "./components/Menu";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
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
  title: {
    flexGrow: 1,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

function CustomIcon(data) {
  return (
    <SvgIcon {...data}>
      <path d={data.path} />
    </SvgIcon>
  );
}

export default function PersistentDrawerRight() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <HashRouter>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open,
            })}
            color="default"
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerOpen}
                className={clsx(open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>

              <Typography variant="h6" noWrap className={classes.title} style={{ marginLeft: '20px', marginRight: '20px' }}>
                Mineit Pool
          </Typography>

            </Toolbar>
          </AppBar>
          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
              paper: classes.drawerPaper,
            }}
          >



            <div className={classes.drawerHeader}>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </div>
            <Divider />
            <List>

              {Menu.map((item, index) => (
                <ListItem
                  component={item.external ? MaterialLink : Link}
                  href={item.external ? item.pathname : null}
                  // style={{ backgroundColor: '#999' }}
                  to={
                    item.external
                      ? null
                      : {
                        pathname: item.pathname
                      }
                  }
                  button
                  key={item.label}
                >
                  {/* <ListItemIcon><HomeIcon /></ListItemIcon> */}
                  <ListItemIcon><CustomIcon path={item.icon} /></ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}

            </List>

          </Drawer>
          <main
            className={clsx(classes.content, {
              [classes.contentShift]: open,
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
      </HashRouter>
    </>
  );
}
