import { useState, useEffect } from "react";
import _ from 'lodash';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Toolbar,
  Container,
} from "@mui/material";
import { useSnackbar } from "react-simple-snackbar";
import CompanyInterface from "../../Interfaces/CompanyInterface";

const Configure = (props) => {
  const [values, setValues] = useState({});
  const [company, setCompany] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
    console.log(values);
  };

  const saveDetails = () => {
    if(editMode){
      CompanyInterface.updateDetails({ details: values, status:"VERIFIED" })
        .then((success) => {
          let details = success?.data?.data?.details || {}
          try{
            setCompany(success?.data?.data)
            setValues(details)
            setEditMode(false)
          }
          catch(err){
            console.log("Could not fetch company details")
          }
        })
        .catch((error) => {});
    }
  };

  useEffect(() => {
    CompanyInterface.getDetails().then(success =>{
      let details = success?.data?.data?.details || {}
      try{
        if(_.isEmpty(details)){
          setEditMode(true)
        }
        setCompany(success?.data?.data)
        setValues(details)
      }
      catch(err){
        console.log("Could not fetch company details")
      }
    }).catch(err =>{

    })
  },[]);

  return (
   
        <form autoComplete="off" noValidate {...props}>
          <Card>
            <CardHeader
              subheader="The information cannot be edited"
              title="Account"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    disabled
                    fullWidth
                    helperText="Please specify the first name"
                    label="Company name"
                    name="companyName"
                    required
                    value={company.companyName || ''}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    disabled={!editMode}
                    fullWidth
                    label="Incorporation Jurisdiction"
                    name="Jurisdiction"
                    onChange={handleChange}
                    required
                    value={values.Jurisdiction || ''}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    disabled={!editMode}
                    fullWidth
                    label="Company Registration Number"
                    name="registration"
                    onChange={handleChange}
                    required
                    value={values.registration || ''}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    disabled={!editMode}
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    onChange={handleChange}
                    type="number"
                    value={values.phone || ''}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    disabled={!editMode}
                    fullWidth
                    label="Address"
                    name="address"
                    onChange={handleChange}
                    required
                    value={values.address || ''}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    disabled={!editMode}
                    fullWidth
                    label="Website"
                    name="website"
                    onChange={handleChange}
                    required
                    value={values.website || ''}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    disabled={!editMode}
                    fullWidth
                    label="LinkedIn"
                    name="linkedIn"
                    onChange={handleChange}
                    required
                    value={values.linkedIn || ''}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    disabled={!editMode}
                    fullWidth
                    label="Ideatribe Hash"
                    name="billethash"
                    onChange={handleChange}
                    required
                    value={values.billethash || ''}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            {company.status == "REGISTERED" &&<Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  p: 2,
                  gap:1
                }}
              >
                {/* {editMode && <Button color="secondary" variant="contained" onClick={() =>{
                  setEditMode(false)
                }}>
                  Cancel
                </Button>} */}
                <Button color="secondary" variant="contained" onClick={() =>{
                  saveDetails()
                }}>
                  {editMode ? "Update details" : "Edit"}
                </Button>
            </Box>}
          </Card>
        </form>
  );
};

export default Configure;
