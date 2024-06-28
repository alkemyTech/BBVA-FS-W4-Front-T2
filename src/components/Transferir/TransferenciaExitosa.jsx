import React from "react";
import { Box, Typography, Button } from "@mui/material";

const TransferenciaExitosa = ({ handleReset }) => {
  return (
    <Box>
      <Box  border={"1px solid green"} color={"green"} margin={"10px"} padding={"8px"}>
        <Typography variant="h6" gutterBottom color={"green"}>
          ¡Transferencia Exitosa!
        </Typography>
        <Typography gutterBottom>
          ¡La transferencia ha sido realizada con éxito!
        </Typography>
      </Box>

      <Button variant="contained" color="primary" onClick={handleReset}>
        Realizar otra transferencia
      </Button>
    </Box>
  );
};

export default TransferenciaExitosa;
