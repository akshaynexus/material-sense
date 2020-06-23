import React from "react";
import withStyles from "@material-ui/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import { withRouter } from "react-router-dom";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";

const styles = (theme) => ({
  sectionContainer: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  title: {
    fontWeight: "bold",
  },
});

const SectionHeader = ({ classes, title, subtitle, val, getAlgoIndex }) => {


  return (
    <Grid container spacing={1} justify="center">
      <Grid item xs={9}>
        <div className={classes.sectionContainer}>
          <Typography variant="subtitle1" className={classes.title}>
            {title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {subtitle}
          </Typography>
        </div>
      </Grid>
      <Grid item xs={3} >
        <div align="right">
          <FormControl align="left" className={classes.sectionContainer}>
            <InputLabel id="demo-simple-select-label">Algo Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={val}
              onChange={getAlgoIndex}
            >
              <MenuItem value={0}>All</MenuItem>
              <MenuItem value={1}>ASIC/FGPA</MenuItem>
              <MenuItem value={2}>GPU</MenuItem>
              <MenuItem value={3}>CPU</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Grid>
    </Grid>
  );

}

export default withRouter(withStyles(styles)(SectionHeader));
