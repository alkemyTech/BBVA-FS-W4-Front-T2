import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../../Redux/slice/transactionSlice';
import {
  CircularProgress,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Paper
} from '@mui/material';

import { ArrowDownwardOutlined, ArrowUpwardOutlined } from '@mui/icons-material';

const Movimientos = () => {
  const dispatch = useDispatch();
  const { transactions, status, error } = useSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchTransactions({ page: 0 }));
  }, [dispatch]);

  const getIcon = (type) => {
    switch (type) {
      case 'DEPOSIT':
        return <ArrowUpwardOutlined sx={{ color: 'blue' }} />;
      case 'PAYMENT':
        return <ArrowDownwardOutlined sx={{ color: 'red' }} />;
      default:
        return <ArrowUpwardOutlined sx={{ color: 'green' }} />;
    }
  };

  const formatAmount = (amount) => {
    return amount.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  if (status === 'loading') {
    return <CircularProgress />;
  }

  if (status === 'failed') {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Transacciones
      </Typography>
      {transactions.length === 0 ? (
        <Paper>
          <Typography variant='h3'>No hay transacciones para mostrar.</Typography>
        </Paper>
      ) : (
          <List sx={{overflow:"auto", minHeight:350, maxHeight:350, width:600, borderRadius:"40px",bgcolor:"background.paper"}}>
            {transactions.map((transaction, index) => (
              <div key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    {getIcon(transaction.tipoDeTransaccion)}
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <>
                        <Typography align="center">
                          ${formatAmount(transaction.amount)}
                        </Typography>
                        <Typography component="span" variant="body2">
                          <strong>Descripción:</strong> {transaction.descripcion}
                        </Typography>
                        <Typography>
                          <strong>Destino:</strong> {transaction.destino}
                        </Typography>
                        <Typography color="textPrimary">
                          <strong>Origen:</strong> {transaction.origen}
                        </Typography>
                        <Typography component="span" variant="body2">
                          <strong>Tipo:</strong> {transaction.tipoDeTransaccion}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          <strong>Moneda:</strong> {transaction.currency}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="textPrimary">
                          <strong>Fecha:</strong> {transaction.fechaDeTransaccion}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < transactions.length - 1 && <Divider variant="inset" component="li" />}
              </div>
            ))}
          </List>
      )}
    </Box>
  );
};

export default Movimientos;
