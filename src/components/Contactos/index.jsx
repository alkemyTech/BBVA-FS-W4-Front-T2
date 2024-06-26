import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const Contactos = ({ contactList, handleSelectContact, handleBack }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Seleccione un contacto:
      </Typography>
      {contactList.map(contact => (
        <Button key={contact.id} variant="outlined" onClick={() => handleSelectContact(contact)}>
          {contact.name}
        </Button>
      ))}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" onClick={handleBack}>
          Atrás
        </Button>
      </Box>
    </Box>
  );
};

export default Contactos;
