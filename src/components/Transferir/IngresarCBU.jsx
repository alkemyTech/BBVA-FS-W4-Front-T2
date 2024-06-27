import React from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const IngresarCBU = ({ cbu, handleCBUChange, handleNext, handleBack, error }) => {
  return (
    <Box>
      <TextField
        label="Ingresar CBU"
        variant="outlined"
        fullWidth
        value={cbu}
        onChange={handleCBUChange}
        inputProps={{ maxLength: 22 }}
      />
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button variant="contained" onClick={handleBack}>
          Atrás
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
        >
          Siguiente
        </Button>
      </Box>
    </Box>
  );
};

export default IngresarCBU;
