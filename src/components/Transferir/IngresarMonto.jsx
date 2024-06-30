import React from 'react';
import { Box, TextField, Button, InputAdornment, Typography } from '@mui/material';

const IngresarMonto = ({ amount, handleAmountChange, handleNext, handleBack, error }) => {
  return (
    <Box>
      <TextField
        label="Ingresar Monto"
        variant="outlined"
        fullWidth
        value={amount}
        onChange={handleAmountChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">$</InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#1565c0',
            },
            '&:hover fieldset': {
              borderColor: '#1565c0',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1565c0',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#1565c0',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#1565c0',
          },
        }}
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
        <Button  onClick={handleBack}>
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

export default IngresarMonto;
