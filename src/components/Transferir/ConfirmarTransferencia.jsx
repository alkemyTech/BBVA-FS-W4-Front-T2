import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import "./transferir.css"

const ConfirmarTransferencia = ({ transferData,  handleBack, handleConfirm, isLoading }) => {
  return (
    <Box display={"flex"} justifyContent={"center"} flexDirection={"column"} textAlign={"center"}> 
      <Box border={"1px solid #1565c0"} padding={2}  fontSize={20} textAlign={'center'} className="box-datos-transferencia">
          <b>CBU Destino:</b> {transferData.cbu}
          <b>Destinatario: </b> {transferData.accountInfo.firstName} {transferData.accountInfo.lastName}
          <b>Cuenta: </b>  {transferData.accountInfo.accountType}
          <b>Alias: </b> {transferData.accountInfo.alias}
          <b>Monto:</b> ${transferData.amount}
      </Box>

      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button  onClick={handleBack}>
          Atrás
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirm}
          disabled={isLoading}
          className={isLoading ? "button-loading" : ""} 
        >
          {isLoading ? "Tranfiriendo..." : "Confirmar" }
        </Button>
      </Box>
    </Box>
  );
};

export default ConfirmarTransferencia
