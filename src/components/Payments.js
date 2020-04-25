import React, { useState, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Topbar from "./Topbar";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";

import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import axios from "axios";

import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

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
        marginTop: "6px"
    },
    title: {
        fontSize: 16,
    },
    pos: {
        marginBottom: 12,
    },
    table: {
        border: "0px",
        marginTop: "15px"
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

    const [transactionConfirmations, setTransactionConfirmations] = useState([]);

    const [loading, setLoading] = useState({
        loading: true,
        loadingtext: "Loading Table Data",
        error: "NoError",
    });

    const [amounts, setAmounts] = useState([]);

    const [indexes, setIndexes] = useState([]);

    const handleClick = (index, item) => {
        // this.setState({ [index]: true });
        // setIndexs(...setIndexs, index[index] = true); 

        const tempIndexes = [...indexes];
        // tempIndexes[index] = true;
        if (tempIndexes[index]) {
            tempIndexes[index] = !tempIndexes[index];
        } else {
            tempIndexes[index] = true;
        }

        setIndexes(tempIndexes)
        //console.log(tempIndexes);

    }




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
                        setTransactionConfirmations((transactionConfirmation) => [...new Set([...transactionConfirmation, d.transactionConfirmationData])]);
                        setAmounts(amount => [...amount, d.amount])
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
    }, [poolid, props]);

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
                                Last 500 Payments for {poolid}
                            </Typography>
                            <br />
                            <div style={{ width: "100%", border: "0px" }}>
                                <Typography variant="h4" component="h4">
                                    Confirmation
                            </Typography>
                            </div>
                            {!loading ?
                                "No Data"
                                : <List>
                                    {transactionConfirmations
                                        .map((transactionConfirmation, index) =>
                                            <>
                                                <Divider />
                                                <ListItem key={index} button={true} onClick={({ item }) => handleClick(index, item)}/* component="a" href={thread.data.url}*/ >
                                                    <ListItemText primary={transactionConfirmation} />
                                                    {/* {[index] ? <ExpandLess /> : <ExpandMore />} */}
                                                </ListItem>
                                                <Collapse in={indexes[index]} timeout="auto" unmountOnExit={true}>
                                                    <Divider />
                                                    <>
                                                        <br />
                                                        <Typography variant="h6" component="h6">
                                                            Total Paid : {amounts[index]}
                                                        </Typography>

                                                        <TableRow>
                                                            <TableCell align="center">
                                                                Date
                                                        </TableCell>
                                                            <TableCell align="center">
                                                                Address
                                                        </TableCell>
                                                            <TableCell align="center">
                                                                Paid Amount
                                                        </TableCell>
                                                        </TableRow>
                                                    </>
                                                    {paymentTableRows.filter(paymentTableRow => (paymentTableRow.confirmation === transactionConfirmation))
                                                        .map((paymentTableRow, i) => (
                                                            <>
                                                                <TableRow key={i}>
                                                                    <TableCell align="center">
                                                                        {paymentTableRow.sent}
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        {paymentTableRow.address}
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        {paymentTableRow.amount}
                                                                    </TableCell>
                                                                </TableRow>
                                                            </>
                                                        ))}

                                                </Collapse>
                                                <Divider />
                                            </>
                                        )}
                                </List>}

                            {/* {transactionConfirmations
                                    .map((transactionConfirmation, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="center">
                                                {transactionConfirmation}
                                            </TableCell>

                                            {paymentTableRows.filter(paymentTableRow => (paymentTableRow.confirmation === transactionConfirmation))
                                                .map((paymentTableRow, i) => (

                                                    <TableRow key={i}>
                                                        <TableCell align="center">
                                                            {paymentTableRow.sent}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {paymentTableRow.address}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {paymentTableRow.amount}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}

                                        </TableRow>
                                    ))} */}




                        </CardContent>
                    </Card >
                </Grid >
            </Grid >
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
