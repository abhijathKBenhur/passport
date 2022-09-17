import { Doughnut } from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js'
import { Box, Card, CardContent, CardHeader, Divider, Typography, useTheme } from '@mui/material';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import PhoneIcon from '@mui/icons-material/Phone';
import TabletIcon from '@mui/icons-material/Tablet';
import _ from"lodash";

Chart.register(ArcElement);

 const GoldByAction = (props) => {
  const theme = useTheme();

  const data = {
    datasets: [
      {
        data: _.map(props.transactions,'amount'),
        backgroundColor: ['#3F51B5', '#e53935', '#FB8C00'],
        borderWidth: 8,
        borderColor: '#FFFFFF',
        hoverBorderColor: '#FFFFFF'
      }
    ],
    labels: _.map(props.transactions,'action')
  };

  const options = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  const devices = _.map(props.transactions,
    function(item) {
      return {
        title : item.action,
        value:item.amount,
      }
    })



    const devicesMap = [
    {
      title: 'Milestone',
      value: 63,
      icon: LaptopMacIcon,
    },
    {
      title: 'Refferal',
      value: 15,
      icon: TabletIcon,
    },
    {
      title: 'Sign up',
      value: 23,
      icon: PhoneIcon,
    }
  ];

  return (
    <Card {...props}>
      <CardHeader title="TRBG by actions" />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 300,
            position: 'relative'
          }}
        >
          <Doughnut
            data={data}
            options={options}
          />
        </Box>
         
      </CardContent>
    </Card>
  );
};

export default GoldByAction