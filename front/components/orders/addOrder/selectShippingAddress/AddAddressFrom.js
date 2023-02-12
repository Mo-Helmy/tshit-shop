import { Button, Paper, Stack, TextField } from '@mui/material';
import { useState } from 'react';

const AddAddressFrom = ({ onCancel, onSubmit }) => {
  const [fullname, setFullname] = useState('');
  const [mobile, setMobile] = useState('');
  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');

  const mobileRegex = /^(010|011|012|015)[0-9]{8}$/g;

  const [errorMsg, seterrorMsg] = useState({
    fullname: null,
    mobile: null,
    street: null,
    building: null,
    floor: null,
    city: null,
    area: null,
    landmark: null,
  });

  const submitHandler = () => {
    seterrorMsg({
      fullname: null,
      mobile: null,
      street: null,
      building: null,
      floor: null,
      city: null,
      area: null,
      landmark: null,
    });
    //client validation
    if (!fullname.trim())
      return seterrorMsg((prev) => ({
        ...prev,
        fullname: 'Please add your full name',
      }));

    if (!mobileRegex.test(mobile.trim()))
      return seterrorMsg((prev) => ({
        ...prev,
        mobile:
          'Please add valid mobile number eg. (010|011|012|015)[8 digits]',
      }));

    if (!street.trim())
      return seterrorMsg((prev) => ({
        ...prev,
        street: 'Please add valid street',
      }));

    if (!building.trim())
      return seterrorMsg((prev) => ({
        ...prev,
        building: 'Please add valid building name/no',
      }));

    if (!floor.trim())
      return seterrorMsg((prev) => ({
        ...prev,
        floor: 'Please add valid floor , apartment, or villa no',
      }));

    if (!city.trim())
      return seterrorMsg((prev) => ({
        ...prev,
        city: 'Please add valid city',
      }));

    if (!area.trim())
      return seterrorMsg((prev) => ({
        ...prev,
        area: 'Please add valid area',
      }));

    if (!landmark.trim())
      return seterrorMsg((prev) => ({
        ...prev,
        landmark: 'Please add valid landmark',
      }));

    //sending shipping address to user data
    onSubmit({
      fullname: fullname.trim(),
      mobile: mobile.trim(),
      street: street.trim(),
      building: building.trim(),
      floor: floor.trim(),
      city: city.trim(),
      area: area.trim(),
      landmark: landmark.trim(),
    });
  };

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '90%',
        maxWidth: 600,
        minWidth: 'fit-content',
      }}
    >
      <TextField
        variant="standard"
        label="Full name"
        type="text"
        value={fullname}
        onChange={(e) => setFullname(e.target.value)}
        onBlur={(e) => setFullname(e.target.value.trim())}
        required
        error={errorMsg.fullname}
        helperText={errorMsg.fullname}
      />
      <TextField
        variant="standard"
        label="Mobile"
        type="text"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        onBlur={(e) => setMobile(e.target.value.trim())}
        required
        helperText={errorMsg.mobile}
        error={errorMsg.mobile}
      />
      <TextField
        variant="standard"
        label="Street name"
        type="text"
        value={street}
        onChange={(e) => setStreet(e.target.value)}
        onBlur={(e) => setStreet(e.target.value.trim())}
        required
        helperText={errorMsg.street}
        error={errorMsg.street}
      />
      <TextField
        variant="standard"
        label="Building name/no"
        value={building}
        onChange={(e) => setBuilding(e.target.value)}
        onBlur={(e) => setBuilding(e.target.value.trim())}
        required
        helperText={errorMsg.building}
        error={errorMsg.building}
      />
      <TextField
        variant="standard"
        label="Floor, apartment, or villa no"
        value={floor}
        onChange={(e) => setFloor(e.target.value)}
        onBlur={(e) => setFloor(e.target.value.trim())}
        required
        helperText={errorMsg.floor}
        error={errorMsg.floor}
      />
      <TextField
        variant="standard"
        label="City"
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onBlur={(e) => setCity(e.target.value.trim())}
        required
        helperText={errorMsg.city}
        error={errorMsg.city}
      />
      <TextField
        variant="standard"
        label="Area"
        type="text"
        value={area}
        onChange={(e) => setArea(e.target.value)}
        onBlur={(e) => setArea(e.target.value.trim())}
        required
        helperText={errorMsg.area}
        error={errorMsg.area}
      />
      <TextField
        variant="standard"
        label="Nearest landmark"
        value={landmark}
        onChange={(e) => setLandmark(e.target.value)}
        onBlur={(e) => setLandmark(e.target.value.trim())}
        required
        helperText={errorMsg.landmark}
        error={errorMsg.landmark}
      />

      <Stack direction="row" justifyContent="space-evenly">
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="outlined" onClick={submitHandler}>
          Submit
        </Button>
      </Stack>
    </Paper>
  );
};

export default AddAddressFrom;
