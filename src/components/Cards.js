import React, { useState, useEffect } from "react";
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

  const swrUrl = config.poolapiurl + "pools/";
  const { data, error } = useSWR(swrUrl, (url) =>
    axios(url).then((r) => r.data)
  );

  const [loading, setLoading] = useState({
    loading: true,
    loadingtext: "Loading Graph data",
    error: "NoError",
  });

  const [algorithms, setAlgorithms] = useState([]);

  // const [algorithmsLS, setAlgorithmsLS] = React.useState(
  //   localStorage.getItem("algorithms") || []
  // );

  let arrayOfCurrentAlgorithms = []

  const [selectedIndex, setSelectedIndex] = useState();

  const pooldata = data?.pools;
  let filteredPoolData = data?.pools;

  const handleChange = (e) => {
    console.log(e.target.value)
    setSelectedIndex(e.target.value)
  }

  useEffect(() => {
    const objectArray = Object.entries(config.algos);

    objectArray.forEach(([key, value]) => {
      // console.log(key)
      console.log(value)
      setAlgorithms(algorithms => [...algorithms, value + ","]);
    });

    setSelectedIndex(0)

  }, [])

  const buildCoinCards = () => {
    console.log("build coins called");
    console.log("length : " + filteredPoolData.length);
    console.log("Selected Index : " + selectedIndex);
    console.log("Algo Length : " + algorithms.length);

    try {

      if (selectedIndex === 0) {
        return filteredPoolData.map((coin, index) => (
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
      } else {
        return filteredPoolData.filter(coin => algorithms[selectedIndex - 1].indexOf(coin.coin.algorithm.toLowerCase()) !== -1).map((coin, index) => (
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

      return filteredPoolData.filter(coin => algorithms[selectedIndex].indexOf(coin.coin.algorithm.toLowerCase()) !== -1).map((coin, index) => (
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
    } catch (e) {

      const objectArray = Object.entries(config.algos);
      const temp = [];
      objectArray.forEach(([key, value]) => {
        temp.push(value + ",")
      });

      setAlgorithms(temp);
      setSelectedIndex(0)

    } finally {



    }




  };



  // useEffect(() => {


  //   // console.log("current index : " + selectedIndex);
  //   // const currentAlgorithms = algorithms[selectedIndex];
  //   // // console.log(String(arrayOfCurrentAlgorithms).split(","));
  //   // arrayOfCurrentAlgorithms = String(currentAlgorithms).split(",")
  //   // console.log(arrayOfCurrentAlgorithms);

  //   localStorage.setItem("algorithms", algorithms[selectedIndex]);

  // }, [selectedIndex])

  const { classes } = props;
  const currentPath = props.location.pathname;

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
                val={!selectedIndex ? 0 : selectedIndex}
                getAlgoIndex={handleChange}
                style={{ padding: "10px" }}
              />
              {!data && algorithms ? (
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
