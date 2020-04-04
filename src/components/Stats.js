import React, { useState, useEffect } from 'react'
import "./Stats.css";

// "poolHashrate": 8.304559E+09,
//       "connectedMiners": 15,
//       "validSharesPerSecond": 0,
//       "networkHashrate": 19632872718.33352,
//       "networkDifficulty": 289.6462763411404,
//       "created": "2020-04-04T07:00:00"


const Stats = () => {

    const [graphDataResponse, setGraphDataResponse] = useState([]);
    const [poolHashrates, setPoolHashrates] = useState([]);
    const [connectedMiners, setConnectedMiners] = useState([]);
    const [networkHashRates, setNetworkHashrates] = useState([]);
    const [networkDifficulty, setNetworkDifficulty] = useState([]);

    useEffect(() => {
        getGraphData();
    }, [])

    const getGraphData = async () => {
        const response = await fetch(
            `https://mineit.io/api/pools/indexchain/performance`
        );

        const data = await response.json();

        // console.log(data);
        // console.log(data.stats);
        setGraphDataResponse(data.stats);
        console.log(graphDataResponse.length);

        // data.stats.map((stats, index) => (
        //     setPoolHashrates([...poolHashrates, stats.poolHashrate])
        //     // setPoolHashrates([...poolHashrates, 10])
        //     //console.log(stats.poolHashrate)
        // ));

        // console.log(poolHashrates);
        // console.log(poolHashrates.length);


    };


    return (
        <div>
            Stats Component
        </div>
    )
}

export default Stats; 