import * as React from 'react';
import Grid from '@mui/material/Grid';
import {Typography,TextField} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function AddressForm() {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Company details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            id="companyName"
            name="companyName"
            label="Company name"
            fullWidth
            autoComplete="given-name"
            variant="standard"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            required
            id="jurisdiction"
            name="jurisdiction"
            label="Incorporation Jurisdiction"
            fullWidth
            autoComplete="shipping address-line1"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="website"
            name="website"
            label="Website"
            fullWidth
            autoComplete="shipping address-line2"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="hone"
            name="hone"
            label="Phone"
            fullWidth
            autoComplete="shipping address-level2"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
        <TextField
            id="registration"
            name="registration"
            label="Registration number"
            fullWidth
            autoComplete="shipping address-line2"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={12}>
        <TextField
            id="address"
            name="address"
            label="Company address"
            fullWidth
            autoComplete="shipping address-line2"
            variant="standard"
          />
        </Grid>
       
       
      </Grid>
    </React.Fragment>
  );
}