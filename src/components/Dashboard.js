import React, { useState, useEffect } from 'react'
import CssBaseline from "@material-ui/core/CssBaseline";
import Topbar from "./Topbar";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import hashformat from './common/hashutil.js'
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import MenuIcon from '@material-ui/icons/Menu';
import PieChartIcon from '@material-ui/icons/PieChart';
import SendIcon from '@material-ui/icons/Send';
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import "./Stats.css";

import {
    XAxis, YAxis, Tooltip, AreaChart, Area, ResponsiveContainer
} from 'recharts';
import config from "../config.js";
import { withSnackbar } from 'notistack';
import Loading from "./common/Loading";

const useStyles = makeStyles({
    root: {
        // maxWidth: 275,
        borderWidth: "1px",
        borderColor: "green !important",
        '@media (min-width: 600px)': {
            marginTop: "5px",
        },
        '@media (min-width: 320px)': {
            marginTop: "5px",
        }
    },
    valueItems: {
        width: 275,
        marginTop: 35,
        marginBottom: 35,
        marginLeft: 10,
        marginRight: 10,
        borderWidth: "1px",
        borderColor: "yellow !important"
    },
    title: {
        fontSize: 16,
    },
    pos: {
        marginBottom: 12,
    }
});
const Stats = (props) => {

    // Name of the chain, getting the value from the router parameter.

    const [address, setAddress] = React.useState(
        localStorage.getItem('address') || ''
    );


    const poolid = localStorage.getItem("poolid");
    const [poolHashrates, setPoolHashrates] = useState([]);


    const [poolData, setPoolData] = useState({
        poolHashRate: 0,
        miners: 0,
        networkHashrate: 0,
        networkDifficulty: 0,
        poolFee: 0,
        paymentThreshold: "",
        paymentScheme: "",
        blockchainHeight: 0,
        connectedPeers: 0
    });

    const [walletData, setWalletData] = useState({
        pendingShares: 0,
        pendingBalance: 0,
        paidBalanceToday: 0,
        lifetimeBalance: 0
    });

    const [loading, setLoading] = useState({
        loading: true,
        loadingtext: "Loading Graph data",
        error: 'NoError'
    });



    useEffect(() => {

        // TODO : Make api call for dashboard, pass address. 
        // API : https://mineit.io/api/pools/indexchain/miners/i8X3tekuobxm8fW6TtAssUCKRBBEFJ2TeZ
        // https://mineit.io/api/pools/indexchain/miners/{Address} 

        // Make api call if api if address is not empty, the first time the app loads. 
        console.log("Address is : " + address);

        if (address !== '') {
            loadWalletData();
        }

    }, [])


    const loadWalletData = async () => {

        let data;
        if (address === '') {
            props.enqueueSnackbar('Please enter address', {
                variant: 'error',
            })
        } else {

            // await axios.get("https://mineit.io/api/pools/indexchain/miners/i8X3tekuobxm8fW6TtAssUCKRBBEFJ2TeZ")
            console.log(poolid)
            console.log(config.poolapiurl + `pools/${poolid}/miners/${address}`)
            await axios.get(config.poolapiurl + `pools/${poolid}/miners/${address}`)
                .then(function (response) {
                    // handle success
                    console.log(response.data);
                    data = response.data;

                    localStorage.setItem("address", address);

                    setWalletData({
                        pendingShares: data.pendingShares,
                        pendingBalance: data.pendingBalance,
                        paidBalanceToday: data.todayPaid,
                        lifetimeBalance: data.totalPaid
                    })

                    props.enqueueSnackbar('Successfully fetched the wallet data', {
                        variant: 'success',
                    })
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);

                    props.enqueueSnackbar('Error loading wallet data, please try again.', {
                        variant: 'error',
                    })
                    setLoading({ loading: false, loadingtext: "" });
                })
                .then(function () {
                    // always executed
                    // console.log(ex);
                    // setLoading({ loading: false, loadingtext: "" });
                });

        }
    }

    useEffect(() => {
        const getGraphData = async () => {
            let data;


            setPoolHashrates([]);
            setLoading({ loading: true, loadingtext: "Loading Pool data" });
            await axios.get(config.poolapiurl + `pools/${poolid}/performance`)
                .then(function (response) {
                    // handle success
                    console.log(response.data);
                    data = response.data;

                    data.stats.map((stats) => {
                        setPoolHashrates(poolHashrates => [...poolHashrates, { value: (stats.poolHashrate / 1000000000), name: stats.created.substring(11, 16) }]);
                        return true;
                    });
                    props.enqueueSnackbar('Successfully fetched the graph data.', {
                        variant: 'success',
                    })
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);

                    props.enqueueSnackbar('Error loading graph data, please try again later.', {
                        variant: 'error',
                    })
                    setLoading({ loading: false, loadingtext: "" });
                })
                .then(function () {
                    // always executed
                    // console.log(ex);
                    // setLoading({ loading: false, loadingtext: "" });
                });


        };

        const getPoolData = async () => {

            await axios.get(config.poolapiurl + `pools/${poolid}`)
                .then(function (response) {
                    // handle success
                    console.log(response);
                    console.log(response.data);
                    let data = response.data;
                    setPoolData({
                        poolHashRate: data.pool.poolStats.poolHashrate,
                        miners: data.pool.poolStats.connectedMiners,
                        networkHashrate: data.pool.networkStats.networkHashrate,
                        networkDifficulty: data.pool.networkStats.networkDifficulty,
                        poolFee: data.pool.poolFeePercent,
                        paymentThreshold: data.pool.paymentProcessing.minimumPayment + " " + data.pool.coin.type,
                        paymentScheme: data.pool.paymentProcessing.payoutScheme,
                        blockchainHeight: data.pool.networkStats.blockHeight,
                        connectedPeers: data.pool.networkStats.connectedPeers
                    })
                    props.enqueueSnackbar('Successfully fetched the pool data.', {
                        variant: 'success',
                    })
                    setLoading({ loading: false, loadingtext: "" });
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                    props.enqueueSnackbar('Error loading pool data, please try again later.', {
                        variant: 'error',
                    })
                    setLoading({ loading: false, loadingtext: "" });
                })
                .then(function () {
                    // always executed
                    // console.log(ex);
                    // setLoading({ loading: false, loadingtext: "" });
                });

        }


        getGraphData();
        getPoolData();

    }, [props, poolid])

    const WalletCard = () => {
        return <Grid item xs={12} >
            <Grid
                container spacing={3}
                direction="row"
                justify="space-evenly"
                alignItems="left">
                <Card className={classes.valueItems} style={{ width: "100%" }} >
                    <CardHeader
                        title={"Wallet address"}
                    />
                    <CardContent>
                        <TextField
                            id="standard-basic"
                            label="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            style={{ width: "90%" }} />
                        <br /><br />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={loadWalletData}
                            style={{ width: "25%", height: "20%" }}>
                            Load wallet
            </Button>
                    </CardContent>
                </Card>
            </Grid></Grid>
    }
    //Extra row cards for basic pool data
    const InfoCard = () => {
        return <Grid item xs={12} >
            <Grid
                container spacing={3}
                direction="row"
                justify="space-evenly"
                alignItems="center">

                {CardInfo(walletData.pendingShares, "Pending Shares")}
                {CardInfo(walletData.pendingBalance, "Pending Balance")}
                {CardInfo(walletData.paidBalanceToday, "Paid Balance Today")}
                {CardInfo(walletData.lifetimeBalance, "Lifetime Balance")}

            </Grid>
        </Grid>

    }
    function createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
    }

    const rows = [
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
        createData('Eclair', 262, 16.0, 24, 6.0),
    ];
    const WorkersTable = () => {
        return <Grid item md={6}>
            <Grid
                item
                direction="column"
                justify="center"
                alignItems="center"
                spacing={1}
            >
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="caption table">
                        <caption>A basic table example with a caption</caption>
                        <TableHead>
                            <TableRow>
                                <TableCell>Dessert (100g serving)</TableCell>
                                <TableCell align="right">Calories</TableCell>
                                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                                <TableCell align="right">Protein&nbsp;(g)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.calories}</TableCell>
                                    <TableCell align="right">{row.fat}</TableCell>
                                    <TableCell align="right">{row.carbs}</TableCell>
                                    <TableCell align="right">{row.protein}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid></Grid>
    }
    //Wrapper for Charts in a Card
    const CardChart = (data, CardSubtitle, CardLateststat) => {
        return <Grid item xs={12} sm={12} md={6}>
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                spacing={1}
            >
                <Card className={classes.root} style={{ width: "100%" }}>
                    <CardContent>
                        <div style={{ width: "100%", height: 400 }}>
                            <ResponsiveContainer >
                                <AreaChart data={data}
                                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#167ef5" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#167ef5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                                        labelStyle={{ fontWeight: 'bold', color: '#666666' }} />
                                    <Area type="monotone" dataKey="value" stroke="#b5ceeb" fill="url(#colorPv)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <Typography variant="h5" component="h5">
                            {CardLateststat}
                        </Typography>
                        <Typography variant="h6" component="h6">
                            {CardSubtitle}
                        </Typography>

                    </CardContent>
                </Card>
            </Grid></Grid>
    }

    const GetCardAvatar = (title) => {
        if (title.includes("Pending Shares")) {
            return <SettingsEthernetIcon />
        } else if (title.includes("Pending Balance")) {
            return <MenuIcon />
        }
        else if (title.includes("Paid Balance Today")) {
            return <SendIcon />
        }
        else if (title.includes("Lifetime Balance")) {
            return <SettingsEthernetIcon />
        }
        else {
            return <PieChartIcon />
        }
    }



    //Cards giving data on cardHEader
    const CardInfo = (data, Title) => {
        return <Card className={classes.valueItems}>
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
    }

    const classes = useStyles();
    return (
        <React.Fragment>
            <CssBaseline />
            <Topbar currentPath={"/dashboard"} />
            <div className="container_main">
                {loading.loading ?
                    (<Loading overlay={true} loading={loading.loading} loadingtext={loading.loadingtext} />)
                    : (
                        <Grid container spacing={2} direction="row">
                            {WalletCard()}
                            {InfoCard()}
                            {CardChart(poolHashrates, "Pool Hashrate", hashformat(poolData.poolHashRate, 2, "H/s"))}
                            {WorkersTable()}
                        </Grid>
                    )
                }
            </div>
        </React.Fragment>
    )
}

export default withSnackbar(Stats);