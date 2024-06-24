import React from 'react';
import { Box, Stepper, Step, StepLabel, TextField, Button, Typography, Card, CardContent, CardActions, InputAdornment } from '@mui/material';
import "/src/main.jsx"


const Transferir = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [transferData, setTransferData] = React.useState({
    cbu: '',
    amount: '',
  });

  const steps = ['Ingresar CBU', 'Ingresar Monto', 'Confirmar Transferencia'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };


  const handleAmountChange = (e) => {
    let value = e.target.value;

    // Eliminar cualquier caracter que no sea dígito o punto
    value = value.replace(/[^\d.]/g, '');
  
    // Dividir el valor en parte entera y decimal
    const parts = value.split('.');
    let formattedValue = '';
  
    // Formatear la parte entera con comas
    if (parts.length > 0) {
      formattedValue = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  
    // Agregar el punto decimal y la parte decimal si existe
    if (parts.length > 1) {
      formattedValue += `.${parts[1].slice(0, 2)}`; // Limitar la parte decimal a dos lugares
    }
  
    // Actualizar el estado con el valor formateado
    setTransferData({ ...transferData, amount: formattedValue });
  };

  const handleConfirm = () => {

    console.log('Transferencia confirmada:', transferData);
    setActiveStep(steps.length);
  };
  const handleCBUChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,25}$/.test(value)) {
      setTransferData({ ...transferData, cbu: value });
    }
  };
  const handleReset = () => {
    setTransferData({
      cbu: '',
      amount: '',
    });
    setActiveStep(0);
  };

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', }}>
      <Card sx={{ width: '160%', maxWidth: '800px', p: 2, justifyContent: 'center', alignItems: 'center', }} >
        <CardContent>
          <Typography fontFamily="Roboto" fontSize="50px" margin={3} variant="h4" gutterBottom color="black" >
            Transferir
          </Typography>

          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ mt: 8, fontSize: 10, }}>
            {activeStep === 0 && (
              <Box>
                <TextField
                  label="Ingresar CBU"
                  variant="outlined"
                  fullWidth
                  value={transferData.cbu}
                  onChange={handleCBUChange}
                  inputProps={{ maxLength: 25 }}
                />
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" color="primary" onClick={handleNext} disabled={!transferData.cbu}>
                    Continuar
                  </Button>
                </Box>
              </Box>
            )}
            {activeStep === 1 && (
              <Box>
                <TextField
                  label="Ingresar Monto"
                  variant="outlined"
                  fullWidth
                  value={transferData.amount}
                  onChange={handleAmountChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  inputProps={{ maxLength: 20 }}
                />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant="contained" onClick={handleBack}>
                    Atrás
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleNext} disabled={!transferData.amount}>
                    Continuar
                  </Button>
                </Box>
              </Box>
            )}
            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Confirmar Transferencia
                </Typography>
                <Typography variant="body1">CBU: {transferData.cbu}</Typography>
                <Typography variant="body1">Monto: {transferData.amount}</Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant="contained" onClick={handleBack}>
                    Atrás
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleConfirm}>
                    Confirmar
                  </Button>
                </Box>
              </Box>
            )}
            {activeStep === steps.length && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  ¡Transferencia Exitosa!
                </Typography>
                <Button variant="contained" color="primary" onClick={handleReset}>
                  Realizar otra transferencia
                </Button>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Transferir;
