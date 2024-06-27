import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../../Redux/slice/transactionSlice";
import {
  CircularProgress,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
  MenuItem,
  Grid,
  List,
  Paper,
  Pagination,
} from "@mui/material";
import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
} from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CatLoader from "../../UI/CatLoader/catLoader";
import "dayjs/locale/es";
import { esES } from "@mui/x-date-pickers/locales";

const Movimientos = () => {
  const dispatch = useDispatch();
  const { transactions, status, error, currentPage, totalPages } = useSelector(
    (state) => state.transactions
  );
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [filters, setFilters] = useState({
    fromDate: null,
    toDate: null,
    transactionType: "",
    currency: "",
  });

  useEffect(() => {
    dispatch(fetchTransactions({ page: 0 }));
  }, [dispatch]);

  const getIcon = (type) => {
    switch (type) {
      case "DEPOSIT":
        return <ArrowUpwardOutlined sx={{ color: "green", fontSize: 40 }} />;
      case "PAYMENT":
        return <ArrowDownwardOutlined sx={{ color: "red", fontSize: 40 }} />;
      default:
        return <ArrowUpwardOutlined sx={{ color: "green", fontSize: 40 }} />;
    }
  };

  const formatAmount = (amount, type) => {
    const formattedAmount = amount.toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return type === "PAYMENT" ? `- ${formattedAmount}` : `+ ${formattedAmount}`;
  };

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleApplyFilters = () => {
    dispatch(fetchTransactions({
      page: 0,
      fromDate: filters.fromDate ? filters.fromDate.format("YYYY-MM-DD") : "",
      toDate: filters.toDate ? filters.toDate.format("YYYY-MM-DD") : "",
      transactionType: filters.transactionType,
      currency: filters.currency,
    }));
  };

  const handlePageChange = (event, value) => {
    dispatch(fetchTransactions({ page: value - 1, ...filters }));
  };

  if (status === "loading") {
    return <CatLoader />;
  }

  if (status === "failed") {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <Paper
        sx={{
          padding: 3,
          minWidth: 100,
          maxWidth: 200,
          boxShadow: 3,
          height: 400,
          marginTop: 9,
          backgroundColor: "#f8f8f8",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Filtros
        </Typography>
        <Grid container spacing={2.5}>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="es"
            localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
          >
            <Grid item xs={12}>
              <DatePicker
                label="Desde"
                value={filters.fromDate}
                onChange={(newValue) => handleFilterChange("fromDate", newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
                format="DD/MM/YYYY"
              />
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                label="Hasta"
                value={filters.toDate}
                onChange={(newValue) => {
                  if (newValue && newValue.isBefore(filters.fromDate)) {
                    alert("La fecha Hasta no puede ser anterior a la fecha Desde.");
                  } else {
                    handleFilterChange("toDate", newValue);
                  }
                }}
                renderInput={(params) => <TextField {...params} fullWidth />}
                format="DD/MM/YYYY"
                minDate={filters.fromDate}
              />
            </Grid>
          </LocalizationProvider>
          <Grid item xs={12}>
            <TextField
              label="Tipo"
              name="transactionType"
              value={filters.transactionType}
              onChange={(e) => handleFilterChange(e.target.name, e.target.value)}
              select
              fullWidth
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="DEPOSIT">Depósito</MenuItem>
              <MenuItem value="PAYMENT">Pago</MenuItem>
              <MenuItem value="INCOME">Ingreso</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Moneda"
              name="currency"
              value={filters.currency}
              onChange={(e) => handleFilterChange(e.target.name, e.target.value)}
              select
              fullWidth
              sx={{ marginBottom: 2 }}
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="ARS">ARS</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleApplyFilters}
              fullWidth
            >
              Aplicar Filtros
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Box sx={{ padding: 2, textAlign: "right" }}>
        <Typography variant="h4" gutterBottom>
          Transacciones
        </Typography>
        {transactions.length === 0 ? (
          <Typography variant="h3">
            No hay transacciones para mostrar.
          </Typography>
        ) : (
          <Box
            sx={{
              overflow: "auto",
              minHeight: 400,
              maxHeight: 450,
              width: 950,
              borderRadius: "10px",
              backgroundColor: "#f8f8f8",
              boxShadow: 3,
            }}
          >
            <List>
              {transactions.map((transaction, index) => (
        <Card
        key={index}
        sx={{
          margin: 2,
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          backgroundColor: "#f8f8f8",
        }}
        onClick={() =>
          setExpandedIndex(expandedIndex === index ? null : index)
        }
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CardActions
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 0, // Ajusta el margen derecho para reducir espacio
            }}
          >
            {getIcon(transaction.tipoDeTransaccion)}
          </CardActions>
          <CardContent sx={{ flexGrow: 1 }}>
            <div style={{display:"flex", justifyContent:"space-between"}}>
            <Typography
              align="center"
              variant="h5"
              sx={{
                color:
                  transaction.tipoDeTransaccion === "PAYMENT"
                    ? "red"
                    : "green",
                marginLeft: 2,  // Ajusta el espacio entre el icono y el monto
              }}
            >
              {formatAmount(
                transaction.amount,
                transaction.tipoDeTransaccion
              )}
            </Typography>
            <Typography
              component="span"
              color="textPrimary"
              variant="body1"
            >
              <strong>Descripción:</strong> {transaction.descripcion}
            </Typography>
            </div>
     
           
            {expandedIndex === index && (
              <>
                <Typography color="textPrimary">
                  <strong>Destino:</strong> {transaction.destino}
                </Typography>
                <Typography color="textPrimary">
                  <strong>Origen:</strong> {transaction.origen}
                </Typography>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >
                  <strong>Tipo:</strong>{" "}
                  {transaction.tipoDeTransaccion}
                </Typography>
                <br />
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >
                  <strong>Moneda:</strong> {transaction.currency}
                </Typography>
                <br />
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >
                  <strong>Fecha:</strong>{" "}
                  {transaction.fechaDeTransaccion}
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
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage + 1}
            onChange={handlePageChange}
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#fff",
              },
              "& .Mui-selected": {
                backgroundColor: "#1565c0",
                color: "#000",
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Movimientos;