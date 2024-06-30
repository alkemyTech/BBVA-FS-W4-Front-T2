import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const ConfirmarTransferencia = ({ transferData,  handleBack, handleConfirm }) => {
  return (
    <Box display={"flex"} justifyContent={"center"} flexDirection={"column"} textAlign={"center"}> 
      <Box border={"1px solid #1565c0"} padding={2} textAlign={'left'}>
        <Typography gutterBottom>
          <b>CBU Destino:</b> {transferData.cbu}
        </Typography>
        <Typography gutterBottom>
          <b>Destinatario: </b> {transferData.accountInfo.firstName} {transferData.accountInfo.lastName}
        </Typography>
        <Typography gutterBottom>
          <b>Cuenta: </b>  {transferData.accountInfo.accountType}
        </Typography>
        <Typography gutterBottom>
          <b>Alias: </b> {transferData.accountInfo.alias}
        </Typography>
        <Typography gutterBottom>
          <b>Monto:</b> ${transferData.amount}
        </Typography>
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
        >
          Confirmar
        </Button>
      </Box>
    </Box>
  );
};

export default ConfirmarTransferencia
