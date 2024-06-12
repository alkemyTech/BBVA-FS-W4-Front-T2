import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

export const Logout = ({ logout, setLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí podrías agregar la lógica para cerrar sesión, por ejemplo, limpiando el estado del usuario en redux
    // y redirigiendo al usuario a la página de login
    // dispatch(logoutAction()); // Despachar acción de logout si usas redux
    setLogout(false);
    navigate('/login'); // Redirigir a la página de login
  };

  const handleClose = () => {
    setLogout(false);
  };

  return (
    <Dialog
      open={logout}
      onClose={handleClose}
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description"
    >
      <DialogTitle id="logout-dialog-title">{"Cerrar Sesión"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="logout-dialog-description">
          ¿Estás seguro de que deseas cerrar sesión?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleLogout} color="primary" autoFocus>
          Cerrar Sesión
        </Button>
      </DialogActions>
    </Dialog>
  );
};
