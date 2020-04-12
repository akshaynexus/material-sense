import React from 'react';
import withStyles from '@material-ui/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
});

function Loading(props) {
  const { loading ,loadingtext} = props;
  return (
    <div style={loading ? {display: 'flex', justifyContent: 'center', alignItems:'center'} : { display: 'none' }}>
      <CircularProgress />
      <br />
      <Typography variant="h5" component="h6">{" " + loadingtext}</Typography>
    </div>
  );
}

export default withStyles(styles)(Loading);