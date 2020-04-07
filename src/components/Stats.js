import React, { useState, useEffect } from 'react'
import withStyles from "@material-ui/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Topbar from "./Topbar";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import "./Stats.css";
import {
    ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine, ReferenceArea,
    ReferenceDot, Tooltip, CartesianGrid, Legend, Brush, ErrorBar, AreaChart, Area,
    Label, LabelList
} from 'recharts';

import { scalePow, scaleLog } from 'd3-scale';

const styles = theme => ({
    grid: {
        width: 1100
    }
});

const useStyles = makeStyles({
    root: {
        maxWidth: 275,
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




// Sample response from the api data. 
// "poolHashrate": 8.304559E+09,
//       "connectedMiners": 15,
//       "validSharesPerSecond": 0,
//       "networkHashrate": 19632872718.33352,
//       "networkDifficulty": 289.6462763411404,
//       "created": "2020-04-04T07:00:00"


const Stats = (props) => {

    // Name of the chain, getting the value from the router parameter.
    const poolid = props.match.params.coin;

    // const [graphDataResponse, setGraphDataResponse] = useState([]);
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

    const [poolHashrate, setPoolHashrate] = useState();
    // const [connectedMiners, setConnectedMiners] = useState();


    useEffect(() => {
        getGraphData();
        getPoolData();
    }, [])

    const getGraphData = async () => {
        const response = await fetch(
            `https://mineit.io/api/pools/${poolid}/performance`
        );

        const data = await response.json();

        // console.log(data);
        // console.log(data.stats);
        // setGraphDataResponse(data.stats);

        data.stats.map((stats, index) => (
            setPoolHashrates(poolHashrates => [...poolHashrates, { value: (stats.poolHashrate / 1000000000), name: stats.created.substring(11, 16) }]),
            setConnectedMiners(connectedMiners => [...connectedMiners, { value: stats.connectedMiners, name: stats.created.substring(11, 16) }]),
            setNetworkHashrates(networkHashRates => [...networkHashRates, { value: (stats.networkHashrate / 1000000000), name: stats.created.substring(11, 16) }]),
            setNetworkDifficulty(networkDifficulty => [...networkDifficulty, { value: stats.networkDifficulty, name: stats.created.substring(11, 16) }])
        ));
    };

    const getPoolData = async () => {
        const response = await fetch(`https://mineit.io/api/pools/${poolid}`);

        const data = await response.json();
        console.log(data.pool);

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

        // setPoolHashrate(data.pool.poolStats.poolHashrate)

    }

    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

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
                            <AreaChart width={800} height={400} data={poolHashrates}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#167ef5" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#167ef5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="1 " />
                                <Tooltip />
                                <Area type="monotone" dataKey="value" stroke="#b5ceeb" fill="url(#colorPv)" />
                            </AreaChart>

                            <Card className={classes.root} variant="outlined">
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        {poolData.poolHashRate}
                                    </Typography>
                                    <Typography variant="body" component="h5">
                                        Pool Hashrate
                                    </Typography>
                                </CardContent>
                            </Card>
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
                            <AreaChart width={800} height={400} data={connectedMiners}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#167ef5" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#167ef5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="1 " />
                                <Tooltip />
                                <Area type="monotone" dataKey="value" stroke="#b5ceeb" fill="url(#colorPv)" />
                            </AreaChart>

                            <Card className={classes.root} variant="outlined">
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        {poolData.miners} Miners
                        </Typography>
                                    <Typography variant="body" component="h5">
                                        Miners (Workers)
                        </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} >
                        <Grid
                            container spacing={3}
                            direction="row"
                            justify="space-evenly"
                            alignItems="center">

                            <Card className={classes.valueItems} variant="outlined">
                                <CardContent>
                                    <Typography variant="h5" component="h2">

                                        {poolData.blockchainHeight}
                                    </Typography>
                                    <Typography variant="body" component="h5">
                                        Blockchain Height
                        </Typography>
                                </CardContent>
                            </Card>

                            <Card className={classes.valueItems} variant="outlined">
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        {poolData.connectedPeers}
                                    </Typography>
                                    <Typography variant="body" component="h5">
                                        Connected Peers
                        </Typography>
                                </CardContent>
                            </Card>

                            <Card className={classes.valueItems} variant="outlined">
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

                            <Card className={classes.valueItems} variant="outlined">
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        {poolData.poolFee} %
                        </Typography>
                                    <Typography variant="body" component="h5">
                                        Pool Fee
                        </Typography>
                                </CardContent>
                            </Card>
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
                            <AreaChart width={800} height={400} data={networkHashRates}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#167ef5" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#167ef5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="1 " />
                                <Tooltip />
                                <Area type="monotone" dataKey="value" stroke="#b5ceeb" fill="url(#colorPv)" />
                            </AreaChart>

                            <Card className={classes.root} variant="outlined">
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        {poolData.networkHashrate}
                                    </Typography>
                                    <Typography variant="body" component="h5">
                                        Network Hashrate
                        </Typography>
                                </CardContent>
                            </Card>

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

                            <AreaChart width={800} height={400} data={networkDifficulty}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#167ef5" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#167ef5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="1 " />
                                <Tooltip />
                                <Area type="monotone" dataKey="value" stroke="#b5ceeb" fill="url(#colorPv)" />
                            </AreaChart>



                            <Card className={classes.root} variant="outlined">
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        {poolData.networkDifficulty}
                                    </Typography>
                                    <Typography variant="body" component="h5">
                                        Network Difficulty
                        </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                </Grid>


            </div>

        </React.Fragment>

    )
}

export default Stats; 