import React, { Component } from "react";
import withStyles from "@material-ui/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import CardItem from "./cards/CardItem";
import Topbar from "./Topbar";
import CircularProgress from '@material-ui/core/CircularProgress';
import SectionHeader from "./typo/SectionHeader";
// const backgroundShape = require("../images/shape.svg");

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey["A500"],
    overflow: "hidden",
    // background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
    marginTop: 20,
    padding: 20,
    paddingBottom: 200
  },
  grid: {
    width: 1000
  }
});

class Cards extends Component {
  state = {
    loading:true,
    pooldata:null
  }
  async componentDidMount(){
    const APIPath = "http://mineit.io:4000/api/";
    const response = await fetch(APIPath + "pools");
    const data = await response.json();
    this.setState({pooldata: data.pools,loading:false});
  }
   hashformat(value, decimal, unit) {
    if (decimal === 0) {
        return value + unit;
    } else {
        var si = [
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "k" },
            { value: 1e6, symbol: "M" },
            { value: 1e9, symbol: "G" },
            { value: 1e12, symbol: "T" },
            { value: 1e15, symbol: "P" },
            { value: 1e18, symbol: "E" },
            { value: 1e21, symbol: "Z" },
            { value: 1e24, symbol: "Y" },
        ];
        for (var i = si.length - 1; i > 0; i--) {
            if (value >= si[i].value) {
                break;
            }
        }
        return (value / si[i].value).toFixed(decimal).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + ' ' + si[i].symbol + unit;
    }
}
  buildCoinCards() {
   return this.state.pooldata.map(coin => (<div key={1}>
     <CardItem
    coin={coin.coin.name}
    algo={coin.coin.algorithm}
    minercount={coin.poolStats.connectedMiners}
    poolhashrate={this.hashformat(coin.poolStats.poolHashrate,5, 'H/s')}
    nethashrate={this.hashformat(coin.networkStats.networkHashrate,5, 'H/s')}
    blockheight={coin.networkStats.blockHeight}
    totalpaid={coin.totalPaid + " " + coin.coin.type}
    poolid={coin.id}
    />
  <br></br> </div>))
  }
  render() {
    const { classes } = this.props;
    const currentPath = this.props.location.pathname;

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath} />
        <div className={classes.root}>
          <Grid container justify="center">
            <Grid
              spacing={10}
              alignItems="center"
              justify="center"
              container
              className={classes.grid}
            >
              <Grid item xs={12}>
                <SectionHeader
                  title="Coins"
                  subtitle="Available coins to mine"
                />
                {(this.state.loading|| !this.state.pooldata) ?
                <CircularProgress />:this.buildCoinCards()}
              </Grid>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Cards);
