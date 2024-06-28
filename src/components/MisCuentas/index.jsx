import { Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import "./misCuentas.css";

const MisCuentas = () => {
  // Obtener las cuentas del estado de Redux
  const accounts = useSelector((state) => state.account.accounts);

  // Función para traducir los tipos de cuenta
  const getAccountTypeName = (accountType) => {
    switch (accountType) {
      case "CAJA_AHORRO":
        return "Caja de Ahorro";
      case "CUENTA_CORRIENTE":
        return "Cuenta Corriente";
      default:
        return accountType;
    }
  };

  // Función para traducir las monedas
  const getCurrencyName = (currency) => {
    switch (currency) {
      case "ARS":
        return "Pesos";
      case "USD":
        return "Dólares";
      default:
        return currency;
    }
  };

  // Función para formatear el balance
  const formatBalance = (balance) => {
    return balance.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Función para copiar el CBU al portapapeles
  const copyToClipboard = (cbu) => {
    navigator.clipboard
      .writeText(cbu)
      .then(() => {
        //Acá podría ir el SnackBar
        alert("CBU copiado al portapapeles");
      })
      .catch((err) => {
        console.error("Error al copiar el CBU: ", err);
      });
  };

  return (
    <section className="box-general">
      <Typography variant="h5" className="titulo-cuentas">
        Mis Cuentas
      </Typography>

      <hr className="linea-azul" />

      <section className="box-de-cuentas">
        {accounts.map((account) => (
          <article
            key={account.id}
            style={{ marginBottom: "20px" }}
            className="box-cuenta"
          >
            <p className="moneda-cuenta">{getCurrencyName(account.currency)}</p>
            <p className="tipo-cuenta">
              {getAccountTypeName(account.accountType)}
            </p>
            <p className="balance-cuenta">$ {formatBalance(account.balance)}</p>
            {account.cbu && (
              <p
                className="cbu-cuenta"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() => copyToClipboard(account.cbu)}
              >
                <ContentCopyIcon fontSize="smaller" /> {account.cbu}
              </p>
            )}
          </article>
        ))}
      </section>
    </section>
  );
};

export default MisCuentas;
