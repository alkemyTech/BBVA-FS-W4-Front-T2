import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
    accountInfo: null,
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

  // Redux selector to access account information
  const account = useSelector((state) => state.account);
  const arsAccount = account.accounts.find((acc) => acc.currency === "ARS");

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
            setTransferData({ ...transferData, accountInfo: data }); // Save account information
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
    } else if (activeStep === 2) {
      // Validate amount against ARS account balance
      const amount = parseFloat(transferData.amount.replace(",", ""));
      if (amount <= arsAccount.balance) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        console.error("El monto ingresado supera el saldo disponible.");
        // Handle error scenario if needed (e.g., show error message)
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

  const updateTokenForAccount = async (accountId) => {
    try {
      const token = localStorage.getItem('token'); // Get current token from localStorage

      const response = await fetch(`http://localhost:8080/accounts/select/${accountId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let newToken = response.headers.get('authorization');
      if (newToken && newToken.startsWith('Bearer ')) {
        newToken = newToken.slice(7); // Remove 'Bearer ' prefix
      }

      localStorage.setItem('token', newToken); // Save new token to localStorage
      return newToken;
    } catch (error) {
      console.error('Error updating token:', error);
      throw error;
    }
  };

  const handleConfirm = async () => {
    try {
      const accountId = arsAccount.id; // Get ARS account ID
      const newToken = await updateTokenForAccount(accountId); // Get new encrypted token

      const payload = {
        destino: transferData.cbu,
        amount: parseFloat(transferData.amount.replace(",", "")), // Parse amount to float
        currency: "ARS", // Currency always in ARS
        description: "transferencia test", // Optional description
      };

      const response = await fetch("http://localhost:8080/transactions/sendArs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${newToken}`, // Pass new encrypted token as Authorization
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
                  >
                    Siguiente
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
                  >
                    Siguiente
                  </Button>
                </Box>
              </Box>
            )}
            {!showContactos && activeStep === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Confirmar Transferencia
                </Typography>
                <Typography gutterBottom>
                  Destinatario: {selectedContact.name} ({transferData.cbu})
                </Typography>
                <Typography gutterBottom>
                  Monto: ${transferData.amount}
                </Typography>
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
            {activeStep === 4 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Transferencia Exitosa
                </Typography>
                <Typography gutterBottom>
                  ¡La transferencia ha sido realizada con éxito!
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
