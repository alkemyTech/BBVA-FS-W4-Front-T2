import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
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
import axios from "axios";

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = "tu_token_de_autorizacion";

    // Configurar axios con el token de autorización
    const axiosInstance = axios.create({
      baseURL: "http://localhost:8080",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    axiosInstance.get("/accounts/balance")
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error.message}</Typography>;
  }

  if (!data) {
    return <Typography>No data available</Typography>;
  }

  return (
    <>
      <Grid container spacing={3} style={{ marginTop: "20px" }}>
        <Grid item xs={12} md={4}>
          <Card style={{ backgroundColor: "#f5f5f5" }}>
            <CardContent>
              <Typography variant="h5">Account ARS</Typography>
              <Typography>{data.accountArs}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card style={{ backgroundColor: "#e0f7fa" }}>
            <CardContent>
              <Typography variant="h5">Account USD</Typography>
              <Typography>{data.accountUsd}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card style={{ backgroundColor: "#ffecb3" }}>
            <CardContent>
              <Typography variant="h5">Total Fixed Term Deposits</Typography>
              <Typography>{data.totalFixedTermDeposits}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Segunda parte: Tabla */}
      <TableContainer component={Paper} style={{ marginTop: "40px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transaction Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Origin Account CBU</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.accountTransactions.map(transaction => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.transactionDate}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.currency}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.originAccountCBU}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
