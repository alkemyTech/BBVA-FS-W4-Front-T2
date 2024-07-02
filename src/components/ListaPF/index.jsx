import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, Grid, Typography, Paper, Button } from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useNavigate } from "react-router-dom";
import NoTransactionsImage from "../../assets/gatoSinDineroCeleste.svg";
import Bubble from "../Calculadora";

const ListaPlazos = () => {
  const [plazosFijos, setPlazosFijos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/fixedTerm/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const plazosFijosConDias = data.map((plazo) => ({
          ...plazo,
          plazoDias: durationInDays(plazo.creationDate, plazo.closingDate),
          formattedCreationDate: formatDate(plazo.creationDate),
          formattedClosingDate: formatDate(plazo.closingDate),
        }));
        setPlazosFijos(plazosFijosConDias);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSimulateClick = () => {
    navigate("/simulated");
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);
  };

  const durationInDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: "#1565c0",
    fontFamily: "Roboto",
    marginBottom: theme.spacing(1),
    maxWidth: "600px",
    margin: "0 auto",
  }));

  return (
    <Grid container spacing={2} alignItems={"center"}>
      <Grid item xs={12} md={4}>
        <Paper
          sx={{
            padding: 3,
            width: 350,
            boxShadow: 3,
            borderRadius: "10px",
            height: 225,
            
            backgroundColor: "#f8f8f8",
            position:'sticky'
            
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              borderBottom: "2px solid #1565c0",
              marginBottom: 2,
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              textAlign="center"
              sx={{ color: "#1565c0" }}
            >
              ¿Aún no tienes un Plazo Fijo?
            </Typography>
            <Typography variant="h6" gutterBottom textAlign="center">
              Invierte aquí
            </Typography>
          </Box>
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSimulateClick}
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Simular <ArrowRightIcon />
            </Button>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={8}>
      <Typography variant="h5" gutterBottom textAlign="center" marginTop={'5vh'}>
            Mis Inversiones
          </Typography>
        <Box
          sx={{
            width: 800,
           
            marginBottom: "6vh",
            overflow: "auto",
            maxHeight: "68vh", 
            // Ajusta la altura máxima según sea necesario
          }}
        >
          

          {plazosFijos.length === 0 ? (
            <Paper sx={{ padding: 3, textAlign: "center", boxShadow: 3 }}>
              <img
                src={NoTransactionsImage}
                alt=""
                style={{ width: 800, maxWidth: 550, marginBottom: 16 }}
              />
              <Typography
                variant="h4"
                color="#1565c0"
                sx={{ fontFamily: "Segoe UI" }}
              >
                Aún no hay movimientos
              </Typography>
            </Paper>
          ) : (
            <Grid
              container
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 3, md: 4 }}
            >
              {plazosFijos.map((plazo) => (
                <Grid item xs={12} key={plazo.id}>
                  <Paper sx={{ padding: 2, boxShadow: 3, backgroundColor:'#f8f8f8' ,color: "#1565c0" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                          <strong>Capital Invertido:</strong>{" "}
                          {formatCurrency(plazo.amount)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ fontSize: "1.0rem" }}>
                          <strong>Tasa de Interés:</strong> {plazo.interest}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ fontSize: "1.0rem" }}>
                          <strong>Plazo/Días:</strong> {plazo.plazoDias}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ fontSize: "1.0rem" }}>
                          <strong>Fecha de Creación:</strong>{" "}
                          {plazo.formattedCreationDate}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ fontSize: "1.1rem" }}>
                          <strong>Fecha de Cierre:</strong>{" "}
                          {plazo.formattedClosingDate}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Grid>
      <Bubble />
    </Grid>
  );
};

export default ListaPlazos;
