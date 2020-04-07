import React, { Component } from "react";
import withStyles from "@material-ui/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import CardCoin from "./cards/CardCoin";
import Topbar from "./Topbar";
import SectionHeader from "./typo/SectionHeader";
import Loading from "./common/Loading";
import config from "../config.js";
const styles = theme => ({
  grid: {
    width: 1100
  }
});

class Cards extends Component {
  state = {
    loading: true,
    pooldata: null
  };
  async componentDidMount() {
    const APIPath = config.poolapiurl;
    const response = await fetch(APIPath + "pools");
    const data = await response.json();
    this.setState({ pooldata: data.pools, loading: false });
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
        { value: 1e24, symbol: "Y" }
      ];
      for (var i = si.length - 1; i > 0; i--) {
        if (value >= si[i].value) {
          break;
        }
      }
      return (
        (value / si[i].value)
          .toFixed(decimal)
          .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") +
        " " +
        si[i].symbol +
        unit
      );
    }
  }
  buildCoinCards() {
    return this.state.pooldata.map((coin, index) => (
      <div key={index}>
        <CardCoin
          coin={coin.coin.name}
          ticker={coin.coin.type}
          algo={coin.coin.algorithm}
          minercount={coin.poolStats.connectedMiners}
          poolhashrate={this.hashformat(coin.poolStats.poolHashrate, 2, "H/s")}
          diff={this.hashformat(coin.networkStats.networkDifficulty, 2, "")}
          fee={coin.poolFeePercent + "%"}
          poolid={coin.id}
        />
        <br />{" "}
      </div>
    ));
  }
  render() {
    // const handleChange = (event) => {
    //   return selectedindex = event.target.value;
    // };
    const { classes } = this.props;
    const currentPath = this.props.location.pathname;
    var selectedindex = 1;
    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath} />
        <div>
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
                  val={selectedindex}
                />
                {this.state.loading || !this.state.pooldata ? (
                  <Loading overlay={true} loading={this.state.loading} />
                ) : (
                    this.buildCoinCards()
                  )}
              </Grid>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Cards);
