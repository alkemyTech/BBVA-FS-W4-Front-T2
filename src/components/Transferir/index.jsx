import React from 'react';
import { Box, Stepper, Step, StepLabel, TextField, Button, Typography, Card, CardContent, CardActions } from '@mui/material';
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

  const handleCBUChange = (e) => {
    setTransferData({ ...transferData, cbu: e.target.value });
  };

  const handleAmountChange = (e) => {
    setTransferData({ ...transferData, amount: e.target.value });
  };

  const handleConfirm = () => {

    console.log('Transferencia confirmada:', transferData);
    setActiveStep(steps.length);
  };

  return (
    <Box sx={{ maxWidth: 700, margin: 'auto', mt: 20, color: (255, 255, 255, 0.87) }}>
     <Card>
     <CardContent>
      <Typography fontFamily="Roboto" fontSize="50px" margin={2} variant="h3" gutterBottom color="black" >
        Transferir
      </Typography>
      
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ mt: 6 }}>
            {activeStep === 0 && (
              <Box>
                <TextField
                  label="Ingresar CBU"
                  variant="outlined"
                  fullWidth
                  value={transferData.cbu}
                  onChange={handleCBUChange}
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
                <Button variant="contained" color="primary" onClick={() => setActiveStep(0)}>
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
