import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addBalance } from "../../../Redux/slice/accountSlice"; // Importar la acción desde el slice
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Grid,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const currencies = [
  { value: "ARS", label: "ARS" },
  { value: "USD", label: "USD" },
];

const Deposito = () => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState("");
  const [concept, setConcept] = useState("");
  const [details, setDetails] = useState("");
  const [currency, setCurrency] = useState("ARS");
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount <= 0) {
      setError("El monto debe ser mayor que cero");
      return;
    }
    const balanceDetails = {
      amount: parseFloat(amount),
      concept,
      details,
      currency,
      date: date.toISOString(),
    };
    dispatch(addBalance(balanceDetails));
    setError("");
    setAmount("");
    setConcept("");
    setDetails("");
    setCurrency("ARS");
    setDate(new Date());
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
            label="Monto"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Concepto"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
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
          <TextField
            label="Moneda"
            select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            fullWidth
            margin="normal"
          >
            {currencies.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <DatePicker
            selected={date}
            onChange={(newDate) => setDate(newDate)}
            dateFormat="dd/MM/yyyy"
            customInput={<TextField label="Fecha" fullWidth margin="normal" />}
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
