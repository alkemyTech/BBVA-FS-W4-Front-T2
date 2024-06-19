import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Paper, Typography, Box, TextField, MenuItem, Button } from '@mui/material';
import { fetchAccounts, addBalance } from "../../Redux/slice/accountSlice"; // Importa tus acciones

const Deposito = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.id); // Obtener el id del usuario del estado global
  const accounts = useSelector((state) => state.account.accounts);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [details, setDetails] = useState("");
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState("");
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (userId) {
      dispatch(fetchAccounts(userId));
    }
  }, [userId, dispatch]);

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
      localStorage.setItem('token', newToken); // Actualizar el token en el almacenamiento local
      return newToken;
    } catch (error) {
      console.error('Error al actualizar el token:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (amount <= 0) {
      setError("El monto debe ser mayor que cero");
      return;
    }

    try {
      const newToken = await updateTokenForAccount(selectedAccount);

      const transactionDetails = {
        destino: selectedAccount,
        amount: parseFloat(amount),
        currency: "ARS",
        description: details,
      };

      // Llamar a addBalance en el frontend
      dispatch(addBalance(transactionDetails));

      // Llamar al backend
      const response = await fetch('http://localhost:8080/transactions/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${newToken}`, // Usar el nuevo token actualizado
        },
        body: JSON.stringify(transactionDetails),
      });

      const data = await response.json();
      // Manejo de la respuesta del backend
      console.log(data);

      setError("");
      setSelectedAccount("");
      setAmount("");
      setDetails("");
      setDate(new Date());
    } catch (error) {
      console.error('Error:', error);
      setError("Error al procesar la transacción");
    }
  };

  return (
    <Grid
      container
      sx={{
        height: "100vh",
        backgroundColor: "#182346",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        sx={{
          width: "600px",
          padding: "20px",
          background: "#fff",
          boxShadow: "0 14px 60px rgba(0, 0, 0, 0.06)",
          borderRadius: "10px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Carga de Saldo
        </Typography>
        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
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
          <TextField
            label="Monto"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Detalle del Movimiento"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            fullWidth
            margin="normal"
          />

          <Button variant="contained" type="submit" fullWidth>
            Cargar Saldo
          </Button>
        </Box>
      </Paper>
    </Grid>
  );
};

export default Deposito;
