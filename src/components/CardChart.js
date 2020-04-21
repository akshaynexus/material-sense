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

const CardChart = ({ data, CardSubtitle, CardLateststat }) => {
  const classes = useStyles();
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
                  <YAxis />
                  <Tooltip
                    contentStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    labelStyle={{ fontWeight: "bold", color: "#666666" }}
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
