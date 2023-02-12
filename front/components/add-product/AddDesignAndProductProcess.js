import { Stack, Step, StepLabel, Stepper } from '@mui/material';
import React, { useState } from 'react';
import AddProductForm from './AddProductForm';
import DesignList from './DesignList';

const steps = ['Select Design', 'Add New Product'];

const AddDesignAndProductProcess = ({ session, token, designsList }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [design, setDesign] = useState(null);

  const completeSelectDesign = (design) => {
    setDesign(design);
    setActiveStep(1);
  };

  console.log({ design });
  return (
    <Stack spacing={2} mt={3}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((stepTitle) => (
          <Step key={stepTitle}>
            <StepLabel>{stepTitle}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <DesignList
          onCompleteSelectDesign={completeSelectDesign}
          session={session}
          token={token}
          designsList={designsList}
        />
      )}

      {activeStep === 1 && (
        <AddProductForm
          design={design}
          onBackHandler={() => setActiveStep(0)}
          session={session}
          token={token}
        />
      )}
    </Stack>
  );
};

export default AddDesignAndProductProcess;
