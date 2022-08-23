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
  Typography,
} from "@mui/material";
import { useSnackbar } from "react-simple-snackbar";
import CompanyInterface from "../../Interfaces/CompanyInterface";

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
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const [incentiveConfig, setIncentiveConfig] = useState([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    CompanyInterface.getDetails()
      .then((success) => {
        let details = success?.data?.data?.goldConfig;
        try {
          if (details) {
            setIncentiveConfig(JSON.parse(details));
          } else {
            setIncentiveConfig([blankIncentive]);
          }
        } catch (err) {
          console.log("Could not fetch company details");
        }
      })
      .catch((err) => {});
  }, []);

  const handleChange = (event, index) => {
    let incentiveConfigCopy = [...incentiveConfig];
    if (event.target.name == "action") {
      incentiveConfigCopy[index].action = event.target.value;
    }
    if (event.target.name == "value") {
      incentiveConfigCopy[index].value = event.target.value;
    }
    setIncentiveConfig(incentiveConfigCopy);
  };

  const addBlank = () => {
    setIncentiveConfig([...incentiveConfig, blankIncentive]);
  };

  const removeAt = (index) => {
    let incentiveConfigCopy = [...incentiveConfig];
    incentiveConfigCopy.splice(index, 1);
    setIncentiveConfig(incentiveConfigCopy);
  };

  const submit = () => {
    if (editMode) {
      CompanyInterface.configureDistribution({
        goldConfig: JSON.stringify(incentiveConfig),
      })
        .then((success) => {
          // NotificationService.openNotification(
          //   "Configuration has been updated successfuly",
          //   2000
          // );
          setEditMode(false);
        })
        .catch((err) => {
          console.log("error", err);
        });
    } else {
      setEditMode(true);
    }
  };

  return (
    <form autoComplete="off" noValidate {...props}>
      <Card>
        <CardHeader
          subheader="Configure the distribution of TRBG"
          title="Configure"
          action={
            <Button color="secondary" variant="outlined" onClick={() => {}}>
              Deposit
            </Button>
          }
        ></CardHeader>

        <Divider />
        <CardContent>
          {incentiveConfig.map((item, index) => {
            return (
              <Grid
                container
                spacing={3}
                key={index}
                style={{ marginTop: "10px" }}
              >
                <Grid item md={6} xs={12}>
                  <TextField
                    disabled={!editMode}
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
                    disabled={!editMode}
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
                    disabled={!editMode}
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
                  {index == incentiveConfig.length - 1 ? (
                    <Button
                      color="secondary"
                      variant="outlined"
                      sx={{ width: "100%" }}
                      onClick={() => {
                        addBlank();
                      }}
                      disabled={!editMode}
                    >
                      Add
                    </Button>
                  ) : (
                    <Button
                      color="secondary"
                      variant="outlined"
                      sx={{ width: "100%" }}
                      onClick={() => {
                        removeAt(index);
                      }}
                      disabled={!editMode}
                    >
                      Remove
                    </Button>
                  )}
                </Grid>
              </Grid>
            );
          })}
        </CardContent>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
            gap: 1,
          }}
        >
          {editMode && (
            <Button
              color="secondary"
              variant="contained"
              onClick={() => {
                setEditMode(false);
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              submit();
            }}
          >
            {editMode ? "Update details" : "Edit"}
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default Configure;
