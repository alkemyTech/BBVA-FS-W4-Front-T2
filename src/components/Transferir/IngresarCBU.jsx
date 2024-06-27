import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const IngresarCBU = ({ cbu, handleCBUChange, handleNext, handleBack, error }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [popupError, setPopupError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSaveClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName('');
    setPopupError('');
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSaveContact = async () => {
    if (!name) {
      setPopupError('El nombre es requerido');
      return;
    }

    const newContact = { name, cbu };
    const token = localStorage.getItem('token'); 
    try {
      const response = await fetch('http://localhost:8080/newContact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newContact),
      });

      if (response.ok) {
        setSuccessMessage('Contacto agregado con éxito'); // Mostrar mensaje de éxito
        handleClose(); // Cerrar el diálogo
      } else {
        throw new Error('Error al guardar el contacto');
      }
    } catch (error) {
      setPopupError(error.message);
    }
  };

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
          justifyContent: 'flex-end', // Alinea los botones a la derecha
          gap: 1, // Espacio entre los botones
        }}
      >
        <Button variant="contained" onClick={handleBack}>
          Atrás
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveClick}
        >
          Guardar nuevo contacto
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginLeft: 'auto' }} // Centra este botón al final
          onClick={handleNext}
        >
          SIGUIENTE
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Guardar Contacto</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            variant="outlined"
            fullWidth
            value={name}
            onChange={handleNameChange}
          />
          {popupError && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {popupError}
            </Typography>
          )}
          {successMessage && (
            <Typography color="primary" variant="body2" sx={{ mt: 1 }}>
              {successMessage}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSaveContact} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IngresarCBU;
