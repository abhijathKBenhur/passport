import * as React from 'react';
import {useContext} from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {UserContext} from "../../contexts/UserContext"

const steps = ['Use access token', 'Create payload', 'Make requests'];

export default function StepperMenu(props) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const {company} = useContext(UserContext)

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };


  const handleNext = () => {
    let newSkipped = skipped;
    if (activeStep === steps.length -1) {
      setActiveStep(0);
      props.closeCallbback()
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };


  const handleReset = () => {
    setActiveStep(0);
  };

  const getStepContent = (index) =>{
    switch(index){
      case 0:
        return <Typography variant="overline" style={{ marginLeft:"15px", lineBreak: "anywhere"}} mt={2}>
           <br/>
          Copy User access token : {sessionStorage.getItem("PASSPORT_TOKEN")}
        </Typography>
        break;
      case 1:
        return <Typography mt={2} variant="overline" style={{ marginLeft:"15px"}}>
         <div>Build a request in the following structure <br/></div>
         <div style={{marginLeft:"10px"
        }}>
         action: [sign-up,sign-in,download-app,fill-profile,share-Phone-number,refer-contact,attend-events,help-community,buy-product,review-product,buy-above-value]<br/>
         email: [user-email-address]<br/>
         token: [token copied]<br/>
         </div>
    </Typography>
        break;
      case 2:
        return <Typography variant="overline" mt={2} style={{ marginLeft:"15px"}}>
          
          <div>Make the request to https://www.ideatribe.io/api/customer/incentivise </div><br/>
          <div style={{marginLeft:"10px"
        }}>
          Sample CURL : 
          curl -d '"sign-up", token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....",email:"testuser@gmail.com"' 'https://www.ideatribe.io/api/customer/incentivise'
          </div>
        </Typography>
        break;
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps= {};
          const labelProps = {};
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <React.Fragment>
          <div style={{marginLeft:"30px"}}>{getStepContent(activeStep)}</div>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
          
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
    </Box>
  );
}