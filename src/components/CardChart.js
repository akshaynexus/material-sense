import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import {
    XAxis,
    YAxis,
    Tooltip,
    AreaChart,
    Area,
    ResponsiveContainer,
} from "recharts";

const useStyles = makeStyles({
    root: {
        // maxWidth: 275,
        borderWidth: "1px",
        borderColor: "green !important",
        "@media (min-width: 600px)": {
            marginTop: "30px",
        },
        "@media (min-width: 320px)": {
            marginTop: "30px",
        },
    },
    valueItems: {
        width: 275,
        borderWidth: "1px",
        borderColor: "yellow !important",
    },
    title: {
        fontSize: 16,
    },
    pos: {
        marginBottom: 12,
    },
});



const CardChart = ({ data, CardSubtitle, CardLateststat, hasSymbol = false, hasRate = true }) => {
    const classes = useStyles();

    const valueFormatter = (number) => {

        if (hasSymbol) {

            console.log("Number is :  " + number)

            if (hasRate) number = number * 1000000000;

            if (number < 1) {
                return (number * 1000000 / 1000000).toFixed(6)
            }

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
                // console.log("i : " + i + " value : " + s1[i].value + " symbol " + s1[i].symbol)
                if (number >= s1[i].value) {
                    // console.log("Returned value : " + (Math.round((number / s1[i].value) * 100) / 100).toFixed(2));
                    if (hasRate) {

                        //return (Math.round((number / s1[i].value) * 100) / 100).toFixed(2) + " " + s1[i].symbol + "H/s";
                        return (Math.round((number / s1[i].value) * 100) / 100).toFixed(2) + " " + s1[i].symbol + "H/s";
                        // return (number / s1[i].value) + s1[i].symbol;
                    } else {
                        //console.log("network difficulty value " + (Math.round((number / s1[i].value) * 100) / 100).toFixed(2) + " " + s1[i].symbol + "H/s")
                        //return (Math.round((number / s1[i].value) * 100) / 100).toFixed(2) + " " + s1[i].symbol;

                        return ((number / s1[i].value * 1000000) / 1000000).toFixed(6) + " " + s1[i].symbol;
                        // /return (number / s1[i].value) + s1[i].symbol;
                    }
                }
            }
        } else {
            return number;
        }

    }

    const NumberFormatter = (number) => {
        // if (number > 1000000000) {
        //     return (number / 1000000000).toString() + 'B';
        // } else if (number > 1000000) {
        //     return (number / 1000000).toString() + 'M';
        // } else if (number > 1000) {
        //     return (number / 1000).toString() + 'K';
        // } else {
        //     return number.toString() + 'Z';
        // }

        // console.log("Number formatter in card chart : " + number)

        if (hasRate) {
            number = number * 1000000000;
        }

        if (number < 1) {
            return (number * 1000000 / 1000000).toFixed(6)
        }


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
            // console.log("i : " + i + " value : " + s1[i].value + " symbol " + s1[i].symbol)
            if (number >= s1[i].value) {

                return (number / s1[i].value) + " " + s1[i].symbol;
            }
        }

    }


    return (
        <Grid item xs={12} sm={12} md={6}>
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                spacing={1}
            >
                <Card className={classes.root} style={{ width: "90%" }}>
                    <CardContent>
                        <div style={{ width: "100%", height: 400 }}>
                            <ResponsiveContainer>
                                <AreaChart
                                    data={data}
                                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#167ef5" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#167ef5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" />
                                    {/* {hasSymbol ? <YAxis tickFormatter={(tickValue) => `${tickValue} M`} /> : <YAxis />} */}

                                    {hasSymbol ? <YAxis domain={['dataMin', 'auto']} tickFormatter={NumberFormatter} /> : <YAxis />}

                                    <Tooltip
                                        contentStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                                        labelStyle={{ fontWeight: "bold", color: "#666666" }}
                                        formatter={valueFormatter}
                                    />

                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#b5ceeb"
                                        fill="url(#colorPv)"
                                    />

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
            </Grid>
        </Grid>
    );
};

export default CardChart;
