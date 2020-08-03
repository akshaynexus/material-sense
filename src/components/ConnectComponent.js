import React, { useState, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";

import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import config from "../config.js";
import { withSnackbar } from "notistack";
import Loading from "./common/Loading";

const useStyles = makeStyles({
  root: {
    borderWidth: "1px",
    borderColor: "green !important",
    "@media (min-width: 600px)": {
      marginTop: "5px",
    },
    "@media (min-width: 320px)": {
      marginTop: "5px",
    },
  },
  valueItems: {
    width: 275,
    marginTop: 35,
    marginBottom: 35,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: "1px",
    borderColor: "yellow !important",
  },
  tableHeader: {
    width: 275,
    marginBottom: 1,
    borderWidth: "0px",
    marginTop: "6px",
  },
  title: {
    fontSize: 16,
  },
  pos: {
    marginBottom: 12,
  },
  table: {
    border: "0px",
    marginTop: "15px",
    textAlign: "left",
  },
});

const ConnectComponent = (props) => {
  const poolid = localStorage.getItem("poolid");

  const [loading, setLoading] = useState({
    loading: true,
    loadingtext: "Loading Table Data",
    error: "NoError",
  });

  const [poolData, setPoolData] = useState({
    type: "",
    name: "",
    family: "",
    algorithm: "",
    address: "",
    payoutScheme: "",
    minimumPayment: 0.0,
    poolFee: 0.0,
  });

  useEffect(() => {
    const getPoolData = async () => {
      await axios
        .get(config.poolapiurl + `pools/${poolid}`)
        .then(function (response) {
          // handle success
          let data = response.data;
          setPoolData({
            type: data.pool.coin.type,
            name: data.pool.coin.name,
            family: data.pool.coin.family,
            algorithm: data.pool.coin.algorithm,
            address: data.pool.address,
            payoutScheme: data.pool.paymentProcessing.payoutScheme,
            minimumPayment: data.pool.paymentProcessing.minimumPayment,
            poolFee: data.pool.poolFeePercent,
          });
          props.enqueueSnackbar("Successfully fetched the pool data.", {
            variant: "success",
          });
          setLoading({ loading: false, loadingtext: "" });
        })
        .catch(function (error) {
          // handle error
          props.enqueueSnackbar("Error loading pool data: " + error, {
            variant: "error",
          });
          setLoading({ loading: false, loadingtext: "" });
        })
        .then(function () {});
    };

    getPoolData();
  }, []);

  const PoolConfiguration = () => {
    return (
      <Grid
        item
        direction="column"
        justify="center"
        xs={12}
        md={10}
        alignItems="center"
        container
      >
        <Card className={classes.root} style={{ width: "100%" }}>
          <CardContent>
            <Typography variant="h4" component="h4">
              Pool Configuration
            </Typography>
            <Typography
              variant="h6"
              component="h6"
              style={{ marginTop: "8px", marginLeft: "4px" }}
            >
              All you need to connect your miners
            </Typography>
            <br />
            <div>
              <TableContainer component={Paper}>
                <Table aria-label="table">
                  <TableHead className={classes.tableHeader}>
                    <TableRow>
                      <TableCell align="center">Item</TableCell>
                      <TableCell align="center">Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell align="center">Crypto Coin Name</TableCell>
                      <TableCell align="center">
                        {poolData.name} ({poolData.type})
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center">Coin Family line</TableCell>
                      <TableCell align="center">{poolData.family}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center">Coin Algorithm</TableCell>
                      <TableCell align="center">{poolData.algorithm}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center">Pool Wallet Address</TableCell>
                      <TableCell align="center">{poolData.address}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center">Payout Scheme</TableCell>
                      <TableCell align="center">
                        {poolData.payoutScheme}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center">Minimum Payment</TableCell>
                      <TableCell align="center">
                        {poolData.minimumPayment} {poolData.type}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center">Pool Fee</TableCell>
                      <TableCell align="center">{poolData.poolFee} %</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center">Connect Line</TableCell>
                      <TableCell align="center">
                        -o stratum+tcp://mineit.io:6000 -u WALLET_ADDRESS |
                        Manual Entry
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  const MinerConfiguration = () => {
    return (
      <Grid
        item
        direction="column"
        justify="center"
        xs={12}
        md={10}
        alignItems="center"
        container
      >
        <Card className={classes.root} style={{ width: "100%" }}>
          <CardContent>
            <Typography variant="h5">Miner Configuration</Typography>
            <Typography
              variant="overline"
              display="block"
              gutterBottom
              style={{ marginTop: "8px" }}
            >
              This is the basic guide how to setup your miner to this pool.
            </Typography>
            <br />
            <br />
            <Typography variant="h4" style={{ marginBottom: "5px" }}>
              Getting Started
            </Typography>
            <hr />
            <Typography
              variant="body1"
              gutterBottom
              style={{ marginTop: "20px" }}
            >
              To get started mining and use this pool you need the following
            </Typography>
            <ul>
              <Typography
                variant="body1"
                gutterBottom
                style={{ marginTop: "20px" }}
              >
                <li>{poolData.name} Wallet Address</li>
                <li>
                  Crypto Mining software that supports {poolData.name} and
                  algorithm {poolData.algorithm}
                </li>
                <li>
                  Hardware to run it on. This can be your home PC, Minig Rig,
                  ASIC Miner or Cloud Mining.
                </li>
              </Typography>
            </ul>
            <br />
            <Typography variant="h6" style={{ marginBottom: "5px" }}>
              {poolData.name} Wallet Address
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              style={{ marginTop: "20px" }}
            >
              A wallet address is needed to payout you shares mined at this pool
              server. When the total mined value is past the payout threshold,
              we will send your coin to this wallet address.
            </Typography>
            <Typography variant="h6" style={{ marginBottom: "5px" }}>
              Crypto Mining Software
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              style={{ marginTop: "20px" }}
            >
              To mine at this pool you can use any miner supporting the{" "}
              {poolData.algorithm} aglorithm or {poolData.name} coin. Use an
              search engine and search for "{poolData.name} miner software".
              download the miner software and configure your crypto miner.
            </Typography>
            Where:
            <ul>
              <Typography
                variant="body1"
                gutterBottom
                style={{ marginTop: "20px" }}
              >
                <li>
                  POOL STRATUM ADDRESS AND PORT - one off the stratum addresses
                  above in the Pool Configuration section depending on the
                  difficuty you want
                </li>
                <li>
                  YOUR_WALLET_ADDRESS - your valid {poolData.name} wallet
                  address
                </li>
                <li>
                  WORKERNAME - an optional workername can be used to identify
                  the miner or RIG
                </li>
                <li>PASSWORD - use x or leave it blank</li>
                <br />
                Optional
                <li>
                  STATIC DIFFICULTY - to mine with a static (fixed) difficulty
                  simply use d=xxx as password in your miner configuration where
                  xxx denotes your preferred difficulty.
                </li>
              </Typography>
            </ul>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  const classes = useStyles();
  return (
    <React.Fragment>
      <CssBaseline />
      <div className="container_main">
        {loading.loading ? (
          <Loading
            overlay={true}
            loading={loading.loading}
            loadingtext={loading.loadingtext}
          />
        ) : (
          <>
            <Grid container spacing={2} direction="row">
              {PoolConfiguration()}
            </Grid>
            <Grid container spacing={2} direction="row">
              {MinerConfiguration()}
            </Grid>
          </>
        )}
      </div>
    </React.Fragment>
  );
};

export default withSnackbar(ConnectComponent);
