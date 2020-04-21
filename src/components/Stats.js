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
import Loading from "./common/Loading";
import useSWR from "swr";

import CardChart from "./CardChart";
import "./Stats.css";

import config from "../config.js";
import { withSnackbar } from 'notistack';

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

    const swrUrl = config.poolapiurl + `pools/${poolid}`;
    const swrUrl2 = config.poolapiurl + `pools/${poolid}/performance`;

    // const { data, error } = useSWR(swrUrl, fetcher)
    const { data2, error2 } = useSWR(swrUrl2, (url2) => axios(url2).then(r2 => r2.data));

    const { data, error } = useSWR(swrUrl, (url) => axios(url).then(r => r.data));


    // console.log(data);
    // console.log(data2);

    // const [poolHashrates, setPoolHashrates] = useState([]);
    const [connectedMiners, setConnectedMiners] = useState([]);
    const [networkHashRates, setNetworkHashrates] = useState([]);
    const [networkDifficulty, setNetworkDifficulty] = useState([]);


    const poolHashRate = data?.pool.poolStats.poolHashrate;
    const miners = data?.pool.poolStats.connectedMiners;
    const networkHashrate = data?.pool.networkStats.networkHashrate;
    const networkDifficultyValue = data?.pool.networkStats.networkDifficulty;
    const poolFee = data?.pool.poolFeePercent;
    const paymentThreshold = data?.pool.paymentProcessing.minimumPayment + " " + data?.pool.coin.type;
    const blockchainHeight = data?.pool.networkStats.blockHeight;
    const connectedPeers = data?.pool.networkStats.connectedPeers;

    const [loading, setLoading] = useState({
        loading: true,
        loadingtext: "Loading Graph data",
        error: 'NoError'
    });


    const poolHashrates = data2?.stats.map(stats => { return [...poolHashrates, { value: (stats.poolHashrate / 1000000000), name: stats.created.substring(11, 16) }] });
    // console.log(poolHas)

    // const mapData = data2?.stats.map(stats => {
    //     console.log(stats)
    //     return (
    //         setPoolHashrates(poolHashrates => [...poolHashrates, { value: (stats.poolHashrate / 1000000000), name: stats.created.substring(11, 16) }]),
    //         setConnectedMiners(connectedMiners => [...connectedMiners, { value: stats.connectedMiners, name: stats.created.substring(11, 16) }]),
    //         setNetworkHashrates(networkHashRates => [...networkHashRates, { value: (stats.networkHashrate / 1000000000), name: stats.created.substring(11, 16) }]),
    //         setNetworkDifficulty(networkDifficulty => [...networkDifficulty, { value: stats.networkDifficulty, name: stats.created.substring(11, 16) }])
    //     );
    // });

    // if (data2) {
    //     console.log(data2)
    // }


    // const loadCacheData = () => {

    //     const mapData = data?.stats.map(stats => {
    //         return (
    //             setPoolHashrates(poolHashrates => [...poolHashrates, { value: (stats.poolHashrate / 1000000000), name: stats.created.substring(11, 16) }]),
    //             setConnectedMiners(connectedMiners => [...connectedMiners, { value: stats.connectedMiners, name: stats.created.substring(11, 16) }]),
    //             setNetworkHashrates(networkHashRates => [...networkHashRates, { value: (stats.networkHashrate / 1000000000), name: stats.created.substring(11, 16) }]),
    //             setNetworkDifficulty(networkDifficulty => [...networkDifficulty, { value: stats.networkDifficulty, name: stats.created.substring(11, 16) }])
    //         );
    //     });
    // }

    // useEffect(() => { loadCacheData() }, [])

    // setPoolData({
    //     poolHashRate: data2?.pool.poolStats.poolHashrate,
    //     miners: data2?.pool.poolStats.connectedMiners,
    //     networkHashrate: data2?.pool.networkStats.networkHashrate,
    //     networkDifficulty: data2?.pool.networkStats.networkDifficulty,
    //     poolFee: data2?.pool.poolFeePercent,
    //     paymentThreshold: data2?.pool.paymentProcessing.minimumPayment + " " + data2?.pool.coin.type,
    //     paymentScheme: data2?.pool.paymentProcessing.payoutScheme,
    //     blockchainHeight: data2?.pool.networkStats.blockHeight,
    //     connectedPeers: data2?.pool.networkStats.connectedPeers
    // })

    // data?.stats.map((stats) => {
    //     setPoolHashrates(poolHashrates => [...poolHashrates, { value: (stats.poolHashrate / 1000000000), name: stats.created.substring(11, 16) }]);
    //     setConnectedMiners(connectedMiners => [...connectedMiners, { value: stats.connectedMiners, name: stats.created.substring(11, 16) }]);
    //     setNetworkHashrates(networkHashRates => [...networkHashRates, { value: (stats.networkHashrate / 1000000000), name: stats.created.substring(11, 16) }]);
    //     setNetworkDifficulty(networkDifficulty => [...networkDifficulty, { value: stats.networkDifficulty, name: stats.created.substring(11, 16) }]);

    //     return true;
    // })


    useEffect(() => {
        const getGraphData = async () => {
            let data;
            // setPoolHashrates([]);
            setConnectedMiners([]);
            setNetworkHashrates([]);
            setNetworkDifficulty([]);

            await axios.get(config.poolapiurl + `pools/${poolid}/performance`)
                .then(function (response) {
                    // handle success
                    data = response.data;

                    data.stats.map((stats) => {
                        // setPoolHashrates(poolHashrates => [...poolHashrates, { value: (stats.poolHashrate / 1000000000), name: stats.created.substring(11, 16) }]);
                        setConnectedMiners(connectedMiners => [...connectedMiners, { value: stats.connectedMiners, name: stats.created.substring(11, 16) }]);
                        setNetworkHashrates(networkHashRates => [...networkHashRates, { value: (stats.networkHashrate / 1000000000), name: stats.created.substring(11, 16) }]);
                        setNetworkDifficulty(networkDifficulty => [...networkDifficulty, { value: stats.networkDifficulty, name: stats.created.substring(11, 16) }]);

                        return true;
                    });
                    // props.enqueueSnackbar('Successfully fetched the graph data.', {
                    //     variant: 'success',
                    // })
                })
                .catch(function (error) {
                    // handle error
                    console.error(error);

                    props.enqueueSnackbar('Error loading graph data : ' + error, {
                        variant: 'error',
                    })
                })
                .then(function () { });
        };

        // const getPoolData = async () => {
        //     await axios.get(config.poolapiurl + `pools/${poolid}`)
        //         .then(function (response) {
        //             // handle success
        //             let data = response.data;
        //             setPoolData({
        //                 poolHashRate: data.pool.poolStats.poolHashrate,
        //                 miners: data.pool.poolStats.connectedMiners,
        //                 networkHashrate: data.pool.networkStats.networkHashrate,
        //                 networkDifficulty: data.pool.networkStats.networkDifficulty,
        //                 poolFee: data.pool.poolFeePercent,
        //                 paymentThreshold: data.pool.paymentProcessing.minimumPayment + " " + data.pool.coin.type,
        //                 paymentScheme: data.pool.paymentProcessing.payoutScheme,
        //                 blockchainHeight: data.pool.networkStats.blockHeight,
        //                 connectedPeers: data.pool.networkStats.connectedPeers
        //             })
        //             props.enqueueSnackbar('Successfully fetched the pool data.', {
        //                 variant: 'success',
        //             })
        //         })
        //         .catch(function (error) {
        //             // handle error
        //             props.enqueueSnackbar('Error loading pool data: ' + error, {
        //                 variant: 'error',
        //             })
        //         })
        //         .then(function () { });

        // }

        // getPoolData();
        getGraphData();

    }, [props, poolid])

    //Extra row cards for basic pool data
    const InfoCard = () => {
        return <Grid item xs={12} >
            <Grid
                container spacing={3}
                direction="row"
                justify="space-evenly"
                alignItems="center">
                {CardInfo(blockchainHeight, "Blockchain Height")}
                {CardInfo(connectedPeers, "Connected Peers")}
                {CardInfo(paymentThreshold, "Payment Threshold")}
                {CardInfo(poolFee + "%", "Pool Fee")}
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
        < React.Fragment >
            <CssBaseline />

            <Topbar currentPath={"/stats"} />
            <div className="container_main">
                {!data ?
                    (<Loading overlay={true} loading={loading.loading} loadingtext={loading.loadingtext} />)
                    : (
                        <Grid container spacing={2} direction="row">
                            {/* {CardChart(poolHashrates, "Pool Hashrate", hashformat(poolData.poolHashRate, 2, "H/s"))}
                            {CardChart(connectedMiners, "Miners", poolData.miners)}
                            {InfoCard()}
                            {CardChart(networkHashRates, "Network Hashrate", hashformat(poolData.networkHashrate, 2, "H/s"))}
                            {CardChart(networkDifficulty, "Network Difficulty", poolData.networkDifficulty)} */}

                            <CardChart data={poolHashrates} CardSubtitle="Pool Hashrate" CardLateststat={hashformat(poolHashRate, 2, "H/s")} />
                            <CardChart data={connectedMiners} CardSubtitle="Miners" CardLateststat={miners} />
                            {InfoCard()}
                            <CardChart data={networkHashRates} CardSubtitle="Network Hashrate" CardLateststat={hashformat(networkHashrate, 2, "H/s")} />
                            <CardChart data={networkDifficulty} CardSubtitle="Network Difficulty" CardLateststat={networkDifficultyValue} />
                        </Grid>
                    )
                }
            </div>

        </React.Fragment>
    )
}

export default withSnackbar(Stats);
