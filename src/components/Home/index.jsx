import React, { useEffect, useState } from "react";
import {
  Card,
  Grid,
  Paper,
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
import { useDispatch, useSelector } from 'react-redux';
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MovingIcon from "@mui/icons-material/Moving";
import CatLoader from "../../UI/CatLoader/catLoader";
import { fetchAccounts} from "../../Redux/slice/accountSlice";

export default function Home() {
  const [data, setData] = useState(null);
  const userId = useSelector((state) => state.user.id);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  

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

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateString)
    );
  };

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

  return (
    <div className="HomeContainer">
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

      <TableContainer style={{ marginTop: "10vh" }} className="table-container">
        <Table className="table">
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Tipo de Transccion</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>CBU Destino</TableCell>
              <TableCell>Moneda</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.accountTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <b>{formatDate(transaction.transactionDate)}</b>
                </TableCell>
                <TableCell>
                  <b>{transaction.type}</b>
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
    </div>
  );
}
