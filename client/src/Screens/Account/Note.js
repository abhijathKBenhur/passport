import * as React from 'react';
import {Typography,TextField} from '@mui/material';
import List from '@mui/material/List';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';

const products = [
  {
    name: 'Product 1',
    desc: 'A nice thing',
    price: '$9.99',
  },
  {
    name: 'Product 2',
    desc: 'Another thing',
    price: '$3.45',
  },
  {
    name: 'Product 3',
    desc: 'Something else',
    price: '$6.51',
  },
  {
    name: 'Product 4',
    desc: 'Best thing of all',
    price: '$14.11',
  },
  { name: 'Shipping', desc: '', price: 'Free' },
];


export default function Note() {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        A note to the passport
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <TextField
            multiline
            required
            id="note"
            name="note"
            label="A note to the tribe"
            fullWidth
            autoComplete="given-name"
            variant="standard"
            rows={6}
          />
        </Grid>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="saveAddress" value="yes" />}
            label="Use this address for payment details"
          />
        </Grid>
    </React.Fragment>
  );
}