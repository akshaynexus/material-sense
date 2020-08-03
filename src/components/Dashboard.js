import React, { useState, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import hashformat from "./common/hashutil.js";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import SettingsEthernetIcon from "@material-ui/icons/SettingsEthernet";
import MenuIcon from "@material-ui/icons/Menu";
import PieChartIcon from "@material-ui/icons/PieChart";
import SendIcon from "@material-ui/icons/Send";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CardChart from "./CardChart";
import "./Stats.css";

import config from "../config.js";
import { withSnackbar } from "notistack";
import Loading from "./common/Loading";

const useStyles = makeStyles({
  root: {
    // maxWidth: 275,
    borderWidth: "1px",
    borderColor: "green !important",
    marginTop: "25px",
    "@media (min-width: 600px)": {
      marginTop: "25px",
    },
    "@media (min-width: 320px)": {
      marginTop: "25px",
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
  title: {
    fontSize: 16,
  },
  pos: {
    marginBottom: 12,
  },
  table: {
    border: "0px",
    marginTop: "15px",
  },
});

const Dashboard = (props) => {
  // Name of the chain, getting the value from the router parameter.

  const [address, setAddress] = React.useState(
    localStorage.getItem("address") || ""
  );

  const [workers, setWorkers] = useState([]);

  const [minersHashrates, setMinersHashrates] = useState([]);
  const [minerHashrateTotal, setMinerHashrateTotal] = useState("");

  const poolid = localStorage.getItem("poolid");

  const [walletData, setWalletData] = useState({
    pendingShares: 0,
    pendingBalance: 0,
    paidBalanceToday: 0,
    lifetimeBalance: 0,
  });

  const [paymentRows, setPaymentRows] = useState([
    {
      date: "",
      amount: 0,
      confirmation: "",
      addressInfoLink: "",
    },
  ]);

  const [loading, setLoading] = useState({
    loading: false,
    loadingtext: "",
    error: "",
  });

  const loadWalletAndPaymentData = () => {
    loadWalletData();
    loadPaymentData();
  };

  const loadWalletData = async () => {
    setWalletData({
      pendingShares: 0,
      pendingBalance: 0,
      paidBalanceToday: 0,
      lifetimeBalance: 0,
    });

    setWorkers([]);
    setMinersHashrates([]);

    let data;
    if (address === "") {
    } else {
      setLoading({ loading: true, loadingtext: "Loading wallet data" });
      await axios
        .get(config.poolapiurl + `pools/${poolid}/miners/${address}`)
        .then(function (response) {
          // handle success
          data = response.data;

          localStorage.setItem("address", address);

          setWalletData({
            pendingShares: data.pendingShares,
            pendingBalance: data.pendingBalance,
            paidBalanceToday: data.todayPaid,
            lifetimeBalance: data.totalPaid,
          });

          // Get miners hashrates from performance samples.

          data.performanceSamples.map((performanceSample) => {
            const performanceSampleWorkersObjectArray = Object.entries(
              performanceSample.workers
            );
            var minersHashrateComputed = 0;
            const date = performanceSample.created.substring(11, 16);

            performanceSampleWorkersObjectArray.forEach(([key, value]) => {
              minersHashrateComputed += value.hashrate;
            });

            setMinersHashrates((minersHashrate) => [
              ...minersHashrate,
              {
                value: minersHashrateComputed / 1000000000,
                name: date,
              },
            ]);
            return true;
          });

          try {
            if (data.performance.workers) {
              const objectArray = Object.entries(data.performance.workers);
              var totalHashrate = 0;

              objectArray.forEach(([key, value]) => {
                totalHashrate += value.hashrate;

                setWorkers((workers) => [
                  ...workers,
                  {
                    key: key,
                    hashrate: value.hashrate,
                    sharesPerSecond: value.sharesPerSecond,
                  },
                ]);
              });

              setMinerHashrateTotal(totalHashrate);
            }
          } catch (e) {
            console.error("error with performance data");
          }

          props.enqueueSnackbar("Successfully fetched the wallet data", {
            variant: "success",
          });
          setLoading({ loading: false, loadingtext: "" });
        })
        .catch(function (error) {
          // handle error
          console.log(error);

          props.enqueueSnackbar("Error loading wallet data : " + error, {
            variant: "error",
          });
          setLoading({ loading: false, loadingtext: "" });
        })
        .then(function () {});
    }
  };

  const loadPaymentData = async () => {
    // https://mineit.io/api/pools/indexchain/miners/iBKhEDqxg1SxNgWu6S3sqxXhJ6Mu8bm5Ze/payments
    //{poolId}/miners/{address}/payments")]
    // config.poolapiurl +
    //         `pools/${poolid}/{addr}/payments`

    let data;
    if (address === "") {
      props.enqueueSnackbar("Enter Address!", {
        variant: "warning",
      });
    } else {
      setPaymentRows([]);
      setLoading({ loading: true, loadingtext: "Loading payment data" });

      // https://mineit.io/api/pools/indexchain/miners/iBKhEDqxg1SxNgWu6S3sqxXhJ6Mu8bm5Ze/payments

      await axios
        .get(config.poolapiurl + `pools/${poolid}/miners/${address}/payments`)
        .then(function (response) {
          // handle success
          data = response.data;
          console.log("payment data: " + data[0] + response);

          // {
          //   "id": 19530,
          //   "coin": "IDX",
          //   "address": "iBKhEDqxg1SxNgWu6S3sqxXhJ6Mu8bm5Ze",
          //   "addressInfoLink": "http://202.182.107.84/address/iBKhEDqxg1SxNgWu6S3sqxXhJ6Mu8bm5Ze",
          //   "amount": 0.204676153410,
          //   "transactionConfirmationData": "b130dc545561933e73283f650258fc162eaae352cc4a76c2c3da8e6369532e55",
          //   "transactionInfoLink": "http://202.182.107.84/tx/b130dc545561933e73283f650258fc162eaae352cc4a76c2c3da8e6369532e55",
          //   "created": "2020-06-07T14:59:34.312946"
          // },

          data.map((d, index) => {
            // console.log(d.id + " : " + index);
            setPaymentRows((paymentRow) => [
              ...paymentRow,
              {
                date: formatDate(d.created),
                amount: d.amount,
                confirmation: d.transactionConfirmationData,
                addressInfoLink: d.transactionInfoLink,
              },
            ]);

            return true;
          });

          setLoading({ loading: false, loadingtext: "" });
        })
        .catch(function (error) {
          // handle error
          console.log(error);

          props.enqueueSnackbar("Error loading payment data : " + error, {
            variant: "error",
          });
          setLoading({ loading: false, loadingtext: "" });
        })
        .then(function () {});
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadWalletData();
    loadPaymentData();
    // eslint-disable-next-line
  }, []);

  const formatDate = (dateString) => {
    var options = {};
    return new Date(dateString).toLocaleDateString([], options);
  };

  const WalletCard = () => {
    return (
      <Grid item xs={12}>
        <Grid
          container
          spacing={3}
          direction="row"
          justify="space-evenly"
          alignItems="left"
        >
          <Card className={classes.valueItems} style={{ width: "100%" }}>
            <CardHeader title={"Wallet address"} />
            <CardContent>
              <TextField
                id="standard-basic"
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ width: "90%" }}
              />
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={loadWalletAndPaymentData}
                style={{ width: "25%", height: "20%" }}
              >
                Load wallet
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };
  //Extra row cards for basic pool data
  const InfoCard = () => {
    return (
      <Grid item xs={12}>
        <Grid
          container
          spacing={3}
          direction="row"
          justify="space-evenly"
          alignItems="center"
        >
          {CardInfo(walletData.pendingShares, "Pending Shares")}
          {CardInfo(walletData.pendingBalance, "Pending Balance")}
          {CardInfo(walletData.paidBalanceToday, "Paid Balance Today")}
          {CardInfo(walletData.lifetimeBalance, "Lifetime Balance")}
        </Grid>
      </Grid>
    );
  };

  const WorkersTable = () => {
    return (
      <Grid item md={7} xs={12}>
        <Grid
          item
          direction="column"
          justify="center"
          alignItems="left"
          spacing={0}
          container
        >
          <Card className={classes.root} style={{ width: "100%" }}>
            <CardContent>
              <Typography variant="h5" component="h5">
                {"Workers : " + workers.length}
              </Typography>
              <Typography variant="h6" component="h6">
                List of miners working for you
              </Typography>
              <br />
              <div style={{ width: "100%", border: "0px" }}>
                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Index</TableCell>
                        <TableCell align="center">Name</TableCell>
                        <TableCell align="center">Hashrate</TableCell>
                        <TableCell align="center">Share Rate</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {workers.map((worker, index) => (
                        <TableRow key={index}>
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell align="center">
                            {worker.key === "" ? "No Name" : worker.key}
                          </TableCell>
                          <TableCell align="center">
                            {hashformat(worker.hashrate, 2, "H/s")}
                          </TableCell>
                          <TableCell align="center">
                            {worker.sharesPerSecond}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const PaymentTable = () => {
    return (
      <Grid item md={5} xs={12}>
        <Grid
          item
          direction="column"
          justify="center"
          alignItems="left"
          spacing={0}
          container
        >
          <Card className={classes.root} style={{ width: "100%" }}>
            <CardContent>
              <Typography variant="h5" component="h5">
                Payments Rewarded
              </Typography>

              <br />
              <div style={{ width: "100%", border: "0px" }}>
                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="table">
                    <TableHead
                      className={classes.tableHeader}
                      align="center"
                      style={{ fontSize: "20px", fontWeight: "bold" }}
                    >
                      <TableRow align="center">
                        <TableCell align="center">Date</TableCell>
                        <TableCell align="center">Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    {paymentRows.map((paymentRows, i) => (
                      <>
                        <TableRow key={i}>
                          <TableCell align="center">
                            {paymentRows.date}
                          </TableCell>
                          <TableCell align="center">
                            {paymentRows.amount}
                          </TableCell>
                        </TableRow>
                      </>
                    ))}
                  </Table>
                </TableContainer>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const GetCardAvatar = (title) => {
    if (title.includes("Pending Shares")) {
      return <SettingsEthernetIcon />;
    } else if (title.includes("Pending Balance")) {
      return <MenuIcon />;
    } else if (title.includes("Paid Balance Today")) {
      return <SendIcon />;
    } else if (title.includes("Lifetime Balance")) {
      return <SettingsEthernetIcon />;
    } else {
      return <PieChartIcon />;
    }
  };

  //Cards giving data on cardHEader
  const CardInfo = (data, Title) => {
    return (
      <Card className={classes.valueItems}>
        <CardHeader
          avatar={
            <Avatar aria-label={Title} className={classes.avatar}>
              {GetCardAvatar(Title)}
            </Avatar>
          }
          title={Title}
          subheader={data}
        />
      </Card>
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
          <Grid container spacing={2} direction="row">
            {WalletCard()}
            {InfoCard()}
            <Grid container item xs={12} md={12}>
              <CardChart
                data={minersHashrates}
                CardSubtitle="Miners Hashrate"
                CardLateststat={hashformat(minerHashrateTotal, 2, "H/s")}
                hasSymbol
                md="12"
              />
            </Grid>
            {WorkersTable()}
            {PaymentTable()}
          </Grid>
        )}
      </div>
    </React.Fragment>
  );
};

export default withSnackbar(Dashboard);
