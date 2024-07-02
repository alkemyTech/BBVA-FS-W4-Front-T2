import React, { useState } from 'react';
import { TextField, Button, Box, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Tooltip } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import './gastos.css';
import fondoGastos from '../../assets/fondoGastos.svg';
import Bubble from "../Calculadora"

export default function Gastos() {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [form, setForm] = useState({
    destino: '',
    amount: '',
    currency: '',
    description: ''
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const userId = useSelector((state) => state.user.id);
  const accounts = useSelector((state) => state.account.accounts);
  const token = localStorage.getItem('token');
  const [dialogContent, setDialogContent] = useState({
    title: '',
    message: '',
    icon: null
  });
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'amount') {
      return;
    }

    setForm({
      ...form,
      [name]: name === 'description' ? value.slice(0, 100) : value
    });
    setErrors({
      ...errors,
      [name]: ''
    });
  };

  const handleAmountChange = (values) => {
    const { formattedValue, value } = values;
    setForm({
      ...form,
      amount: value
    });
    setErrors({
      ...errors,
      amount: ''
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.amount) {
      newErrors.amount = 'El monto no puede estar vacío.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setLoading(false);
      return;
    }

    const cleanedAmount = parseFloat(form.amount.replace(/\./g, '').replace(',', '.'));

    try {
      const newToken = await updateTokenForAccount(selectedAccount);

      const response = await fetch(`http://localhost:8080/transactions/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${newToken}`
        },
        body: JSON.stringify({ ...form, amount: cleanedAmount })
      });

      const text = await response.text();

      if (response.ok) {
        let updatedToken = response.headers.get('authorization');
        if (updatedToken && updatedToken.startsWith('Bearer ')) {
          updatedToken = updatedToken.slice(7);
          localStorage.setItem('token', updatedToken);
        }

        if (text) {
          const data = JSON.parse(text);
          const message =
            `     Fecha del Pago: ${data.fechaPago} 
            Moneda: ${data.currency} 
            CBU destino: ${data.destino} 
            Monto: $${cleanedAmount} 
            Descripción: ${data.description}`;

          handleDialogOpen('Pago Exitoso', message, <CheckCircleOutlineIcon sx={{ fontSize: 48, color: 'green' }} />);
        } else {
          handleDialogOpen('Pago Exitoso', 'El pago se ha registrado correctamente, pero no se recibió respuesta del servidor.', <CheckCircleOutlineIcon sx={{ fontSize: 48, color: 'green' }} />);
        }
      } else if (response.status === 500) {
        handleDialogOpen('Error', 'Error del servidor. Por favor, inténtelo de nuevo más tarde.', <CancelOutlinedIcon sx={{ fontSize: 48, color: 'red' }} />);
      } else {
        handleDialogOpen('Error', 'Ha ocurrido un error al intentar registrar el pago.', <CancelOutlinedIcon sx={{ fontSize: 48, color: 'red' }} />);
      }
    } catch (error) {
      handleDialogOpen('Error', 'Ha ocurrido un error al intentar registrar el pago.', <CancelOutlinedIcon sx={{ fontSize: 48, color: 'red' }} />);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeAccount = (e) => {
    const accountId = e.target.value;
    const selected = accounts.find(account => account.id === accountId);
    if (selected) {
      setSelectedAccount(accountId);
      setForm(prevForm => ({
        ...prevForm,
        currency: selected.currency
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
    navigate('/home');
  };

  const handleCBUChange = (e) => {
    const { name, value } = e.target;
    const remainingCharacters = 22 - value.length;
    setForm({
      ...form,
      [name]: value
    });
    setErrors({
      ...errors,
      [name]: ''
    });
  };

  return (
    <section className="box-principal-gastos" style={{
      backgroundImage: `url(${fondoGastos})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <p className="titulo-gastos">Registrar Pago</p>
      <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" className="box-gastos">
        <Tooltip title={`Caracteres restantes: ${22 - form.destino.length}`}>
          <TextField
            required
            name="destino"
            label="CBU Destino"
            value={form.destino}
            onChange={handleCBUChange}
            margin="normal"
            className="custom-textfield"
            inputProps={{
              inputMode: 'numeric',
              pattern: '\\d{22}',
              maxLength: 22,
            }}
            error={!!errors.destino}
            helperText={errors.destino}
          />
        </Tooltip>
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
        <NumericFormat
          label="Monto"
          value={form.amount}
          onValueChange={handleAmountChange}
          customInput={TextField}
          className="custom-textfield"
          decimalSeparator=","
          thousandSeparator="."
          prefix={'$'}
          fullWidth
          margin="normal"
          inputProps={{
            maxLength: 15
          }}
          error={!!errors.amount}
          helperText={errors.amount}
        />
        <TextField
          name="description"
          label="Descripción"
          value={form.description}
          onChange={handleChange}
          margin="normal"
          className="custom-textfield description"
          multiline
          maxRows={2}
          inputProps={{
            maxLength: 100
          }}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          className={`button-registrar ${loading ? 'button-loading' : ''}`}
          disabled={loading || form.destino.length !== 22}
        >
          {loading ? 'Procesando...' : 'Registrar'}
        </Button>
      </Box>

    <Dialog
  open={dialogOpen}
  onClose={handleDialogClose}
  PaperProps={{
    style: {
      padding: '20px',
      borderRadius: '30px',
      backgroundColor: '#f5f5f5',  // Fondo claro
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',  // Sombra suave
      border: '1px solid #ccc'  // Borde suave
    }
  }}
>
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="center">
            {dialogContent.icon}
            <Typography variant="h6" component="span" style={{ fontWeight: 'bold', marginLeft: 8, fontSize: '1.5rem', backgroundColor:"#9fc2f6",borderRadius:15,color:"#FFFFFF",width:"auto",padding:10}}>
              {dialogContent.title}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent className="dialog-content">
          <Typography style={{whiteSpace: 'pre-wrap',fontSize: '1.3rem',fontWeight: 'bold' }}>
            <Box className="popup-detalle-transferencia">
            {dialogContent.message}
            </Box>
          </Typography>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'right' }}>
          <Button onClick={handleDialogClose} color="primary" style={{ fontSize: '1.2rem' }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      <Bubble/>
    </section>
  );
}
