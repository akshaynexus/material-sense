import React, { useState } from "react";
import withStyles from "@material-ui/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import CardCoin from "./cards/CardCoin";
import Topbar from "./Topbar";
import SectionHeader from "./typo/SectionHeader";
import Loading from "./common/Loading";
import config from "../config.js";
import hashformat from "./common/hashutil.js";

import useSWR from "swr";
import axios from "axios";

const styles = (theme) => ({
  grid: {
    width: 1100,
  },
});

const Cards = (props) => {
  const swrUrl = config.poolapiurl + "pools";
  const { data, error } = useSWR(swrUrl, (url) =>
    axios(url).then((r) => r.data)
  );

  const [loading, setLoading] = useState({
    loading: true,
    loadingtext: "Loading Graph data",
    error: "NoError",
  });

  const pooldata = data?.pools;

  const buildCoinCards = () => {
    return pooldata.map((coin, index) => (
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
  };

  const { classes } = props;
  const currentPath = props.location.pathname;
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
                style={{ padding: "10px" }}
              />
              {!data ? (
                <Loading
                  overlay={true}
                  loading={loading.loading}
                  loadingtext={"Loading coin data"}
                />
              ) : (
                buildCoinCards()
              )}
            </Grid>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
};

export default withStyles(styles)(Cards);
