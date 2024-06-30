import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import ContactsIcon from "@mui/icons-material/Contacts";
import { SnackbarProvider, useSnackbar } from 'notistack';

const IngresarCBU = ({
  cbu,
  handleCBUChange,
  handleNext,
  handleBack,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [popupError, setPopupError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSaveClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName("");
    setPopupError("");
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSaveContact = async () => {
    if (!name) {
      setPopupError("El nombre es requerido");
      return;
    }

    const newContact = { name, cbu };
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8080/newContact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newContact),
      });

      if (response.ok) {
        enqueueSnackbar('Contacto guardado con éxito', { variant: 'success' });
        handleClose();
      } else {
        throw new Error("Error al guardar el contacto");
      }
    } catch (error) {
      setPopupError(error.message);
    }
  };

  return (
    <Box>
      <TextField
        label="Ingresar CBU"
        variant="outlined"
        fullWidth
        value={cbu}
        onChange={handleCBUChange}
        inputProps={{ maxLength: 22 }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#1565c0',
            },
            '&:hover fieldset': {
              borderColor: '#1565c0',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1565c0',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#1565c0',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#1565c0',
          },
           '& .MuiInputBase-root input': {
              color: '#1565c0',
          }
         
        }}
      />
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        <Button onClick={handleBack}>Atrás</Button>
        <Button variant="outlined" color="primary" onClick={handleSaveClick}>
          Guardar nuevo contacto
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginLeft: "auto" }}
          onClick={handleNext}
        >
          SIGUIENTE
        </Button>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        PaperProps={{
          style: {
            padding: "20px",
            borderRadius: "15px",
            backgroundColor: "#f5f5f5",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            border: "1px solid #ccc",
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <ContactsIcon fontSize="large" style={{ fontSize: "2rem" }} />
            <Typography
              variant="h5"
              component="span"
              style={{ fontWeight: "bold", marginLeft: 10, fontSize: "1.5rem", marginBottom: 5 }}
            >
              Guardar Contacto
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
            <TextField
              label="Nombre"
              variant="outlined"
              fullWidth
              value={name}
              onChange={handleNameChange}
            />
            {popupError && (
              <Typography color="error" variant="body2">
                {popupError}
              </Typography>
            )}
            {successMessage && (
              <Typography color="primary" variant="body2">
                {successMessage}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveContact}
            color="primary"
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IngresarCBU;
   