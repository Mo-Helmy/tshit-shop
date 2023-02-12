import {
  Autocomplete,
  Box,
  Button,
  FormHelperText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { snackbarActions } from '../../store/snackbarSlice';
import { apiUrl } from '../../util/link-config';
import axiosInstance from '../../util/axiosInstance';

const AddDesignForm = ({ session, token }) => {
  const [designsUrl, setDesignsUrl] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [format, setFormat] = useState('');
  const [selctedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [error, setError] = useState({
    format: '',
    designs: '',
    tags: '',
  });

  const [disabledUplaod, setDisabledUplaod] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    axiosInstance
      .get('/api/media/design/tags')
      .then((res) => setAllTags(res.data))
      .catch((err) => console.log(err));
  }, []);

  const designHandler = (e) => {
    setDesigns([]);
    setDesignsUrl([]);

    setError((prev) => ({
      ...prev,
      designs: '',
    }));

    if (e.target.files.length === 0) {
      setError((prev) => ({
        ...prev,
        designs: 'please select at least one design',
      }));
      return;
    }

    if (e.target.files.length > 10) {
      setError((prev) => ({
        ...prev,
        designs: 'max files to select is 10 files',
      }));
      return;
    }

    let invalidImageNames = [];

    Object.keys(e.target.files).map(
      (key) =>
        (e.target.files[key].type !== 'image/png' ||
          e.target.files[key].size > 2000000) &&
        invalidImageNames.push(e.target.files[key].name)
    );

    if (invalidImageNames.length > 0) {
      setError((prev) => ({
        ...prev,
        designs: `${invalidImageNames.join(',')} is not valid`,
      }));
      return;
    }

    Object.keys(e.target.files).map((key) => {
      const reader = new FileReader();

      reader.readAsDataURL(e.target.files[key]);

      reader.onload = (e) =>
        setDesignsUrl((prev) => prev.concat(e.target.result));
    });

    setDesigns(e.target.files);
  };

  const uploadHandler = () => {
    if (error.designs) return;
    if (!format) {
      setError((prev) => ({ ...prev, format: 'please select a valid format' }));
      return;
    }
    if (designs.length === 0) {
      setError((prev) => ({
        ...prev,
        designs: 'please select at least one design',
      }));
      return;
    }
    if (selctedTags.length === 0) {
      setError((prev) => ({
        ...prev,
        tags: 'please select at least one tag',
      }));
      return;
    }

    const fd = new FormData();

    fd.append('format', format);
    fd.append('userId', session.id);

    selctedTags.map((tag) => {
      fd.append('tags', tag.trim());
    });

    Object.keys(designs).map((key) => {
      fd.append('designs', designs[key]);
    });

    setDisabledUplaod(true);
    axiosInstance
      .post(apiUrl + '/api/media/add-design', fd)
      .then((res) => {
        dispatch(
          snackbarActions.openSnackbar({
            severity: 'success',
            message: 'Design Uploaded Successfully',
          })
        );

        setDesigns([]);
        setDesignsUrl([]);
        setFormat('');
        setSelectedTags([]);
        setDisabledUplaod(false);
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          snackbarActions.openSnackbar({
            severity: 'error',
            message: 'Upload Failed',
          })
        );
        setDisabledUplaod(false);
      });
  };

  return (
    <Stack
      alignItems="center"
      py={4}
      spacing={2}
      direction="column"
      width={{ xs: '100%', md: '60%' }}
      mx="auto"
    >
      <Typography variant="h5">Add New Design</Typography>

      <FormHelperText>
        All designs sholud be png files with transparent background and less
        than 2MB size
      </FormHelperText>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        gap={2}
        justifyContent="center"
        alignItems="center"
      >
        <TextField
          select
          label="Select Format"
          value={format}
          onChange={(e) => {
            setFormat(e.target.value);
            setError((prev) => ({ ...prev, format: '' }));
          }}
          style={{ width: '250px' }}
          required
          error={Boolean(error.format)}
          helperText={error.format ? error.format : 'Required'}
        >
          <MenuItem value="full">Full Width</MenuItem>
          <MenuItem value="logo">Logo</MenuItem>
        </TextField>

        <Button variant="contained" component="label">
          Select Design{' '}
          <input
            type="file"
            accept="image/png"
            hidden
            onChange={designHandler}
            multiple={true}
          />
        </Button>
      </Stack>

      <Box>
        <Autocomplete
          options={allTags}
          value={selctedTags}
          onChange={(e, n) => {
            if (n) setSelectedTags(n);
            setError((prev) => ({ ...prev, tags: '' }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tags"
              sx={{ minWidth: 250, maxWidth: '100%' }}
              required
              error={Boolean(error.tags)}
              helperText={error.tags ? error.tags : 'Required'}
            />
          )}
          multiple
          freeSolo
        />
      </Box>

      {designsUrl.length > 0 && (
        <Stack direction="row" gap={2} flexWrap="wrap" justifyContent="center">
          {designsUrl.map((designUrl) => (
            <Image
              key={designUrl}
              src={designUrl}
              alt=""
              width={200}
              height={200}
            />
          ))}
        </Stack>
      )}

      {(Boolean(error.format) ||
        Boolean(error.designs) ||
        Boolean(error.tags)) && (
        <FormHelperText
          error={
            Boolean(error.format) ||
            Boolean(error.designs) ||
            Boolean(error.tags)
          }
        >
          {error.format && error.format + '\n'}
          {error.designs && error.designs + '\n'}
          {error.tags && error.tags}
        </FormHelperText>
      )}

      <Button
        variant="contained"
        onClick={uploadHandler}
        disabled={disabledUplaod}
      >
        Upload
      </Button>
    </Stack>
  );
};

export default AddDesignForm;
