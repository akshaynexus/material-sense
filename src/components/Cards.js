import React, { Component } from "react";
import withStyles from "@material-ui/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import CardCoin from "./cards/CardCoin";
import Topbar from "./Topbar";
import SectionHeader from "./typo/SectionHeader";
import Loading from "./common/Loading";
import config from "../config.js";
import hashformat from './common/hashutil.js'

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
  buildCoinCards() {
    return this.state.pooldata.map((coin, index) => (
      <div key={index}>
        <CardCoin
          coin={coin.coin.name}
          ticker={coin.coin.type}
          algo={coin.coin.algorithm}
          minercount={coin.poolStats.connectedMiners}
          poolhashrate={hashformat(coin.poolStats.poolHashrate, 2, "H/s")}
          diff={hashformat(coin.networkStats.networkDifficulty, 2, "")}
          fee={coin.poolFeePercent + "%"}
          poolid={coin.id}
        />
        <br />
      </div>
    ));
  }
  render() {
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
                  <Loading overlay={true} loading={this.state.loading} loadingtext={"Loading coin data"} />
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
