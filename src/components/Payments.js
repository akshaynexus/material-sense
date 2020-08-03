import React, { useState, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import axios from "axios";

import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";

import clsx from "clsx";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";

import "./Stats.css";

import config from "../config.js";
import { withSnackbar } from "notistack";
import Loading from "./common/Loading";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import InfiniteScroll from "react-infinite-scroll-component";

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
  detailsview: {
    display: "flex",
    flexDirection: "column",
  },
});

const Payments = (props) => {
  const poolid = localStorage.getItem("poolid");

  const [paymentTableRows, setPaymentTableRows] = useState([
    {
      sent: "",
      address: "",
      amount: 0,
      confirmation: "",
    },
  ]);

  const [transactionConfirmations, setTransactionConfirmations] = useState([]);

  const [loading, setLoading] = useState({
    loading: true,
    loadingtext: "Loading Table Data",
    error: "NoError",
  });

  const [hasMoreData, setHasMoreData] = useState(true);

  const [amounts, setAmounts] = useState([]);

  const [page, setPage] = useState(0);

  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    const loadTableData = async () => {
      let data;
      setPaymentTableRows([]);

      await axios
        .get(
          config.poolapiurl +
            `pools/${poolid}/payments?page=${page}&pageSize=75`
        )
        .then(function (response) {
          // handle success
          data = response.data;

          if (data.length === 0) setHasMoreData(false);

          data.map((d, index) => {
            setPaymentTableRows((paymentTableRow) => [
              ...paymentTableRow,
              {
                sent: formatDate(d.created),
                address: d.address,
                amount: d.amount,
                confirmation: d.transactionConfirmationData,
              },
            ]);
            setTransactionConfirmations((transactionConfirmation) => [
              ...new Set([
                ...transactionConfirmation,
                d.transactionConfirmationData,
              ]),
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

  const loadNextPage = async () => {
    try {
      let data;

      setLoading({ loading: true, loadingtext: "Loading more rows" });
      const nextPage = page + 1;
      console.log("page to load" + nextPage);
      setPage(nextPage);

      await axios
        .get(
          config.poolapiurl +
            `pools/${poolid}/payments?page=${nextPage}&pageSize=75`
        )
        .then((response) => {
          // handle success
          data = response.data;
          if (data.length === 0) setHasMoreData(false);

          data.map((d, index) => {
            setTimeout(() => {
              setPaymentTableRows((paymentTableRow) => [
                ...paymentTableRow,
                {
                  sent: formatDate(d.created),
                  address: d.address,
                  amount: d.amount,
                  confirmation: d.transactionConfirmationData,
                },
              ]);
              setTransactionConfirmations((transactionConfirmation) => [
                ...new Set([
                  ...transactionConfirmation,
                  d.transactionConfirmationData,
                ]),
              ]);
            });

            return true;
          });

          if (paymentTableRows.length === 500) setHasMoreData(false);
          setLoading({ loading: false, loadingtext: "" });
          setDataFetched(true);

          return true;
        })
        .catch(function (error) {
          props.enqueueSnackbar("Error loading table data : " + error, {
            variant: "error",
          });
          setLoading({ loading: false, loadingtext: "" });
        });
    } catch (e) {}
  };

  useEffect(() => {
    if (dataFetched) {
      setAmounts([]);
      transactionConfirmations.map((transactionConfirmation) => {
        let tempAmount = 0.0;

        setTimeout(() => {
          paymentTableRows
            .filter(
              (paymentTableRow) =>
                paymentTableRow.confirmation === transactionConfirmation
            )
            .map((paymentTableRow) => {
              tempAmount += paymentTableRow.amount;
              return true;
            });

          setAmounts((amounts) => [...amounts, tempAmount]);
        });

        return true;
      });
      setDataFetched(false);
    }
  }, [dataFetched]);

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
          spacing={1}
          container
        >
          <Card className={classes.root} style={{ width: "100%" }}>
            <CardContent>
              <Typography variant="h5" component="h5">
                Payments Rewarded
              </Typography>
              <Typography variant="h6" component="h6">
                Last {paymentTableRows.length} Payments for {poolid}
              </Typography>
              <br />
              <div style={{ width: "100%", border: "0px" }}>
                <Typography variant="h4" component="h4">
                  Confirmation
                </Typography>
              </div>
              {!loading ? (
                "No Data"
              ) : (
                <List>
                  {transactionConfirmations.map(
                    (transactionConfirmation, index) => (
                      <>
                        <Divider />

                        <ExpansionPanel>
                          <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1c-content"
                            id="panel1c-header"
                          >
                            <div>
                              <Typography className={classes.heading}>
                                {transactionConfirmation}
                              </Typography>
                            </div>
                          </ExpansionPanelSummary>
                          <ExpansionPanelDetails
                            className={classes.detailsview}
                          >
                            <div>
                              <Typography
                                variant="h6"
                                align="left"
                                style={{ marginLeft: "100px", padding: "5px" }}
                              >
                                Total Paid : {amounts[index]}
                              </Typography>
                            </div>
                            <div
                              className={clsx(classes.column, classes.helper)}
                            >
                              <Table
                                className={classes.table}
                                aria-label="table"
                              >
                                <TableHead
                                  className={classes.tableHeader}
                                  align="center"
                                  style={{
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  <TableRow align="center">
                                    <TableCell align="center">Date</TableCell>
                                    <TableCell align="center">
                                      Address
                                    </TableCell>
                                    <TableCell align="center">
                                      Paid Amount
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                {paymentTableRows
                                  .filter(
                                    (paymentTableRow) =>
                                      paymentTableRow.confirmation ===
                                      transactionConfirmation
                                  )
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
                              </Table>
                            </div>
                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                      </>
                    )
                  )}
                </List>
              )}
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
      {/* <Topbar currentPath={"/payments"} /> */}
      <div
        className="container_main"
        id="scrollableDiv"
        style={{ overflow: "auto" }}
      >
        <InfiniteScroll
          dataLength={transactionConfirmations.length}
          next={loadNextPage}
          hasMore={hasMoreData}
          style={{ overflowX: "hidden" }}
          loader={
            <div>
              <br />
              <Loading
                overlay={true}
                loading={loading.loading}
                loadingtext={loading.loadingtext}
                scrollableTarget="scrollableDiv"
              />
              <br />
            </div>
          }
        >
          <Grid container spacing={2} direction="row">
            {WorkersTable()}
          </Grid>
        </InfiniteScroll>
      </div>
    </React.Fragment>
  );
};

export default withSnackbar(Payments);
