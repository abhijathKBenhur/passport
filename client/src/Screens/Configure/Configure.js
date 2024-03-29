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
  Select,
  MenuItem,
  Modal,
} from "@mui/material";
import { useSnackbar } from "react-simple-snackbar";
import _ from "lodash";
import CompanyInterface from "../../Interfaces/CompanyInterface";
import StepperMenu from "./StepperMenu.js";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  height:"350px",
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const states = [
  {
    value: "sign-up",
    label: "Sign up",
  },
  {
    value: "sign-in",
    label: "Sign in",
  },
  {
    value: "download-app",
    label: "App download",
  },
  {
    value: "fill-profile",
    label: "Fill profile",
  },
  {
    value: "share-Phone-number",
    label: "Share phone number",
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
    value: "buy-above-value",
    label: "Buy above value",
  },
];

const Configure = (props) => {
  const blankIncentive = {
    action: "sign-up",
    value: "",
    frequency: "once",
  };
  const [incentiveConfig, setIncentiveConfig] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showStepper, setShowStepper] = useState(false);
  const [errorMap, setErrorMap] = useState({});

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
    if (event.target.name == "frequency") {
      incentiveConfigCopy[index].frequency = event.target.value;
    }
    if (event.target.name == "NValue") {
      incentiveConfigCopy[index].NValue = event.target.value;
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
      let validatedMap = _.map(incentiveConfig, (item) => {
        return {
          valueError: item.value == 0,
          NValueError: item.frequency == "n" && item.NValue < 2,
        };
      });
      let isFormValid =
        !_.find(validatedMap, { NValueError: true }) &&
        !_.find(validatedMap, { valueError: true });
      setErrorMap(validatedMap);
      if (isFormValid) {
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
      }
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
          // action={
          //   <Button color="secondary" variant="outlined" onClick={() => {}}>
          //     Deposit
          //   </Button>
          // }
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
                <Grid item md={4} xs={12}>
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
                <Grid item md={3} xs={3}>
                  <TextField
                    type="number"
                    error={_.get(errorMap[index], "valueError")}
                    helperText={
                      _.get(errorMap[index], "valueError")
                        ? "Minimum value should be 1 TRBG"
                        : ""
                    }
                    disabled={!editMode}
                    fullWidth
                    label="Gold to share"
                    name="value"
                    onChange={(e) => handleChange(e, index)}
                    required
                    value={item.value}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={3}
                  xs={3}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-center",
                    gap: "10px",
                  }}
                >
                  <Select
                    value={item.frequency}
                    label="Nth time"
                    fullWidth
                    disabled={!editMode}
                    name="frequency"
                    onChange={(e) => handleChange(e, index)}
                  >
                    <MenuItem value={"once"}>Once</MenuItem>
                    <MenuItem value={"always"}>Always</MenuItem>
                    <MenuItem value={"n"}>Nth time</MenuItem>
                  </Select>
                  {item.frequency == "n" && (
                    <TextField
                      disabled={!editMode}
                      helperText={
                        _.get(errorMap[index], "NValueError")
                          ? "Must be above 1"
                          : ""
                      }
                      error={_.get(errorMap[index], "NValueError")}
                      fullWidth
                      label="N value"
                      type="number"
                      name="NValue"
                      onChange={(e) => handleChange(e, index)}
                      required
                      value={item.NValue}
                      variant="outlined"
                    />
                  )}
                </Grid>
                <Grid
                  md={2}
                  xs={2}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-center",
                    padding: "auto",
                  }}
                  item
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
            justifyContent: "space-between",
            p: 2,
            gap: 1,
          }}
        >
          <Button
            color="secondary"
            variant="text"
            onClick={() => {
              setShowStepper(true);
            }}
          >
            How to integrate API
          </Button>
          <div>
            {editMode && (
              <Button
                color="secondary"
                variant="contained"
                onClick={() => {
                  setEditMode(false);
                }}
                style={{ marginRight: "10px" }}
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
          </div>
        </Box>
      </Card>
      <Modal 
        open={showStepper}
        onClose={() => {setShowStepper(false)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box  sx={style} >
          <StepperMenu closeCallbback={() =>{
            setShowStepper(false)
          }}></StepperMenu>
        </Box>
      </Modal>
    </form>
  );
};

export default Configure;
