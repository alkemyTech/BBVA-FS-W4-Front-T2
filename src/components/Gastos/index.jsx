import React, { useState } from 'react';
import { TextField, Button, Box, MenuItem, FormControl, Select, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Tooltip, InputAdornment } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import InfoIcon from '@mui/icons-material/Info';
import './gastos.css';

export default function Gastos() {
  const [form, setForm] = useState({
    destino: '',
    amount: '',
    currency: '',
    description: ''
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const token = localStorage.getItem('token');
  const [dialogContent, setDialogContent] = useState({
    title: '',
    message: '',
    icon: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'description' ? value.slice(0, 100) : value  // Limitar description a 100 caracteres
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Suponiendo que tienes el token almacenado en algún lugar
        },
        body: JSON.stringify(form)
      });
  
      const text = await response.text(); // Obtener el texto de la respuesta
  
      if (response.ok) {
        if (text) {
          const data = JSON.parse(text); // Analizar el texto como JSON
          handleDialogOpen('Pago Exitoso', 'El pago se ha registrado correctamente.', <CheckCircleOutlineIcon sx={{ fontSize: 48, color: 'green' }} />);
        } else {
          handleDialogOpen('Pago Exitoso', 'El pago se ha registrado correctamente, pero no se recibió respuesta del servidor.', <CheckCircleOutlineIcon sx={{ fontSize: 48, color: 'green' }} />);
        }
      } else {
        const data = text ? JSON.parse(text) : { message: 'Error desconocido' }; // Analizar el texto como JSON si no está vacío
        handleDialogOpen('Error en la Transacción', data.message, <CancelOutlinedIcon sx={{ fontSize: 48, color: 'red' }} />);
      }
    } catch (error) {
      // Manejar errores generales
      console.error('Error al registrar el pago:', error);
      handleDialogOpen('Error', 'Ha ocurrido un error al intentar registrar el pago.', <CancelOutlinedIcon sx={{ fontSize: 48, color: 'red' }} />);
    }
  };

  const handleDialogOpen = (title, message, icon) => {
    setDialogContent({
      title,
      message,
      icon
    });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <section className="box-principal-gastos">
      <p className="titulo-gastos">Registrar Pago</p>
      <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" className="box-gastos">
        <TextField
          required
          name="destino"
          label="CBU Destino"
          value={form.destino}
          onChange={handleChange}
          fullWidth
          margin="normal"
          className="custom-textfield"
          inputProps={{
            inputMode: 'numeric',
            pattern: '\\d{22}',
            maxLength: 22,
          }}
        />
        <TextField
          required
          name="amount"
          label="Monto"
          type="text"
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          value={form.amount}
          onChange={handleChange}
          fullWidth
          margin="normal"
          className="custom-textfield"
        />
        <FormControl fullWidth margin="normal" className="custom-formcontrol">
          <InputLabel>Moneda</InputLabel>
          <Select
            required
            label="Monto"
            name="currency"
            value={form.currency}
            onChange={handleChange}
          >
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="ARS">ARS</MenuItem>
          </Select>
        </FormControl>
        <TextField
          name="description"
          label="Descripción"
          value={form.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          className="custom-textfield"
          inputProps={{
            maxLength: 100  // Limitar la cantidad máxima de caracteres
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Máximo 100 caracteres" placement="top">
                  <InfoIcon fontSize="small" color="primary" />
                </Tooltip>
              </InputAdornment>
            )
          }}
        />
        <Button variant="contained" color="primary" type="submit" className="button-registrar">
          Registrar
        </Button>
      </Box>

      {/* Dialog para mostrar la confirmación o el error */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{dialogContent.icon}</DialogTitle>
        <DialogContent>
          <Typography variant="h6">{dialogContent.title}</Typography>
          <Typography>{dialogContent.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}
