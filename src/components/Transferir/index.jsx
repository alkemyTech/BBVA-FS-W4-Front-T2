import React, { useState, useEffect } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  InputAdornment,
} from "@mui/material";
import Contactos from "../Contactos"; // Asegúrate de que la ruta sea correcta

const Transferir = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [transferData, setTransferData] = useState({
    cbu: "",
    amount: "",
    accountInfo: null, // Para almacenar la información de la cuenta
  });
  const [contactList, setContactList] = useState([]);
  const [selectedContact, setSelectedContact] = useState("");
  const [showContactos, setShowContactos] = useState(false);

  // Mock contact list for demonstration
  const mockContactList = [
    { id: 1, name: "Juan Perez", cbu: "1234567890123456789012" },
    { id: 2, name: "Maria Gomez", cbu: "9876543210987654321098" },
    // Add more contacts as needed
  ];

  useEffect(() => {
    // Fetch user's contact list from API if needed
    // Replace with actual API call to fetch contact list
    setContactList(mockContactList);
  }, []);

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setTransferData({ ...transferData, cbu: contact.cbu });
    setShowContactos(false);
    setActiveStep(2); // Move to step 3 (Ingresar Monto)
  };

  const handleNewTransfer = () => {
    setSelectedContact("");
    setActiveStep(1); // Move to step 1 (Ingresar CBU)
  };

  const handleNext = async () => {
    if (activeStep === 1) {
      const cbu = transferData.cbu;
      if (cbu.length === 22) {
        try {
          const response = await fetch(
            `http://localhost:8080/accounts/info/${cbu}`
          );
          if (response.ok) {
            const data = await response.json();
            // Assuming the API returns account information
            console.log("Account Info:", data);
            setTransferData({ ...transferData, accountInfo: data }); // Guardar la información de la cuenta
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
          } else {
            console.error(
              "Failed to fetch account information. Status:",
              response.status
            );
            // Handle error scenario if needed
          }
        } catch (error) {
          console.error("Error fetching account information:", error);
          // Handle error scenario if needed
        }
      } else {
        console.error("CBU length is incorrect.");
        // Handle error scenario if needed
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCBUChange = (e) => {
    const cbu = e.target.value;
    setTransferData({ ...transferData, cbu });
  };

  const handleAmountChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^\d.]/g, "");
    const parts = value.split(".");
    let formattedValue = "";
    if (parts.length > 0) {
      formattedValue = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    if (parts.length > 1) {
      formattedValue += `.${parts[1].slice(0, 2)}`;
    }
    setTransferData({ ...transferData, amount: formattedValue });
  };

  const handleConfirm = async () => {
    try {
      const payload = {
        destino: transferData.cbu,
        amount: parseFloat(transferData.amount.replace(",", "")), // Parsear el monto a float
        currency: "ARS", // Moneda siempre en ARS
        description: "transferencia test", // Descripción opcional
      };

      console.log(transferData)
      const response = await fetch("http://localhost:8080/transactions/sendArs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("Transferencia realizada exitosamente");
        setActiveStep(4); // Move to step 4 (Transferencia Exitosa)
      } else {
        console.error("Error al realizar la transferencia. Estado:", response.status);
        // Handle error scenario if needed
      }
    } catch (error) {
      console.error("Error al realizar la transferencia:", error);
      // Handle error scenario if needed
    }
  };

  const handleReset = () => {
    setTransferData({
      cbu: "",
      amount: "",
      accountInfo: null,
    });
    setSelectedContact("");
    setActiveStep(0); // Reset to step 0 (Selección de Destinatario)
  };

  const stepTitles = [
    "Seleccionar Destinatario",
    "Ingresar CBU",
    "Ingresar Monto",
    "Confirmar Transferencia",
    "Transferencia Exitosa",
  ];

  return (
    <Box sx={{ display: "grid", placeItems: "center" }}>
      <Card
        sx={{
          width: "100%",
          maxWidth: "600px",
          p: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {showContactos ? "Seleccionar Contacto" : stepTitles[activeStep]}
          </Typography>
          {!showContactos && (
            <Stepper
              activeStep={activeStep}
              sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}
            >
              {stepTitles.map((title, index) => (
                <Step key={index}>
                  <StepLabel>{title}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}
          <Box sx={{ mt: 4 }}>
            {activeStep === 0 && (
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
            )}
            {showContactos && (
              <Contactos
                contactList={contactList}
                handleSelectContact={handleSelectContact}
                handleBack={() => setShowContactos(false)}
              />
            )}
            {!showContactos && activeStep === 1 && (
              <Box>
                <TextField
                  label="Ingresar CBU"
                  variant="outlined"
                  fullWidth
                  value={transferData.cbu}
                  onChange={handleCBUChange}
                  inputProps={{ maxLength: 22 }}
                />
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button variant="contained" onClick={handleBack}>
                    Atrás
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    disabled={!transferData.cbu}
                  >
                    Continuar
                  </Button>
                </Box>
              </Box>
            )}
            {!showContactos && activeStep === 2 && (
              <Box>
                <TextField
                  label="Ingresar Monto"
                  variant="outlined"
                  fullWidth
                  value={transferData.amount}
                  onChange={handleAmountChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  inputProps={{ maxLength: 20 }}
                />
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button variant="contained" onClick={handleBack}>
                    Atrás
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    disabled={!transferData.amount}
                  >
                    Continuar
                  </Button>
                </Box>
              </Box>
            )}
            {!showContactos && activeStep === 3 && (
              <Box sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    textAlign: "left",
                    maxWidth: "300px",
                    margin: "0 auto",
                  }}
                >
                  <Typography variant="body1">
                    <b>CBU: </b>
                    {transferData.cbu}
                  </Typography>
                  <Typography variant="body1">
                    <b>Monto: </b> ${transferData.amount}
                  </Typography>
                  {transferData.accountInfo && (
                    <Box>
                      <Typography variant="body1">
                        <b> Nombre: </b> {transferData.accountInfo.firstName}{" "}
                        {transferData.accountInfo.lastName}
                      </Typography>
                      <Typography variant="body1">
                        <b>Alias: </b> {transferData.accountInfo.alias}
                      </Typography>
                      <Typography variant="body1">
                        <b>Tipo de cuenta: </b>
                        {transferData.accountInfo.accountType}
                      </Typography>
                      <Typography variant="body1">
                        <b> DNI: </b>
                        {transferData.accountInfo.dni}
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button variant="contained" onClick={handleBack}>
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
            )}
            {!showContactos && activeStep === 4 && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  ¡Transferencia Exitosa!
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleReset}
                >
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
