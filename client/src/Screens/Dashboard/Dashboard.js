import { Box, Container, Grid ,Toolbar} from '@mui/material';
import LatestOrders  from '../Transactions/LatestOrders';
import  Sales from './Sales';
import  GoldByAction from './GoldByAction';

const Dashboard = () => (
  <>
    
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <Sales />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <GoldByAction sx={{ height: '100%' }} />
          </Grid>
        </Grid>
  </>
);



export default Dashboard;