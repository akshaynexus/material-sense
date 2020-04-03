import React from 'react';
import ResponsiveContainer from 'recharts/lib/component/ResponsiveContainer';
import {
  LineChart, Line, XAxis, Tooltip
} from 'recharts';
import { withTheme } from '@material-ui/styles';

function SimpleLineChart(props) {
  const { theme, data } = props;
  return (
    <ResponsiveContainer width="99%" height={225}>
      <LineChart data={data}>
        <XAxis dataKey="name"/>
        <Tooltip/>
        <Line dataKey="Type" stackId="a" fill={theme.palette.primary.main} />
        <Line dataKey="OtherType" stackId="a" fill={theme.palette.secondary.light} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default withTheme(SimpleLineChart);