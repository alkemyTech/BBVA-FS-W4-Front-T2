import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from "@mui/material";
import Contactos from "../Contactos";
import SeleccionarDestinatario from "./SeleccionarDestinatario";
import IngresarCBU from "./IngresarCBU";
import IngresarMonto from "./IngresarMonto";
import ConfirmarTransferencia from "./ConfirmarTransferencia";
import TransferenciaExitosa from "./TransferenciaExitosa";

const Transferir = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [transferData, setTransferData] = useState({
    cbu: "",
    amount: "",
    accountInfo: null,
  });
  const [contactList, setContactList] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactos, setShowContactos] = useState(false);
  const [error, setError] = useState("");
  const [openSaveContactDialog, setOpenSaveContactDialog] = useState(false);
  const [newContactName, setNewContactName] = useState("");

  const account = useSelector((state) => state.account);
  const arsAccount = account.accounts.find((acc) => acc.currency === "ARS");


  const handleSelectContact = async (contact) => {
    setTransferData({ ...transferData, cbu: contact.cbu });

    setTransferData(prevTransferData => ({
      ...prevTransferData,
      cbu: contact.cbu,
    }));

    try {
      const response = await fetch(`http://localhost:8080/accounts/info/${contact.cbu}`);
      if (response.ok) {
        const data = await response.json();
        setTransferData(prevTransferData => ({
          ...prevTransferData,
          accountInfo: data,
        }));

        
        setActiveStep(2); 
        setShowContactos(false)
      } else {
        setError("Failed to fetch account information. Please try again.");
      }
    } catch (error) {
      setError("Error fetching account information. Please try again.");
    }
  };

  const handleNewTransfer = () => {
    setSelectedContact(null); 
    setActiveStep(1);
  };

  const handleNext = async () => {
    setError("");
    if (activeStep === 1) {
      const cbu = transferData.cbu;
      if (cbu.length === 22) {
        try {
          const response = await fetch(
            `http://localhost:8080/accounts/info/${cbu}`
          );
          if (response.ok) {
            const data = await response.json();
            setTransferData({ ...transferData, accountInfo: data });
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
          } else {
            setError("Failed to fetch account information. Please try again.");
          }
        } catch (error) {
          setError("Error fetching account information. Please try again.");
        }
      } else {
        setError("CBU length is incorrect.");
      }
    } else if (activeStep === 2) {
      const amount = parseFloat(transferData.amount.replace(",", ""));
      if (amount <= arsAccount.balance) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        setError("El monto ingresado supera el saldo disponible.");
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (showContactos) {
      setShowContactos(false);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
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
      if (parts.length > 1) {
        formattedValue += `.${parts[1].slice(0, 2)}`;
      }
    }
    setTransferData({ ...transferData, amount: formattedValue });
  };

  const updateTokenForAccount = async (accountId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/accounts/select/${accountId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let newToken = response.headers.get("authorization");
      if (newToken && newToken.startsWith("Bearer ")) {
        newToken = newToken.slice(7);
      }

      localStorage.setItem("token", newToken);
      return newToken;
    } catch (error) {
      console.error("Error updating token:", error);
      throw error;
    }
  };

  const handleConfirm = async () => {
    try {
      const accountId = arsAccount.id;
      const newToken = await updateTokenForAccount(accountId);

      const payload = {
        destino: transferData.cbu,
        amount: parseFloat(transferData.amount.replace(",", "")),
        currency: "ARS",
        description: "transferencia test",
      };
      const response = await fetch(
        "http://localhost:8080/transactions/sendArs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        setActiveStep(4);
      } else {
        setError("Error al realizar la transferencia. Intente nuevamente.");
      }
    } catch (error) {
      setError("Error al realizar la transferencia. Intente nuevamente.");
    }
  };

  const handleReset = () => {
    setTransferData({
      cbu: "",
      amount: "",
      accountInfo: null,
    });
    setSelectedContact(null);
    setActiveStep(0);
  };

  const handleSaveNewContact = async () => {
    const newContact = {
      name: newContactName,
      cbu: transferData.cbu,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/newContact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newContact),
      });

      if (response.ok) {
        setContactList([...contactList, newContact]);
        setOpenSaveContactDialog(false);
      } else {
        console.error("Error saving new contact");
      }
    } catch (error) {
      console.error("Error saving new contact:", error);
    }
  };

  const stepTitles = [
    "Seleccionar Destinatario",
    "Ingresar CBU",
    "Ingresar Monto",
    "Confirmar Transferencia",
    "Resultado Transferencia",
  ];

  return (
    <Box sx={{ display: "grid", placeItems: "center" }}>
      <Card
        sx={{
          width: "1200px",
          p: 2,
          justifyContent: "center",
          alignItems: "center",
          color: "#1565c0",
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
                  <StepLabel sx={{ color: "#1565c0" }}>{title}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}
          <Box sx={{ mt: 4 }}>
            {activeStep === 0 && !showContactos && (
              <SeleccionarDestinatario
                handleNewTransfer={handleNewTransfer}
                setShowContactos={setShowContactos}
              />
            )}
            {showContactos && (
              <Contactos
                contactList={contactList}
                handleSelectContact={handleSelectContact}
                handleBack={() => setShowContactos(false)}
              />
            )}
            {!showContactos && activeStep === 1 && (
              <IngresarCBU
                cbu={transferData.cbu}
                handleCBUChange={handleCBUChange}
                handleNext={handleNext}
                handleBack={handleBack}
                error={error}
              />
            )}
            {!showContactos && activeStep === 2 && (
              <IngresarMonto
                amount={transferData.amount}
                handleAmountChange={handleAmountChange}
                handleNext={handleNext}
                handleBack={handleBack}
                error={error}
              />
            )}
            {!showContactos && activeStep === 3 && (
              <ConfirmarTransferencia
                transferData={transferData}
                handleBack={handleBack}
                handleConfirm={handleConfirm}
              />
            )}
            {activeStep === 4 && (
              <TransferenciaExitosa handleReset={handleReset} />
            )}
          </Box>
         
          
        </CardContent>
      </Card>
    </Box>
  );
};

export default Transferir;