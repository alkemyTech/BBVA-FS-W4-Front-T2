import React, { useEffect, useState } from "react";
import {
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import "./home.css";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useDispatch, useSelector } from "react-redux";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MovingIcon from "@mui/icons-material/Moving";
import ArrowUpwardOutlined from "@mui/icons-material/ArrowUpwardOutlined";
import ArrowDownwardOutlined from "@mui/icons-material/ArrowDownwardOutlined";
import CatLoader from "../../UI/CatLoader/catLoader";
import { fetchAccounts} from "../../Redux/slice/accountSlice";
import { SnackbarProvider, useSnackbar } from 'notistack';
import NoTransactionsImage from "../../assets/gatoSinDineroCeleste.svg";


const transactionTypeTranslations = {
  INCOME: "Ingreso",
  PAYMENT: "Pago",
  DEPOSIT: "Depósito",
};

const getIcon = (type) => {
  switch (type) {
    case "DEPOSIT":
      return (
        <ArrowUpwardOutlined
          sx={{
            color: "white",
            fontSize: 15,
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
            fontSize: 15,
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
            fontSize: 15,
            background: "green",
            borderRadius: "50px",
          }}
        />
      );
  }
};

import Bubble from "../Calculadora"

export default function Home() {
  const [data, setData] = useState(null);
  const userId = useSelector((state) => state.user.id);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/accounts/balance", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (userId) {
      dispatch(fetchAccounts(userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    const message = localStorage.getItem('snackbarMessage');
    const variant = localStorage.getItem('snackbarVariant');

    if (message && variant) {
      enqueueSnackbar(message, { variant });
      localStorage.removeItem('snackbarMessage');
      localStorage.removeItem('snackbarVariant');
    }
  }, [enqueueSnackbar]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Asegura dos dígitos
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses son de 0 a 11, se suma 1
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const userNameHome = useSelector(
    (state) => state.user.firstName + " " + state.user.lastName
  );
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  if (loading) {
    return <CatLoader />;
  }

  if (error) {
    return <Typography>Error: {error.message}</Typography>;
  }

  if (!data) {
    return <Typography>No data available</Typography>;
  }

  const sortedTransactions = data.accountTransactions.sort(
    (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
  );

  return (
    <div className="HomeContainer">
      <Grid item xs={12} md={4} className="bienvenido">
        <Typography variant="h2">¡Hola {userNameHome}!</Typography>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card className="card">
            <Grid
              item
              sx={12}
              className="status-card-inner status-card-bg-blue"
            >
              <Grid item sx={6}>
                <Typography variant="h4">Cuenta ARS</Typography>
                <Typography variant="h5">
                  {formatCurrency(data.accountArs)}
                </Typography>
              </Grid>
              <Grid item sx={6}>
                <AccountBalanceWalletIcon
                  sx={{ fontSize: "80px", opacity: "0.7" }}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="card">
            <Grid
              item
              sx={12}
              className="status-card-inner status-card-bg-green"
            >
              <Grid item sx={6}>
                <Typography variant="h4">Cuenta USD</Typography>
                <Typography variant="h5">
                  {formatCurrency(data.accountUsd)}
                </Typography>
              </Grid>
              <Grid item sx={6}>
                <AttachMoneyIcon sx={{ fontSize: "80px", opacity: "0.7" }} />
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="card">
            <Grid
              item
              sx={12}
              className="status-card-inner status-card-bg-read"
            >
              <Grid item sx={6}>
                <Typography variant="h4">Cuenta Plazos Fijos</Typography>
                <Typography variant="h5">
                  {formatCurrency(data.totalFixedTermDeposits)}
                </Typography>
              </Grid>
              <Grid item sx={6}>
                <MovingIcon sx={{ fontSize: "80px", opacity: "0.7" }} />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      {data.accountTransactions.length === 0 ? (
          <div>
            
            <img
              src={NoTransactionsImage}
              alt="No hay transacciones"
              style={{ width: "550px", alignContent: "center" }}
            />
            <Typography variant="h4" color={"#1565c0"} sx={{fontfamily: 'Segoe UI'}}>Aún no hay transacciones</Typography>
          </div>
        ) : (
          <TableContainer style={{ marginTop: "10vh" }} className="table-container">
          <Table className="table">
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Tipo de Transacción</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>CBU / Alias</TableCell>
              <TableCell>Moneda</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <b>{formatDate(transaction.transactionDate)}</b>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <div style={{ display: "flex"}}>
                    {getIcon(transaction.type)} &nbsp;
                    <div style={{ textAlign: "left" }}>
                      <b>
                        {transactionTypeTranslations[transaction.type] ||
                          transaction.type}
                      </b>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <b>{formatCurrency(transaction.amount)}</b>
                </TableCell>
                <TableCell>
                  <b>{transaction.originAccountCBU}</b>
                </TableCell>
                <TableCell>
                  <b>{transaction.currency}</b>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )}
      <Bubble/>
    </div>
  );
}

// Wrapping Home in SnackbarProvider
export function HomeWithSnackbar() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Home />
    </SnackbarProvider>
  );
}