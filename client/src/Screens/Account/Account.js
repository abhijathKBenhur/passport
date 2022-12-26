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
  const [errorMap, setErrorMap] = useState({
  });
  const [company, setCompany] = useState({});
  const [editMode, setEditMode] = useState(true);
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
    setErrorMap({
      ...errorMap,
      [event.target.name]: _.isEmpty(event.target.value),
    });

    console.log(values);
  };

  const saveDetails = () => {
    let localErrorMap = {...errorMap}
    if(_.isEmpty(localErrorMap)){
      localErrorMap = {
        Jurisdiction:true,
        registration:true,
        address:true,
        website:true,
        linkedIn:true,
        phone:true,
        billethash:true
      }
      setErrorMap(localErrorMap)
    }
    if(editMode){
      let formHasError = _.reduce(Object.values(localErrorMap), function(hasError, n) {
        return hasError || n;
      }, false);
      if(!formHasError){
        CompanyInterface.updateDetails({ details: values, status:"SUBMITTED" })
        .then((success) => {
          let details = success?.data?.data?.details || {}
          try{
            setCompany(success?.data?.data)
            setValues(details)
            setEditMode(false)
            openSnackbar(
              "Company details has been submitted for verification. Please wait while you hear from us on the approval status.",
              5000
            );
          }
          catch(err){
            console.log("Could not fetch company details")
          }

        })
        .catch((error) => {});
      }
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
                    error={errorMap.companyName}
                    helperText={ errorMap.companyName ? "This field is mandatory" : "" }
                    fullWidth
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
                    error={errorMap.Jurisdiction}
                    helperText={ errorMap.Jurisdiction ? "This field is mandatory" : "" }
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
                    error={errorMap.registration}
                    helperText={ errorMap.registration ? "This field is mandatory" : "" }
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
                    error={errorMap.phone}
                    helperText={ errorMap.phone ? "This field is mandatory" : "" }
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
                    error={errorMap.address}
                    helperText={ errorMap.address ? "This field is mandatory" : "" }
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
                    error={errorMap.website}
                    helperText={ errorMap.website ? "This field is mandatory" : "" }
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
                    error={errorMap.linkedIn}
                    helperText={ errorMap.linkedIn ? "This field is mandatory" : "" }
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
                    error={errorMap.billethash}
                    helperText={ errorMap.billethash ? "This field is mandatory" : "" }
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
