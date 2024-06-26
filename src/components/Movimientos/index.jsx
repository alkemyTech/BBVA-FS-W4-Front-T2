import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../../Redux/slice/transactionSlice';
import {
  CircularProgress,
  Typography,
  Box,
  List,
  Card,
  CardContent,
  CardActions
} from '@mui/material';

import { ArrowDownwardOutlined, ArrowUpwardOutlined } from '@mui/icons-material';
import CatLoader from '../../UI/CatLoader/catLoader';

const Movimientos = () => {
  const dispatch = useDispatch();
  const { transactions, status, error } = useSelector((state) => state.transactions);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    dispatch(fetchTransactions({ page: 0 }));
  }, [dispatch]);

  const getIcon = (type) => {
    switch (type) {
      case 'DEPOSIT':
        return <ArrowUpwardOutlined sx={{ color: 'green', fontSize: 40 }} />;
      case 'PAYMENT':
        return <ArrowDownwardOutlined sx={{ color: 'red', fontSize: 40 }} />;
      default:
        return <ArrowUpwardOutlined sx={{ color: 'green', fontSize: 40 }} />;
    }
  };

  const formatAmount = (amount, type) => {
    const formattedAmount = amount.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return type === 'PAYMENT' ? `- ${formattedAmount}` : `+ ${formattedAmount}`;
  };

  if (status === 'loading') {
    return <CatLoader />;
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
        <Typography variant='h3'>No hay transacciones para mostrar.</Typography>
      ) : (
        <Box sx={{ overflow: "auto", minHeight: 450, maxHeight: 650, width: 1000, borderRadius: "10px", bgcolor: "background.paper", boxShadow: 3 }}>
          <List>
            {transactions.map((transaction, index) => (
              <Card
                key={index}
                sx={{ margin: 2, display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CardActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getIcon(transaction.tipoDeTransaccion)}
                  </CardActions>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center', width: '100%' }}>
                      <Typography align="center" variant="h5" sx={{ color: transaction.tipoDeTransaccion === 'PAYMENT' ? 'red' : 'green', width: '100%' }}>
                        {formatAmount(transaction.amount, transaction.tipoDeTransaccion)}
                      </Typography>
                    </Box>
                    <Typography component="span" color="textPrimary" variant="body1">
                      <strong>Descripción:</strong> {transaction.descripcion}
                    </Typography>
                    {expandedIndex === index && (
                      <>
                        <Typography color="textPrimary">
                          <strong>Destino:</strong> {transaction.destino}
                        </Typography>
                        <Typography color="textPrimary">
                          <strong>Origen:</strong> {transaction.origen}
                        </Typography>
                        <Typography component="span" variant="body2" color="textPrimary">
                          <strong>Tipo:</strong> {transaction.tipoDeTransaccion}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="textPrimary">
                          <strong>Moneda:</strong> {transaction.currency}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="textPrimary">
                          <strong>Fecha:</strong> {transaction.fechaDeTransaccion}
                        </Typography>
                      </>
                    )}
                  </CardContent>
                </Box>
              </Card>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default Movimientos;
