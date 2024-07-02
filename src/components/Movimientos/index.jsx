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
import Bubble from "../Calculadora";
import NoTransactionsImage from "../../assets/gatoSinDinero.svg";

const Movimientos = () => {
  const dispatch = useDispatch();
  const { transactions, status, error, currentPage, totalPages } = useSelector(
    (state) => state.transactions
  );
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [filters, setFilters] = useState({
    fromDate: null,
    toDate: null,
    transactionType: "",
    currency: "",
  });

  useEffect(() => {
    const fetchInitialTransactions = async () => {
      await dispatch(fetchTransactions({ page: 0 }));
      setIsInitialLoading(false);
    };
    fetchInitialTransactions();
  }, [dispatch]);

  const getIcon = (type) => {
    switch (type) {
      case "DEPOSIT":
        return (
          <ArrowUpwardOutlined
            sx={{
              color: "white",
              fontSize: 40,
              background: "green",
              borderRadius: "50px",
            }}
          />
        );
      case "PAYMENT":
        return (
          <ArrowDownwardOutlined
            sx={{
              color: "white",
              fontSize: 40,
              background: "red",
              borderRadius: "50px",
            }}
          />
        );
      default:
        return (
          <ArrowUpwardOutlined
            sx={{
              color: "white",
              fontSize: 50,
              background: "green",
              borderRadius: "50px",
            }}
          />
        );
    }
  };

  const formatAmount = (amount, type) => {
    const formattedAmount = amount.toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return type === "PAYMENT" ? `- ${formattedAmount}` : `+ ${formattedAmount}`;
  };

  const getTransactionTypeText = (type) => {
    switch (type) {
      case "DEPOSIT":
        return "Depósito";
      case "PAYMENT":
        return "Pago";
      case "INCOME":
        return "Ingreso";
      default:
        return "Tipo desconocido";
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleApplyFilters = async () => {
    setIsProcessing(true);
    await dispatch(
      fetchTransactions({
        page: 0,
        fromDate: filters.fromDate ? filters.fromDate.format("YYYY-MM-DD") : "",
        toDate: filters.toDate ? filters.toDate.format("YYYY-MM-DD") : "",
        transactionType: filters.transactionType,
        currency: filters.currency,
      })
    );
    setIsProcessing(false);
  };

  const handlePageChange = (event, value) => {
    dispatch(fetchTransactions({ page: value - 1, ...filters }));
  };

  if (isInitialLoading) {
    return <CatLoader />;
  }
  if (status === "failed") {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ display: "flex", gap: 3 }}>
      <Paper
        sx={{
          padding: 3,
          minWidth: 100,
          maxWidth: 200,
          boxShadow: 3,
          borderRadius: "10px",
          height: 450,
          marginTop: 15,
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
            localeText={
              esES.components.MuiLocalizationProvider.defaultProps.localeText
            }
          >
            <Grid item xs={12}>
              <DatePicker
                label="Desde"
                value={filters.fromDate}
                onChange={(newValue) =>
                  handleFilterChange("fromDate", newValue)
                }
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
                    alert(
                      "La fecha Hasta no puede ser anterior a la fecha Desde."
                    );
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
              onChange={(e) =>
                handleFilterChange(e.target.name, e.target.value)
              }
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
              onChange={(e) =>
                handleFilterChange(e.target.name, e.target.value)
              }
              select
              fullWidth
              sx={{ marginBottom: 2 }}
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="ARS">ARS</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} >
          <Button
              variant="contained"
              color="primary"
              onClick={handleApplyFilters}
              fullWidth
              disabled={isProcessing}
              className={`button-registrar ${isProcessing ? 'button-loading' : ''}`}
            >
              {isProcessing ? 'Procesando...' : 'Aplicar Filtros'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Box sx={{ flex: 1, marginLeft: 2 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "right", padding: 2 }}
        >
          Transacciones
        </Typography>
        {transactions.length === 0 ? (
          <Box sx={{ textAlign: "center", padding: 2 }}>
            <img
              src={NoTransactionsImage}
              alt="No hay transacciones"
              style={{ width: "750px", marginBottom: "16px" }}
            />
            <Typography variant="h4">Aún no hay transacciones</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              overflow: "auto",
              minHeight: 525,
              maxHeight: 525,
              width: 850,
              borderRadius: "10px",
              backgroundColor: "#f8f8f8",
              boxShadow: 3,
              marginBottom: 2,
            }}
          >
            <List>
              {transactions.map((transaction, index) => (
                <Card
                  key={index}
                  sx={{
                    margin: 1,
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    backgroundColor: "#ffffff",
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
                        marginRight: 0,
                        marginLeft: 2,
                        backgroundColor: "#ffffff",
                      }}
                    >
                      {getIcon(transaction.tipoDeTransaccion)}
                    </CardActions>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        marginLeft={1}
                        marginRight={2}
                      >
                        <Typography variant="h6">
                          {transaction.nombreDestino}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            color:
                              transaction.tipoDeTransaccion === "PAYMENT"
                                ? "red"
                                : "green",
                          }}
                        >
                          {formatAmount(
                            transaction.amount,
                            transaction.tipoDeTransaccion
                          )}
                        </Typography>
                      </Box>
                      <Box display={"flex"} justifyContent={"space-between"}>
                        <Box marginLeft={1} textAlign={"left"}>
                          <Typography variant="body1" color="textPrimary">
                            <strong>Descripción:</strong>{" "}
                            {transaction.descripcion}
                          </Typography>
                        </Box>
                        <Box marginRight={2}>
                          <Typography variant="body1" color="textPrimary">
                            <strong></strong>{" "}
                            {dayjs(transaction.fechaDeTransaccion).format(
                              "DD/MM/YYYY"
                            )}
                          </Typography>
                        </Box>
                      </Box>
                      {expandedIndex === index && (
                        <Box
                          display={"flex"}
                          justifyContent={"space-between"}
                          textAlign={"left"}
                        >
                          <Box marginLeft={1}>
                            <Typography variant="body1" color="textPrimary">
                              <strong>Tipo:</strong>{" "}
                              {getTransactionTypeText(
                                transaction.tipoDeTransaccion
                              )}
                            </Typography>
                            <Typography variant="body1" color="textPrimary">
                              <strong>Moneda:</strong> {transaction.currency}
                            </Typography>
                          </Box>
                          <Box marginRight={2} textAlign={"right"}>
                            <Typography variant="body2" color="textPrimary">
                              <strong>Destino:</strong> {transaction.destino}
                            </Typography>
                            <Typography variant="body2" color="textPrimary">
                              <strong>Origen:</strong> {transaction.origen}
                            </Typography>
                          </Box>
                        </Box>
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
      <Bubble />
    </Box>
  );
};

export default Movimientos;
