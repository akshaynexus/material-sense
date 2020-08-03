import React, { Component } from "react";
import withStyles from "@material-ui/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import { Redirect } from "react-router-dom";

const styles = (theme) => ({
  paper: {
    padding: theme.spacing(3),
    textAlign: "left",
    marginLeft: "5px",
    color: theme.palette.text.secondary,
  },
  avatar: {
    marginTop: 10,
    marginBottom: 0,
  },
  avatarContainer: {
    [theme.breakpoints.down("sm")]: {
      marginLeft: 0,
      marginBottom: theme.spacing(5),
    },
  },
  itemContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
  },
  baseline: {
    alignSelf: "baseline",
    marginLeft: theme.spacing(2),
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
    gridAutoFlow: "row",
    width: "90%",
    [theme.breakpoints.down("sm")]: {
      display: "grid",
      gridTemplateColumns: "50% 50%",
      gridRow: "auto auto",
      gridRowGap: "15px",
      textAlign: "center",
      alignItems: "center",
      width: "100%",
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      marginLeft: 0,
    },
  },
  inline: {
    display: "inline-block",
    marginLeft: theme.spacing(4),
    flexGrow: "1",
    [theme.breakpoints.down("sm")]: {
      marginLeft: 0,
    },
  },
  inlineRight: {
    width: "30%",
    textAlign: "right",
    marginLeft: 50,
    alignSelf: "flex-end",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      margin: 0,
      textAlign: "center",
    },
  },
  backButton: {
    marginRight: theme.spacing(2),
  },
});

class CardCoin extends Component {
  state = {
    redirect: false,
  };

  render() {
    const { classes } = this.props;
    const { redirect } = this.state;

    const setPoolID = () => {
      localStorage.setItem("poolid", this.props.poolid);
      localStorage.setItem("address", "");
      this.setState({ redirect: true });
    };

    if (redirect) {
      return <Redirect to="/stats" />;
    }

    return (
      <div className={classes.root}>
        <CardActionArea onClick={setPoolID}>
          <Card className={classes.paper}>
            <div className={classes.itemContainer}>
              <div className={classes.avatarContainer}>
                <img
                  className={classes.avatar}
                  src={
                    "http://mineit.io/img/coin/icon/" +
                    this.props.ticker.toLowerCase() +
                    ".png"
                  }
                  style={{
                    height: "50px",
                    width: "50px",
                    objectFit: "contain",
                  }}
                  alt=""
                ></img>
              </div>
              <div className={classes.baseline}>
                <div className={classes.inline}>
                  <Typography
                    style={{ textTransform: "uppercase" }}
                    color="secondary"
                    gutterBottom
                  >
                    Coin
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {this.props.coin}
                  </Typography>
                </div>
                <div className={classes.inline}>
                  <Typography
                    style={{ textTransform: "uppercase" }}
                    color="secondary"
                    gutterBottom
                  >
                    Algo
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {this.props.algo}
                  </Typography>
                </div>
                <div className={classes.inline}>
                  <Typography
                    style={{ textTransform: "uppercase" }}
                    color="secondary"
                    gutterBottom
                  >
                    Miners
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {this.props.minercount}
                  </Typography>
                </div>
                <div className={classes.inline}>
                  <Typography
                    style={{ textTransform: "uppercase" }}
                    color="secondary"
                    gutterBottom
                  >
                    Pool Hash
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {this.props.poolhashrate}
                  </Typography>
                </div>
                <div className={classes.inline}>
                  <Typography
                    style={{ textTransform: "uppercase" }}
                    color="secondary"
                    gutterBottom
                  >
                    Fee
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {this.props.fee}
                  </Typography>
                </div>
                <div className={classes.inline}>
                  <Typography
                    style={{ textTransform: "uppercase" }}
                    color="secondary"
                    gutterBottom
                  >
                    Diff
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {this.props.diff}
                  </Typography>
                </div>
              </div>
            </div>
          </Card>
        </CardActionArea>
      </div>
    );
  }
}

export default withStyles(styles)(CardCoin);
