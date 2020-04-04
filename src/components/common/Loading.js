import React from 'react';
import withStyles from '@material-ui/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
const styles = theme => ({
});

function Loading(props) {
  const { loading } = props;
  return (
    <div style={loading ? {display: 'flex', justifyContent: 'center', alignItems:'center'} : { display: 'none' }}>
      <CircularProgress />
    </div>
  );
}

export default withStyles(styles)(Loading);