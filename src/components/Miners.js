import React, { useState, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";

import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import hashformat from "./common/hashutil.js";

import "./Stats.css";

import config from "../config.js";
import { withSnackbar } from "notistack";
import Loading from "./common/Loading";

const useStyles = makeStyles({
    root: {
        borderWidth: "1px",
        borderColor: "green !important",
        "@media (min-width: 600px)": {
            marginTop: "5px",
        },
        "@media (min-width: 320px)": {
            marginTop: "5px",
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
    tableHeader: {
        width: 275,
        marginBottom: 1,
        borderWidth: "0px",
        marginTop: "6px",
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

const Miners = (props) => {
    const poolid = localStorage.getItem("poolid");

    const [minerTableRows, setMinerTableRows] = useState([
        {
            id: 0,
            minerAddress: "",
            hashrate: 0.0,
            sharesPerSecond: 0.0,
        },
    ]);

    const page = 0;

    const [rowsPerPage] = useState(20);

    const [loading, setLoading] = useState({
        loading: true,
        loadingtext: "Loading Table Data",
        error: "NoError",
    });

    useEffect(() => {
        const loadTableData = async () => {
            let data;
            setMinerTableRows([]);
            await axios
                .get(
                    config.poolapiurl +
                    `pools/${poolid}/miners?pageSize=${rowsPerPage}&page=${page}`
                )
                .then(function (response) {
                    // handle success
                    data = response.data;

                    data.map((d) => {
                        setMinerTableRows((minerTableRow) => [
                            ...minerTableRow,
                            {
                                id: d.id,
                                minerAddress: d.miner,
                                hashrate: hashformat(d.hashrate, 2, "H/s"),
                                sharesPerSecond: d.sharesPerSecond,
                            },
                        ]);
                        return true;
                    });

                    props.enqueueSnackbar("Successfully fetched the table data.", {
                        variant: "success",
                    });

                    setLoading({ loading: false, loadingtext: "" });
                    return true;
                })
                .catch(function (error) {
                    props.enqueueSnackbar("Error loading table data : " + error, {
                        variant: "error",
                    });
                    setLoading({ loading: false, loadingtext: "" });
                });
        };

        loadTableData();
    }, [poolid]);

    const WorkersTable = () => {
        return (
            <Grid item xs={12} md={12}>
                <Grid
                    item
                    direction="column"
                    justify="center"
                    alignItems="center"
                    spacing={0}
                    container
                >
                    <Card className={classes.root} style={{ width: "100%" }}>
                        <CardContent>
                            <Typography variant="h5" component="h5">
                                Best Miners
                            </Typography>
                            <Typography variant="h6" component="h6">
                                Top 20 Miners
                            </Typography>
                            <br />
                            <div style={{ width: "100%", border: "0px" }}>
                                <TableContainer
                                    component={Paper}
                                    style={{ width: "100%", border: "0px" }}
                                >
                                    <Table className={classes.table} aria-label="table">
                                        <TableHead className={classes.tableHeader}>
                                            <TableRow>
                                                <TableCell align="center">Address</TableCell>
                                                <TableCell align="center">Hashrate</TableCell>
                                                <TableCell align="center">Share Rate</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {minerTableRows
                                                .map((minerTableRow, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell align="center">
                                                            {minerTableRow.minerAddress}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {minerTableRow.hashrate}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {(minerTableRow.sharesPerSecond * 100000 / 100000).toFixed(6)} S/s
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

    const classes = useStyles();
    return (
        <React.Fragment>
            <CssBaseline />
            {/* <Topbar currentPath={"/miners"} /> */}
            <div className="container_main">
                {loading.loading ? (
                    <Loading
                        overlay={true}
                        loading={loading.loading}
                        loadingtext={loading.loadingtext}
                    />
                ) : (
                        <Grid container spacing={2} direction="row">
                            {WorkersTable()}
                        </Grid>
                    )}
            </div>
        </React.Fragment>
    );
};

export default withSnackbar(Miners);
