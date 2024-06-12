import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {clearUser} from '../../../../Redux/slice/userSlice'

export const Logout = ({ logout, setLogout }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser()); // Limpiar el estado de Redux
    setLogout(false);
    navigate('/'); // Redirigir a la página de inicio (o login)
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
