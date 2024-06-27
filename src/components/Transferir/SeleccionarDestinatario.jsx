import React from 'react';
import { Box, Button } from '@mui/material';

const SeleccionarDestinatario = ({ handleNewTransfer, setShowContactos }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleNewTransfer}
      >
        Transferir a un nuevo CBU
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowContactos(true)}
      >
        Transferir a un contacto
      </Button>
    </Box>
  );
};

export default SeleccionarDestinatario;
