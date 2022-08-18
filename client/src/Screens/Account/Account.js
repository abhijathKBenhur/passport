import { useState, useEffect } from "react";
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
      let detailsString = JSON.stringify(values);
      CompanyInterface.updateDetails({ details: detailsString })
        .then((success) => {
          debugger;
        })
        .catch((error) => {});
    }else{
      setEditMode(true)
    }
  };

  useEffect(() => {
    CompanyInterface.getDetails().then(success =>{
      let details = success?.data?.data?.details
      try{
        setValues(JSON.parse(details))
      }
      catch(err){
        console.log("Could not fetch company details")
      }
    }).catch(err =>{

    })
  },[]);

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light" ? "#F9FAFC" : theme.palette.grey[900],
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Container maxWidth="" sx={{ mt: 4, mb: 4 }}>
        <form autoComplete="off" noValidate {...props}>
          <Card>
            <CardHeader
              subheader="The information can be edited"
              title="Account"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    disabled={!editMode}
                    fullWidth
                    helperText="Please specify the first name"
                    label="Company name"
                    name="companyName"
                    onChange={handleChange}
                    required
                    value={values.companyName || ''}
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
            <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  p: 2,
                  gap:1
                }}
              >
                {editMode && <Button color="secondary" variant="contained" onClick={() =>{
                  setEditMode(false)
                }}>
                  Cancel
                </Button>}
                <Button color="secondary" variant="contained" onClick={() =>{
                  saveDetails()
                }}>
                  {editMode ? "Update details" : "Edit"}
                </Button>
            </Box>
          </Card>
        </form>
      </Container>
    </Box>
  );
};

export default Configure;
