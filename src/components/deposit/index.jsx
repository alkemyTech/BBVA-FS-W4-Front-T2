import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Paper, Typography, Box, TextField, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { fetchAccounts, addBalance } from "../../Redux/slice/accountSlice";
import { NumericFormat } from 'react-number-format';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import fondoCargarSaldo from '../../assets/fondoCargarSaldo.svg'
import './deposit.css';

const Deposito = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.id);
  const accounts = useSelector((state) => state.account.accounts);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [details, setDetails] = useState("");
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: '',
    message: '',
    icon: null
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const token = localStorage.getItem('token');

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
    const cleanedAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
    if (cleanedAmount <= 0) {
      setError("El monto debe ser mayor que cero");
      return;
    }

    setIsProcessing(true);

    try {
      const newToken = await updateTokenForAccount(selectedAccount);

      const transactionDetails = {
        destino: selectedAccount,
        amount: cleanedAmount,
        currency: accounts.find(account => account.id === selectedAccount).currency,
        description: details,
      };

      dispatch(addBalance(transactionDetails));

      const response = await fetch('http://localhost:8080/transactions/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${newToken}`,
        },
        body: JSON.stringify(transactionDetails),
      });

      const data = await response.json();
      console.log(data);

      let updatedToken = response.headers.get('authorization');
      if (updatedToken && updatedToken.startsWith('Bearer ')) {
        updatedToken = updatedToken.slice(7);
        localStorage.setItem('token', updatedToken);
      }

      setError("");
      setSelectedAccount("");
      setAmount("");
      setDetails("");
      setDate(new Date());

      handleDialogOpen('Depósito Exitoso', 'El depósito se ha registrado correctamente.', <CheckCircleOutlineIcon sx={{ fontSize: 48, color: 'green' }} />);
    } catch (error) {
      console.error('Error:', error);
      setError("Error al procesar la transacción");
      handleDialogOpen('Error en la Transacción', 'Error al procesar la transacción', <CancelOutlinedIcon sx={{ fontSize: 48, color: 'red' }} />);
    } finally {
      setIsProcessing(false);
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

  return (
    <Grid
      container
      sx={{
        height: "80vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper className="box-principal-deposito"  style={{
          backgroundImage: `url(${fondoCargarSaldo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
        <>
          <p className="titulo-deposito">Carga de Saldo</p>
          {error && (
            <Typography color="error" gutterBottom>
              {error}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSubmit} className="box-deposito">
            <Box className="input-container">
              <TextField
                className="custom-formcontrol"
                label="Cuenta"
                select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                fullWidth
                margin="normal"
              >
                {accounts.map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.cbu} - {account.currency}
                  </MenuItem>
                ))}
              </TextField>
              <NumericFormat
                className="custom-textfield"
                label="Monto"
                value={amount}
                onValueChange={(values) => setAmount(values.value)}
                customInput={TextField}
                decimalSeparator=","
                thousandSeparator="."
                prefix={'$'}
                fullWidth
                margin="normal"
              />
            </Box>
            <TextField
              className="custom-textfield description"
              label="Detalle del Movimiento"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button
              className={`button-registrar ${isProcessing ? 'button-loading' : ''}`}
              variant="contained"
              type="submit"
              fullWidth
              disabled={isProcessing}
            >
              {isProcessing ? 'Procesando...' : 'Cargar Saldo'}
            </Button>
          </Box>
        </>
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        PaperProps={{
          style: {
            padding: '20px',
            borderRadius: '15px',
            backgroundColor: '#f5f5f5',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            border: '1px solid #ccc'
          }
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            {dialogContent.icon}
            <Typography variant="h6" component="span" style={{ fontWeight: 'bold', marginLeft: 8, fontSize: '1.5rem' }}>
              {dialogContent.title}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography style={{ fontWeight: 'bold', whiteSpace: 'pre-wrap', textAlign: 'left', fontSize: '1.3rem' }}>
            {dialogContent.message}
          </Typography>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'right' }}>
          <Button onClick={handleDialogClose} color="primary" style={{ fontSize: '1.2rem' }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Deposito;
