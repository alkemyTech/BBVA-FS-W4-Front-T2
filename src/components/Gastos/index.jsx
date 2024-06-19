import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Tooltip, InputAdornment } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import InfoIcon from '@mui/icons-material/Info';
import './gastos.css';
import { useSelector } from 'react-redux';
import { fetchAccounts } from '../../utils/Accounts';

export default function Gastos() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [form, setForm] = useState({
    destino: '',
    amount: '',
    currency: '',
    description: ''
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const userId = useSelector((state) => state.user.id);
  const token = localStorage.getItem('token');
  const [dialogContent, setDialogContent] = useState({
    title: '',
    message: '',
    icon: null
  });

  useEffect(() => {
    const getAccounts = async () => {
      if (userId) {
        try {
          const fetchedAccounts = await fetchAccounts(userId);
          setAccounts(fetchedAccounts);
        } catch (error) {
          console.error('Failed to fetch accounts:', error);
          setAccounts([]); // Ensure accounts is set to an array on error
        }
      }
    };

    getAccounts();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validar que solo se ingresen números en el campo "amount"
    if (name === 'amount' && !/^\d*$/.test(value)) {
      return; // Si no es un número, no actualizamos el estado
    }

    setForm({
      ...form,
      [name]: name === 'description' ? value.slice(0, 100) : value  // Limitar description a 100 caracteres
    });
  };


  const updateTokenForAccount = async (accountId) => {
    try {
      const response = await fetch(`http://localhost:8080/accounts/select/${accountId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let newToken = response.headers.get('authorization');
      if (newToken && newToken.startsWith('Bearer ')) {
        newToken = newToken.slice(7, newToken.length);
      }
      localStorage.setItem('token', newToken);
      return newToken;
    } catch (error) {
      console.error('Error al actualizar el token:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newToken = await updateTokenForAccount(selectedAccount);
      
      const response = await fetch(`http://localhost:8080/transactions/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${newToken}`
        },
        body: JSON.stringify(form)
      });

      const text = await response.text(); // Get the response text

      if (response.ok) {
        let newToken = response.headers.get('authorization');
        if (newToken && newToken.startsWith('Bearer ')) {
          newToken = newToken.slice(7, newToken.length);
        }
        localStorage.setItem('token', newToken);

        if (text) {
          const data = JSON.parse(text); // Parse the text as JSON
          const message = `
          Fecha del Pago: ${data.fechaPago}
          Moneda: ${data.currency}
          CBU Destino: ${data.destino}
          Monto: $ ${data.amount}
          Descripción: ${data.description || 'N/A'}
          `;

          handleDialogOpen('Pago Exitoso', message, <CheckCircleOutlineIcon sx={{ fontSize: 48, color: 'green' }} />);
        } else {
          handleDialogOpen('Pago Exitoso', 'El pago se ha registrado correctamente, pero no se recibió respuesta del servidor.', <CheckCircleOutlineIcon sx={{ fontSize: 48, color: 'green' }} />);
        }
      } else {
        const data = text ? JSON.parse(text) : { message: 'Error desconocido' }; // Parse the text as JSON if not empty
        handleDialogOpen('Error en la Transacción', data.message, <CancelOutlinedIcon sx={{ fontSize: 48, color: 'red' }} />);
      }
    } catch (error) {
      // Handle general errors
      console.error('Error al registrar el pago:', error);
      handleDialogOpen('Error', 'Ha ocurrido un error al intentar registrar el pago.', <CancelOutlinedIcon sx={{ fontSize: 48, color: 'red' }} />);
    }
  };

  const handleChangeAccount = (e) => {
    const accountId = e.target.value;
    const selected = accounts.find(account => account.id === accountId);
    if (selected) {
      setSelectedAccount(accountId);
      setForm(prevForm => ({
        ...prevForm,
        currency: selected.currency // Actualizar la moneda del formulario
      }));
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
          margin="normal"
          className="custom-textfield"
          inputProps={{
            inputMode: 'numeric',
            pattern: '\\d{22}',
            maxLength: 22,
          }}
        />
        <TextField
          label="Cuenta"
          select
          value={selectedAccount}
          onChange={handleChangeAccount}
          margin="normal"
          className="custom-textfield"
        >
          {accounts.map((account) => (
            <MenuItem key={account.id} value={account.id}>
              {account.cbu} - {account.currency}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          required
          name="amount"
          label="Monto"
          type="text" // Mantenemos type="text"
          value={form.amount}
          className="custom-textfield"
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          inputProps={{
            maxLength: 20,
          }}
        />
         <TextField
          name="description"
          label="Descripción"
          value={form.description}
          onChange={handleChange}
          margin="normal"
          className="custom-textfield description"
          multiline  // Permite múltiples líneas
          rows={1}  // Número inicial de filas
          inputProps={{
            maxLength: 100  // Limitar la cantidad máxima de caracteres
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
          <Typography component="pre">{dialogContent.message}</Typography>
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