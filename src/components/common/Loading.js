import React from 'react';
import withStyles from '@material-ui/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from "@material-ui/core/Typography";

import { makeStyles } from '@material-ui/core/styles';

const styles = theme => ({
  title: {
    marginRight: 25,
  }
});

const useStyles = makeStyles({
  title: {
    marginRight: 25,
  }
});


function Loading(props) {
  const { loading, loadingtext } = props;
  const classes = useStyles();
  return (
    <div style={loading ? { display: 'flex', justifyContent: 'center', alignItems: 'center' } : { display: 'none' }}>
      <CircularProgress className={classes.title} /><Typography variant="h5" component="h6">{" " + loadingtext}</Typography>
    </div>
  );
}

export default withStyles(styles)(Loading);