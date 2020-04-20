import React, { useState, useEffect } from 'react'
import CssBaseline from "@material-ui/core/CssBaseline";
import Topbar from "./Topbar";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import hashformat from './common/hashutil.js'
import Grid from '@material-ui/core/Grid';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import MenuIcon from '@material-ui/icons/Menu';
import PieChartIcon from '@material-ui/icons/PieChart';
import SendIcon from '@material-ui/icons/Send';
import axios from "axios";


import CardChart from "./CardChart";
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
            marginTop: "30px",
        },
        '@media (min-width: 320px)': {
            marginTop: "30px",
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
    },
});

// const fetcher = (...args) => fetch(...args).then(res => res.json());

const Stats = (props) => {

    // Name of the chain, getting the value from the router parameter.
    const poolid = localStorage.getItem("poolid");

    // const swrUrl = config.poolapiurl + `pools/${poolid}`;
    // const { data, error } = useSWR(swrUrl, fetcher)

    // console.log(data);

    const [poolHashrates, setPoolHashrates] = useState([]);
    const [connectedMiners, setConnectedMiners] = useState([]);
    const [networkHashRates, setNetworkHashrates] = useState([]);
    const [networkDifficulty, setNetworkDifficulty] = useState([]);

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
    const [loading, setLoading] = useState({
        loading: true,
        loadingtext: "Loading Graph data",
        error: 'NoError'
    });



    useEffect(() => {
        const getGraphData = async () => {
            let data;
            setPoolHashrates([]);
            setConnectedMiners([]);
            setNetworkHashrates([]);
            setNetworkDifficulty([]);

            setLoading({ loading: true, loadingtext: "Loading Pool data" });
            await axios.get(config.poolapiurl + `pools/${poolid}/performance`)
                .then(function (response) {
                    // handle success
                    data = response.data;

                    data.stats.map((stats) => {
                        setPoolHashrates(poolHashrates => [...poolHashrates, { value: (stats.poolHashrate / 1000000000), name: stats.created.substring(11, 16) }]);
                        setConnectedMiners(connectedMiners => [...connectedMiners, { value: stats.connectedMiners, name: stats.created.substring(11, 16) }]);
                        setNetworkHashrates(networkHashRates => [...networkHashRates, { value: (stats.networkHashrate / 1000000000), name: stats.created.substring(11, 16) }]);
                        setNetworkDifficulty(networkDifficulty => [...networkDifficulty, { value: stats.networkDifficulty, name: stats.created.substring(11, 16) }]);

                        return true;
                    });
                    props.enqueueSnackbar('Successfully fetched the graph data.', {
                        variant: 'success',
                    })
                })
                .catch(function (error) {
                    // handle error
                    console.error(error);

                    props.enqueueSnackbar('Error loading graph data : ' + error, {
                        variant: 'error',
                    })
                    setLoading({ loading: false, loadingtext: "" });
                })
                .then(function () { });
        };

        const getPoolData = async () => {
            await axios.get(config.poolapiurl + `pools/${poolid}`)
                .then(function (response) {
                    // handle success
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
                    props.enqueueSnackbar('Error loading pool data: ' + error, {
                        variant: 'error',
                    })
                    setLoading({ loading: false, loadingtext: "" });
                })
                .then(function () { });

        }


        getGraphData();
        getPoolData();

    }, [props, poolid])

    //Extra row cards for basic pool data
    const InfoCard = () => {
        return <Grid item xs={12} >
            <Grid
                container spacing={3}
                direction="row"
                justify="space-evenly"
                alignItems="center">
                {CardInfo(poolData.blockchainHeight, "Blockchain Height")}
                {CardInfo(poolData.connectedPeers, "Connected Peers")}
                {CardInfo(poolData.paymentThreshold, "Payment Threshold")}
                {CardInfo(poolData.poolFee + "%", "Pool Fee")}
            </Grid>
        </Grid>
    }
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
    //             <Card className={classes.root} style={{ width: "90%" }}>
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
        if (title.includes("Peers")) {
            return <SettingsEthernetIcon />
        }
        else if (title.includes("Height")) {
            return <MenuIcon />
        }
        else if (title.includes("Threshold")) {
            return <SendIcon />
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
            <Topbar currentPath={"/stats"} />
            <div className="container_main">
                {loading.loading ?
                    (<Loading overlay={true} loading={loading.loading} loadingtext={loading.loadingtext} />)
                    : (
                        <Grid container spacing={2} direction="row">
                            {/* {CardChart(poolHashrates, "Pool Hashrate", hashformat(poolData.poolHashRate, 2, "H/s"))}
                            {CardChart(connectedMiners, "Miners", poolData.miners)}
                            {InfoCard()}
                            {CardChart(networkHashRates, "Network Hashrate", hashformat(poolData.networkHashrate, 2, "H/s"))}
                            {CardChart(networkDifficulty, "Network Difficulty", poolData.networkDifficulty)} */}

                            <CardChart data={poolHashrates} CardSubtitle="Pool Hashrate" CardLateststat={hashformat(poolData.poolHashRate, 2, "H/s")} />
                            <CardChart data={connectedMiners} CardSubtitle="Miners" CardLateststat={poolData.miners} />
                            {InfoCard()}
                            <CardChart data={networkHashRates} CardSubtitle="Network Hashrate" CardLateststat={hashformat(poolData.networkHashrate, 2, "H/s")} />
                            <CardChart data={networkDifficulty} CardSubtitle="Network Difficulty" CardLateststat={poolData.networkDifficulty} />
                        </Grid>
                    )
                }
            </div>
        </React.Fragment>
    )
}

export default withSnackbar(Stats);