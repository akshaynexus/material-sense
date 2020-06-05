import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { NavLink } from 'react-router-dom';
import { Link, withRouter } from "react-router-dom";
import { Link as MaterialLink } from "@material-ui/core";
import Drawer from '@material-ui/core/Drawer';

import SvgIcon from "@material-ui/core/SvgIcon";

import Menu from "./Menu";

const drawerWidth = 240;

const styles = {
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },

};

function CustomIcon(data) {
    return (
        <SvgIcon {...data}>
            <path d={data.path} />
        </SvgIcon>
    );
}

const TopbarSidedrawer = (props) => {


    const { classes } = props;
    const style_unset = { all: "unset" };

    const sideList = (
        <div className={classes.list}>
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

                {/* <NavLink className={"unactivePage"} activeClassName="activePage" exact to="/" style={style_unset}>
                        <ListItem button key={'Home'}>
                            <ListItemIcon><HomeIcon /></ListItemIcon>
                            <ListItemText primary={'Home'} />
                        </ListItem>
                    </NavLink> */}


            </List>

        </div >
    );

    return (
        <div>

            <SwipeableDrawer
                open={props.isDrawerOpen}
                onClose={props.toggleDrawer}
                onOpen={props.toggleDrawer}
                className={classes.drawerPaper}
                variant="persistent"
                anchor="left">


                <div
                    tabIndex={0}
                    role="button"
                >
                    {sideList}
                </div>
                {/* </Drawer> */}
            </SwipeableDrawer>
        </div >
    );
}

export default withStyles(styles)(TopbarSidedrawer);