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
import CircularProgress from "@material-ui/core/CircularProgress";
import DoneIcon from "@material-ui/icons/Done";
import TablePagination from "@material-ui/core/TablePagination";
import TableFooter from "@material-ui/core/TableFooter";
import Tooltip from "@material-ui/core/Tooltip";

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

    // const [totalPages, setTotalPages] = useState(0);
    // const [page, setPage] = useState(0);

    // const [rowsPerPage, setRowsPerPage] = useState(500);

    const [loading, setLoading] = useState({
        loading: true,
        loadingtext: "Loading Table Data",
        error: "NoError",
    });

    // const handleChangePage = async (event, newPage) => {
    //     console.log("New Page : " + newPage);
    //     setPage(newPage);

    //     // console.log(page);
    //     // https://mineit.io/api/pools/indexchain/payments?page=0&pageSize=500 

    //     await axios
    //         .get(
    //             config.poolapiurl +
    //             `pools/${poolid}/payments?pageSize=?page=0&pageSize=500`
    //         )
    //         .then(function (response) {
    //             // handle success
    //             const data = response.data;

    //             data.map((d) => {
    //                 setPaymentTableRows((paymentTableRow) => [
    //                     ...paymentTableRow,
    //                     {
    //                         sent: formatDate(d.created),
    //                         address: d.address,
    //                         amount: d.amount,
    //                         confirmation: d.transactionConfirmationData
    //                     },
    //                 ]);
    //                 return true;
    //             });

    //             props.enqueueSnackbar("Successfully fetched the table data.", {
    //                 variant: "success",
    //             });

    //             setLoading({ loading: false, loadingtext: "" });
    //         })
    //         .catch(function (error) {
    //             // handle error
    //             props.enqueueSnackbar("Error : " + error, {
    //                 variant: "error",
    //             });
    //             setLoading({ loading: false, loadingtext: "" });
    //         });
    // };

    // useEffect(() => { console.log("Total Pages is " + totalPages) }, [totalPages])

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
                    const jsonString = JSON.stringify(response.headers);

                    // JSON.parse(jsonString, (key, value) => {
                    //     if (key === "x-total-count") {
                    //         console.log(key);
                    //         console.log(value);
                    //         console.log(rowsPerPage);
                    //         setTotalPages(Math.round(value / rowsPerPage) + 1);
                    //     }
                    // });

                    // console.log("Total Pages : " + totalPages);

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
    }, []);

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
                                                // .slice(
                                                //     page * rowsPerPage,
                                                //     page * rowsPerPage + rowsPerPage
                                                // )
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
                                            {/* <TableRow>
                                                <TablePagination
                                                    
                                                    count={totalPages}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    SelectProps={{
                                                        inputProps: { "aria-label": "rows per page" },
                                                        native: true,
                                                    }}
                                                    onChangePage={handleChangePage}
                                                />
                                            </TableRow> */}
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
