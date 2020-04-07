import React, { useState, useEffect } from 'react'
import CssBaseline from "@material-ui/core/CssBaseline";
import Topbar from "./Topbar";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import "./Stats.css";
import { XAxis, YAxis, Tooltip, Legend, AreaChart, Area
} from 'recharts';

const useStyles = makeStyles({
    root: {
        // maxWidth: 275,
        borderWidth: "1px",
        borderColor: "green !important"
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


const Stats = (props) => {

    // Name of the chain, getting the value from the router parameter.
    const poolid = props.match.params.coin;

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



    useEffect(() => {
        getGraphData();
        getPoolData();
    }, [])

    const getGraphData = async () => {
        const response = await fetch(
            `https://mineit.io/api/pools/${poolid}/performance`
        );

        const data = await response.json();

        data.stats.map((stats, index) => (
            setPoolHashrates(poolHashrates => [...poolHashrates, { value: (stats.poolHashrate / 1000000000), name: stats.created.substring(11, 16) }]),
            setConnectedMiners(connectedMiners => [...connectedMiners, { value: stats.connectedMiners, name: stats.created.substring(11, 16) }]),
            setNetworkHashrates(networkHashRates => [...networkHashRates, { value: (stats.networkHashrate / 1000000000), name: stats.created.substring(11, 16) }]),
            setNetworkDifficulty(networkDifficulty => [...networkDifficulty, { value: stats.networkDifficulty, name: stats.created.substring(11, 16) }])
        ));
    };

    const CardChart = (data,CardSubtitle,CardLateststat) =>{
        return <Card className={classes.root}>
                <CardContent>
                    <AreaChart width={800} height={400} data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                         <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#167ef5" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#167ef5" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#b5ceeb" fill="url(#colorPv)" />
                </AreaChart>
            <Typography variant="h5" component="h2">
                {CardLateststat}
            </Typography>
            <Typography variant="body" component="h5">
                {CardSubtitle}
            </Typography>
        </CardContent>
    </Card>
    }

    const CardInfo = (data,Title) => {
    return  <Card className={classes.valueItems}>
              <CardHeader
                 avatar={
                    <Avatar aria-label={Title} className={classes.avatar}>
                    {/*Put icon related to cardinfo here*/}
                    </Avatar>
                }
                title={Title}
                subheader={data}
                />
            </Card>
    }

    const getPoolData = async () => {
        const response = await fetch(`https://mineit.io/api/pools/${poolid}`);
        const data = await response.json();
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
    }

    const classes = useStyles();
    return (
        <React.Fragment>
            <CssBaseline />
            <Topbar currentPath={"/stats"} />
            <div className="container">
                <Grid container spacing={2} direction="row">
                    <Grid item xs={6}>
                        <Grid
                            container
                            direction="column"
                            justify="center"
                            alignItems="center"
                            spacing={3}
                        >
                        {CardChart(poolHashrates,"Pool Hashrate",poolData.poolHashRate)}
                        </Grid>
                    </Grid>

                    <Grid item xs={6}>
                        <Grid
                            container
                            direction="column"
                            justify="center"
                            alignItems="center"
                            spacing={3}
                        >
                            {CardChart(connectedMiners,"Miners",poolData.miners + " Miners")}
                        </Grid>
                    </Grid>

                    <Grid item xs={12} >
                        <Grid
                            container spacing={3}
                            direction="row"
                            justify="space-evenly"
                            alignItems="center">
                            {CardInfo(poolData.blockchainHeight,"Blockchain Height")}
                            {CardInfo(poolData.connectedPeers,"Connected Peers")}
                            <Card className={classes.valueItems}>
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        {poolData.paymentThreshold}
                                    </Typography>
                                    <Typography variant="body" component="h5">
                                        {poolData.paymentScheme}
                                    </Typography>
                                    <Typography variant="body" component="h5">
                                        Payment Threshold
                                    </Typography>
                                </CardContent>
                            </Card>

                            {CardInfo(poolData.poolFee + "%","Pool Fee")}

                        </Grid>

                    </Grid>

                    <Grid item xs={6}>
                        <Grid
                            container
                            direction="column"
                            justify="center"
                            alignItems="center"
                            spacing={3}
                        >
                            {CardChart(networkHashRates,"Network Hashrate",poolData.networkHashrate)}
                        </Grid>
                    </Grid>

                    <Grid item xs={6}>
                        <Grid
                            container
                            direction="column"
                            justify="center"
                            alignItems="center"
                            spacing={3}
                        >
                            {CardChart(networkDifficulty,"Network Difficulty",poolData.networkDifficulty)}
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </React.Fragment>
    )
}

export default Stats;