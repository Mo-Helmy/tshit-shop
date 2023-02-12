import { Stack, Step, StepLabel, Stepper } from '@mui/material';
import { useState } from 'react';
import ConfirmOrderDetails from './ConfirmOrderDetails';
import ShippingAddress from './selectShippingAddress/ShippingAddress';

const steps = ['Select Shipping Address', 'Confirm Order Details'];

const AddOrderProcess = ({ session, userAddresses }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  console.log(
    '🚀 ~ file: AddOrderProcess.js:11 ~ AddOrderProcess ~ selectedAddress',
    selectedAddress
  );

  const selectAddressHandler = (address) => {
    setActiveStep(1);
    setSelectedAddress(address);
  };

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
        <ShippingAddress
          onSelectAddress={selectAddressHandler}
          userAddresses={userAddresses}
          session={session}
        />
      )}
      {activeStep === 1 && (
        <ConfirmOrderDetails
          onBack={() => setActiveStep(0)}
          selectedAddress={selectedAddress}
          session={session}
        />
      )}
    </Stack>
  );
};

export default AddOrderProcess;
