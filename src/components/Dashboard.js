import React, { useState, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Topbar from "./Topbar";
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

const NumberFormatter = (number) => {

    console.log("Number " + number)

    number = number * 1000000000;

    var s1 = [
        { value: 0, symbol: "" },
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
    for (var i = s1.length - 1; i > 0; i--) {
        console.log("i : " + i + " value : " + s1[i].value + " symbol " + s1[i].symbol)
        if (number >= s1[i].value) {
            return (Math.round((number / s1[i].value) * 100) / 100).toFixed(2);;
        }
    }

}

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

    const [loading, setLoading] = useState({
        loading: false,
        loadingtext: "",
        error: "",
    });

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
                                value: NumberFormatter(minersHashrateComputed),// minersHashrateComputed / 1000000000,
                                name: date
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
                .then(function () { });
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        loadWalletData();
        // eslint-disable-next-line
    }, []);

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
                                onClick={loadWalletData}
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
            <Grid item md={6}>
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
    //Wrapper for Charts in a Card
    // const CardChart = (data, CardSubtitle, CardLateststat) => {
    //     return <Grid item xs={12} sm={12} md={6}>
    //         <Grid
    //             container
    //             direction="column"
    //             justify="center"
    //             alignItems="center"
    //             spacing={1}
    //         >
    //             <Card className={classes.root} style={{ width: "100%" }}>
    //                 <CardContent>
    //                     <div style={{ width: "100%", height: 400 }}>
    //                         <ResponsiveContainer >
    //                             <AreaChart data={data}
    //                                 margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
    //                                 <defs>
    //                                     <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
    //                                         <stop offset="5%" stopColor="#167ef5" stopOpacity={0.8} />
    //                                         <stop offset="95%" stopColor="#167ef5" stopOpacity={0} />
    //                                     </linearGradient>
    //                                 </defs>
    //                                 <XAxis dataKey="name" />
    //                                 <YAxis />
    //                                 <Tooltip
    //                                     contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    //                                     labelStyle={{ fontWeight: 'bold', color: '#666666' }} />
    //                                 <Area type="monotone" dataKey="value" stroke="#b5ceeb" fill="url(#colorPv)" />
    //                             </AreaChart>
    //                         </ResponsiveContainer>
    //                     </div>
    //                     <Typography variant="h5" component="h5">
    //                         {CardLateststat}
    //                     </Typography>
    //                     <Typography variant="h6" component="h6">
    //                         {CardSubtitle}
    //                     </Typography>

    //                 </CardContent>
    //             </Card>
    //         </Grid></Grid>
    // }

    // const CardChart = (data, CardSubtitle, CardLateststat) => {
    //     return <Grid item xs={12} sm={12} md={6}>
    //         <Grid
    //             container
    //             direction="column"
    //             justify="center"
    //             alignItems="center"
    //             spacing={1}
    //         >
    //             <Card className={classes.root} style={{ width: "100%" }}>
    //                 <CardContent>
    //                     <div style={{ width: "100%", height: 400 }}>
    //                         <ResponsiveContainer >
    //                             <AreaChart data={data}
    //                                 margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
    //                                 <defs>
    //                                     <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
    //                                         <stop offset="5%" stopColor="#167ef5" stopOpacity={0.8} />
    //                                         <stop offset="95%" stopColor="#167ef5" stopOpacity={0} />
    //                                     </linearGradient>
    //                                 </defs>
    //                                 <XAxis dataKey="name" />
    //                                 <YAxis />
    //                                 <Tooltip
    //                                     contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    //                                     labelStyle={{ fontWeight: 'bold', color: '#666666' }} />
    //                                 <Area type="monotone" dataKey="value" stroke="#b5ceeb" fill="url(#colorPv)" />
    //                             </AreaChart>
    //                         </ResponsiveContainer>
    //                     </div>
    //                     <Typography variant="h5" component="h5">
    //                         {CardLateststat}
    //                     </Typography>
    //                     <Typography variant="h6" component="h6">
    //                         {CardSubtitle}
    //                     </Typography>

    //                 </CardContent>
    //             </Card>
    //         </Grid></Grid>
    // }

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
            <Topbar currentPath={"/dashboard"} />
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
                            {/* {CardChart(minersHashrates, "Miners Hashrate", hashformat(minerHashrateTotal, 2, "H/s"))} */}
                            <CardChart
                                data={minersHashrates}
                                CardSubtitle="Miners Hashrate"
                                CardLateststat={hashformat(minerHashrateTotal, 2, "H/s")}
                                hasSymbol
                            />
                            {WorkersTable()}
                        </Grid>
                    )}
            </div>
        </React.Fragment>
    );
};

export default withSnackbar(Dashboard);
