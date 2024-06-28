import React, { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import "./converter.css"; // Importa estilos CSS si es necesario

const CurrencyConverter = () => {
  const [amount, setAmount] = useState("");
  const [baseCurrency, setBaseCurrency] = useState("ARS");
  const [targetCurrency, setTargetCurrency] = useState("USD");
  const [conversionResult, setConversionResult] = useState("");

  const handleConvert = () => {
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      alert("Invalid amount. Please enter a positive number.");
      setConversionResult("Invalid amount. Please enter a positive number.");
      return;
    }
    if (
      !["USD", "ARS"].includes(baseCurrency) ||
      !["USD", "ARS"].includes(targetCurrency)
    ) {
      alert("Invalid currency type. Please select from USD, LKR, or INR.");
      return;
    }
    const conversionRate = getConversionRate(baseCurrency, targetCurrency);
    const convertedAmount = amountValue * conversionRate;
    setConversionResult(
      `${amountValue} ${baseCurrency} = ${convertedAmount.toFixed(
        2
      )} ${targetCurrency}`
    );
  };

  const getConversionRate = (baseCurrency, targetCurrency) => {
    const exchangeRates = {
      USD: { ARS: 911.01 },
      ARS: { USD: 0.0011 },
    };
    return exchangeRates[baseCurrency][targetCurrency];
  };

  return (
    <div className="container">
      <h1 className="title">Conversor de Moneda</h1>
      <div className="converter">
        <div className="input-group">
          
          <TextField
            id="amount"
            placeholder="Poner Monto"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            InputProps={{
              inputProps: {
                style: {
                  textAlign: "center",
                  backgroundColor: "#87C7FF" // Mismo color de fondo que Moneda Base
                }
              }
            }}
          />
        </div>

        <div className="input-group">
          <select
            id="baseCurrency"
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
            style={{ backgroundColor: "#87C7FF" }} // Aplicar el mismo color de fondo
          >
            <option value="USD">USD</option>
            <option value="ARS">ARS</option>
          </select>
        </div>
        <div className="input-group">
          <select
            id="targetCurrency"
            value={targetCurrency}
            onChange={(e) => setTargetCurrency(e.target.value)}
          >
            <option value="USD">USD</option>
            <option value="ARS">ARS</option>
          </select>
        </div>
        <Button variant="contained" color="primary" onClick={handleConvert}>
          CONVERTIR
        </Button>
      </div>
      <div className="result">
        <p id="conversionResult">{conversionResult}</p>
      </div>
    </div>
  );
};

export default CurrencyConverter;
