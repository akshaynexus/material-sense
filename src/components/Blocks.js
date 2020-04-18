import React, { useState, useEffect } from 'react'
import CssBaseline from "@material-ui/core/CssBaseline";
import Topbar from "./Topbar";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import axios from "axios";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import DoneIcon from '@material-ui/icons/Done';
import TablePagination from '@material-ui/core/TablePagination';
import TableFooter from '@material-ui/core/TableFooter';

import "./Stats.css";

import config from "../config.js";
import { withSnackbar } from 'notistack';
import Loading from "./common/Loading";

const useStyles = makeStyles({
    root: {
        borderWidth: "1px",
        borderColor: "green !important",
        '@media (min-width: 600px)': {
            marginTop: "5px",
        },
        '@media (min-width: 320px)': {
            marginTop: "5px",
        }
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
    tableHeader: {
        width: 275,
        marginTop: 0,
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
        marginTop: "15px",
    },
    tableHeader: {
        fontSize: 24,
        padding: 5,
        border: 3,
        borderWidth: 5
    }

});

const Blocks = (props) => {

    const poolid = localStorage.getItem("poolid");

    const [blockTableRows, setBlockTableRows] = useState([{
        found: "",
        height: 0,
        effort: "",
        status: "",
        reward: 0.0,
        confirmation: 0,
        miner: ""
    }]);

    const [totalPosts, setTotalPosts] = useState();
    const [totalPages, setTotalPages] = useState(0);


    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);


    const [loading, setLoading] = useState({
        loading: true,
        loadingtext: "Loading Table Data",
        error: 'NoError'
    });

    const handleChangePage = (event, newPage) => {
        console.log("Page Number : " + newPage);
        if (page <= newPage) {
            setPage(newPage);
            loadPage();
        }

    };

    const loadPage = async () => {

        await axios.get(config.poolapiurl + `pools/${poolid}/blocks?pagesize=${rowsPerPage}&page=${page}&order=ASC&sort=id`)
            .then(function (response) {
                // handle success
                const data = response.data;

                data.map((d) => {

                    setBlockTableRows(blockTableRow => [...blockTableRow, {
                        found: formatDate(d.created),
                        height: d.blockHeight,
                        effort: Math.round(d.effort * 100),
                        status: d.status,
                        reward: (Math.round(d.reward * 100) / 100).toFixed(2),
                        confirmation: Math.round(d.confirmationProgress * 100),
                        miner: d.miner
                    }]);

                });

                props.enqueueSnackbar('Successfully fetched the table data.', {
                    variant: 'success',
                })

                setLoading({ loading: false, loadingtext: "" });
            })
            .catch(function (error) {
                // handle error
                console.log(error);

                props.enqueueSnackbar('Error loading table data, please try again later.', {
                    variant: 'error',
                })
                setLoading({ loading: false, loadingtext: "" });
            })

    }

    useEffect(() => {

        const loadTableData = async () => {
            let data;

            // setPoolHashrates([]);
            // setLoading({ loading: true, loadingtext: "Loading Pool data" });

            setBlockTableRows([]);

            // pagesize=15&page=2&order=ASC&sort=id
            // https://mineit.io/api/pools/indexchain/blocks?pagesize=15&page=2&order=ASC&sort=id
            await axios.get(config.poolapiurl + `pools/${poolid}/blocks?pagesize=${rowsPerPage}&page=${page}&order=ASC&sort=id`)
                .then(function (response) {
                    // handle success
                    data = response.data;

                    // Get total posts value from the header. 
                    // console.log("headers : " + JSON.stringify(response.headers))
                    const jsonString = JSON.stringify(response.headers);

                    JSON.parse(jsonString, (key, value) => {
                        if (key === 'x-total-count') {
                            setTotalPosts(value);
                            setTotalPages(Math.round(value / rowsPerPage) + 1);
                        }
                    });

                    data.map((d) => {

                        // console.log(d.id);

                        setBlockTableRows(blockTableRow => [...blockTableRow, {
                            found: formatDate(d.created),
                            height: d.blockHeight,
                            effort: Math.round(d.effort * 100),
                            status: d.status,
                            reward: (Math.round(d.reward * 100) / 100).toFixed(2),
                            confirmation: Math.round(d.confirmationProgress * 100),
                            miner: d.miner
                        }]);

                    });

                    props.enqueueSnackbar('Successfully fetched the table data.', {
                        variant: 'success',
                    })

                    setLoading({ loading: false, loadingtext: "" });
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);

                    props.enqueueSnackbar('Error loading table data, please try again later.', {
                        variant: 'error',
                    })
                    setLoading({ loading: false, loadingtext: "" });
                })

        };

        loadTableData();

    }, [props, poolid]);

    const formatDate = (dateString) => {
        var options = {};
        return new Date(dateString).toLocaleDateString([], options);
    }


    const WorkersTable = () => {
        return <Grid item xs={12} md={12}>
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
                            Blocks Mined
                        </Typography>
                        <Typography variant="h6" component="h6">
                            Last 100 Blocks
                        </Typography>
                        <br />
                        <div style={{ width: "100%", border: "0px" }}>
                            <TableContainer component={Paper} style={{ width: "100%", border: "0px" }}>
                                <Table className={classes.table} aria-label="table" >
                                    <TableHead className={classes.tableHeader}>
                                        <TableRow>
                                            <TableCell align="center">Found</TableCell>
                                            <TableCell align="center">Height</TableCell>
                                            <TableCell align="center">Effort</TableCell>
                                            <TableCell align="center">Status</TableCell>
                                            <TableCell align="center">Reward</TableCell>
                                            <TableCell align="center">Confirmation</TableCell>
                                            <TableCell align="center">Miner</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody >

                                        {blockTableRows.map((blockTableRow, index) => (

                                            <TableRow key={index}>
                                                <TableCell align="center">{blockTableRow.found}</TableCell>
                                                <TableCell align="center">{blockTableRow.height}</TableCell>
                                                <TableCell align="center">{blockTableRow.effort}%</TableCell>
                                                <TableCell align="center">{blockTableRow.status}</TableCell>
                                                <TableCell align="center">{blockTableRow.reward}</TableCell>
                                                <TableCell align="center">{blockTableRow.confirmation === 100 ? <DoneIcon /> : <CircularProgress variant="static" value={blockTableRow.confirmation} color="inherit" />}</TableCell>
                                                <TableCell align="center">{blockTableRow.miner}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TablePagination
                                                rowsPerPageOptions={[15]}
                                                count={totalPages}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                SelectProps={{
                                                    inputProps: { 'aria-label': 'rows per page' },
                                                    native: true,
                                                }}
                                                onChangePage={handleChangePage}
                                            />
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </TableContainer>
                        </div>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    }

    const classes = useStyles();
    return (
        <React.Fragment>
            <CssBaseline />
            <Topbar currentPath={"/blocks"} />
            <div className="container_main">
                {loading.loading ?
                    (<Loading overlay={true} loading={loading.loading} loadingtext={loading.loadingtext} />)
                    : (
                        <Grid container spacing={2} direction="row">
                            {WorkersTable()}
                        </Grid>
                    )
                }
            </div>
        </React.Fragment>
    )
}

export default withSnackbar(Blocks);