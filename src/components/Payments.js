import React, { useState, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Topbar from "./Topbar";
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
import TableFooter from "@material-ui/core/TableFooter";

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

const Payments = (props) => {
    const poolid = localStorage.getItem("poolid");

    const [paymentTableRows, setPaymentTableRows] = useState([
        {
            sent: "",
            address: "",
            amount: 0,
            confirmation: ""
        },
    ]);

    const [loading, setLoading] = useState({
        loading: true,
        loadingtext: "Loading Table Data",
        error: "NoError",
    });

    useEffect(() => {
        const loadTableData = async () => {
            let data;
            setPaymentTableRows([]);

            await axios
                .get(
                    config.poolapiurl +
                    `pools/${poolid}/payments?page=0&pageSize=500`
                )
                .then(function (response) {
                    // handle success
                    data = response.data;
                    // Get total posts value from the header.

                    data.map((d) => {
                        setPaymentTableRows((paymentTableRow) => [
                            ...paymentTableRow,
                            {
                                sent: formatDate(d.created),
                                address: d.address,
                                amount: d.amount,
                                confirmation: d.transactionConfirmationData
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
    }, [poolid,props]);

    const formatDate = (dateString) => {
        var options = {};
        return new Date(dateString).toLocaleDateString([], options);
    };

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
                                Payments Rewarded
              </Typography>
                            <Typography variant="h6" component="h6">
                                Last 500 Payments
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
                                                <TableCell align="center">Sent</TableCell>
                                                <TableCell align="center">Address</TableCell>
                                                <TableCell align="center">Amount</TableCell>
                                                <TableCell align="center">Confirmation</TableCell>

                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {paymentTableRows
                                                .map((paymentTableRow, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell align="center">
                                                            {paymentTableRow.sent}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {paymentTableRow.address}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {paymentTableRow.amount}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {paymentTableRow.confirmation}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                        <TableFooter>
                                        </TableFooter>
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
            <Topbar currentPath={"/payments"} />
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

export default withSnackbar(Payments);