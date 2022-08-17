import { useState } from "react";
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
  Typography,
} from "@mui/material";

const states = [
  {
    value: "sign-up",
    label: "Sign up",
  },
  {
    value: "Sign-in",
    label: "Sign in",
  },
  {
    value: "Download-app",
    label: "App download",
  },
  {
    value: "fill-profile",
    label: "Fill profile",
  },
  {
    value: "Share-Phone-number",
    label: "Share phone number",
  },
  {
    value: "share-content",
    label: "Share Content",
  },
  {
    value: "like-content",
    label: "Like content",
  },
  {
    value: "upload-content",
    label: "Upload contacts",
  },
  {
    value: "refer-contact",
    label: "Referral sign up",
  },
  {
    value: "attend-events",
    label: "Attend events",
  },
  {
    value: "help-community",
    label: "Help Community",
  },
  {
    value: "buy-product",
    label: "Buy product",
  },
  {
    value: "review-product",
    label: "Review product",
  },
  {
    value: "but-above-value",
    label: "Buy above value",
  },
];

const Configure = (props) => {
  const blankIncentive = {
    action: "sign-up",
    value: "",
  };

  const [incentiveConfig, setIncentiveConfig] = useState([
    {
      action: "sign-up",
      value: "",
    }
  ])

  const handleChange = (event, index) => {
    let incentiveConfigCopy = [...incentiveConfig]
    if(event.target.name == "action"){
      incentiveConfigCopy[index].action = event.target.value
    }
    if(event.target.name == "value"){
      incentiveConfigCopy[index].value = event.target.value
    }
    setIncentiveConfig(incentiveConfigCopy)
  };

  const addBlank = () =>{
    setIncentiveConfig([...incentiveConfig,blankIncentive])
  }

  const removeAt = (index) =>{
    let incentiveConfigCopy = [...incentiveConfig]
    incentiveConfigCopy.splice(index, 1);
    setIncentiveConfig(incentiveConfigCopy)
  }

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
              subheader="Configure the distribution of TRBG"
              title="Configure"
            />
            <Divider />
            <CardContent>

            {incentiveConfig.map((item, index) => {
              return (
                  <Grid container spacing={3}>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label="Select action"
                        name="action"
                        onChange={(e) => handleChange(e, index)}
                        required
                        select
                        SelectProps={{ native: true }}
                        value={item.action}
                        variant="outlined"
                      >
                        {states.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item md={2} xs={2}>
                      <TextField
                        fullWidth
                        label="value"
                        name="value"
                        onChange={(e) => handleChange(e, index)}
                        required
                        value={item.value}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={2} xs={2}>
                      <TextField
                        fullWidth
                        disabled
                        label="value"
                        name="value"
                        onChange={(e) => handleChange(e, index)}
                        required
                        value={item.goldValue}
                        variant="outlined"
                      ></TextField>
                    </Grid>
                    <Grid
                      sx={{
                        display: "flex",
                        justifyContent: "flex-center",
                        padding: "auto",
                      }}
                      item
                      md={2}
                      xs={2}
                    >
                      {" "}
                      { index == incentiveConfig.length -1 ? <Button color="primary" variant="outlined" sx={{width:"100%"}} onClick={()=> {
                        addBlank()
                      }}>
                        Add
                      </Button>
                    : <Button color="primary" variant="outlined" sx={{width:"100%"}} onClick={()=> {
                      removeAt(index)
                    }}>
                    Remove
                  </Button>
                    }
                    </Grid>
                  </Grid>
              );
            })}
                </CardContent>


            <Divider />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                p: 2,
              }}
            >
              <Button color="primary" variant="contained">
                Save details
              </Button>
            </Box>
          </Card>
        </form>
      </Container>
    </Box>
  );
};

export default Configure;
