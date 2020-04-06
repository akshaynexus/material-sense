import React, { useState, useEffect } from 'react'
import "./Stats.css";
import Moment from "react-moment";
import 'moment-timezone';


import {
    ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine, ReferenceArea,
    ReferenceDot, Tooltip, CartesianGrid, Legend, Brush, ErrorBar, AreaChart, Area,
    Label, LabelList
} from 'recharts';
import { scalePow, scaleLog } from 'd3-scale';

// "poolHashrate": 8.304559E+09,
//       "connectedMiners": 15,
//       "validSharesPerSecond": 0,
//       "networkHashrate": 19632872718.33352,
//       "networkDifficulty": 289.6462763411404,
//       "created": "2020-04-04T07:00:00"


function Stats() {

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
            `https://mineit.io/api/pools/indexchain/performance`
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
        const response = await fetch(`https://mineit.io/api/pools/indexchain`);

        const data = await response.json();
        console.log(data.pool);

        setPoolData({
            poolHashRate: data.pool.poolStats.poolHashrate,
            miners: data.pool.poolStats.connectedMiners,
            networkHashrate: data.pool.networkStats.networkHashrate,
            networkDifficulty: data.pool.networkStats.networkDifficulty,
            poolFee: data.pool.poolFeePercent,
            paymentThreshold: data.pool.paymentProcessing.minimumPayment + " " + data.pool.paymentProcessing.payoutScheme,
            blockchainHeight: data.pool.networkStats.blockHeight,
            connectedPeers: data.pool.networkStats.connectedPeers
        })

        // setPoolHashrate(data.pool.poolStats.poolHashrate)

    }


    return (
        <div>
            <h1> Stats Page</h1>

            <h4>Pool Hashrate : {poolData.poolHashRate}</h4>
            <h4>Connected Miners : {poolData.miners}</h4>

            <h4> Network Hashrate : {poolData.networkHashrate}</h4>
            <h4> Network Difficulty : {poolData.networkDifficulty}</h4>
            <h4> Pool Fee : {poolData.poolFee} %</h4>
            <h4> Payment Threshold : {poolData.paymentThreshold}</h4>
            <h4> Blockchain Height : {poolData.blockchainHeight}</h4>
            <h4> Connected Peers : {poolData.connectedPeers}</h4>

            {/* <h1>Pool Hashrate : {poolHashrate}</h1> */}

            {/* {networkHashRates.map((networkHashRates, index) => (
                <li key={index}>{networkHashRates}</li>
            ))} */}

            <LineChart width={800} height={400} data={poolHashrates}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#82ca9d" />
            </LineChart>

            <LineChart width={800} height={400} data={connectedMiners}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#82ca9d" />
            </LineChart>

            <LineChart width={800} height={400} data={networkHashRates}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#82ca9d" />
            </LineChart>

            <LineChart width={800} height={400} data={networkDifficulty}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#82ca9d" />
            </LineChart>

        </div>
    )
}

export default Stats; 