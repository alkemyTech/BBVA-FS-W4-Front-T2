import React, { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import "./converter.css"; // Importa estilos CSS si es necesario
import CurrencyExchange from '@mui/icons-material/CurrencyExchange';
const CurrencyConverter = () => {
  const [amount, setAmount] = useState("");
  const [baseCurrency, setBaseCurrency] = useState("ARS");
  const [targetCurrency, setTargetCurrency] = useState("USD");
  const [conversionResult, setConversionResult] = useState("");
  const handleConvert = () => {
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setConversionResult("¡Monto Inválido!");
      return;
    }
    if (!["USD", "ARS"].includes(baseCurrency) || !["USD", "ARS"].includes(targetCurrency)) {
      alert("Tipo de moneda inválido. Por favor selecciona USD o ARS.");
      return;
    }
    const conversionRate = getConversionRate(baseCurrency, targetCurrency);
    const convertedAmount = amountValue * conversionRate;
    setConversionResult(`${amountValue} ${baseCurrency} = ${convertedAmount.toFixed(2)} ${targetCurrency}`);
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
      <CurrencyExchange sx={{ fontSize: 50 }}/>
      <h1 className="title">Conversor de Moneda</h1>
      <div className="converter">
        <div className="input-group">
          <TextField
            id="amount"
            placeholder="Introducir Monto"
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
          <Select
            id="baseCurrency"
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
            style={{ backgroundColor: "#87C7FF", minWidth:80 , width: 80, height: 38.19 }}
          >
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="ARS">ARS</MenuItem>
          </Select>
        </div>
        <div className="input-group">
          <Select
            id="targetCurrency"
            value={targetCurrency}
            onChange={(e) => setTargetCurrency(e.target.value)}
            style={{ backgroundColor: "#87C7FF", minWidth: 80, width: 80, height: 38.19 }}
          >
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="ARS">ARS</MenuItem>
          </Select>
        </div>
      </div>
      <Button variant="contained" style={{ backgroundColor: "#63B3ED" , width:200, marginBottom:10}} onClick={handleConvert}>
        CONVERTIR
      </Button>
      <div className="result">
        <p id="conversionResult">{conversionResult}</p>
      </div>
    </div>
  );
};
export default CurrencyConverter;