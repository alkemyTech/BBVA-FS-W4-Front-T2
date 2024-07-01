import React, { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import { Box, Grid, Typography, Paper, Button } from "@mui/material";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useNavigate } from "react-router-dom";

const ListaPlazos = () => {
    const [plazosFijos, setPlazosFijos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener el token de localStorage (asegúrate de implementar tu propia lógica para obtener el token)
        const token = localStorage.getItem('token');

        // Llamada al endpoint para obtener los plazos fijos
        fetch('http://localhost:8080/fixedTerm/all', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const plazosFijosConDias = data.map(plazo => ({
                ...plazo,
                plazoDias: durationInDays(plazo.creationDate, plazo.closingDate),
                formattedCreationDate: formatDate(plazo.creationDate),
                formattedClosingDate: formatDate(plazo.closingDate)
            }));
            setPlazosFijos(plazosFijosConDias);
        })
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleSimulateClick = () => {
        navigate('/simulated');
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
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: "#1565c0",
        fontFamily: "Roboto",
        marginBottom: theme.spacing(1),
        maxWidth: '600px', // Ajusta el ancho máximo de la card
        margin: '0 auto', // Centra la card en el contenedor
    }));

    const CustomButton = styled(Button)({
        backgroundColor: "#1565C0",
        color: "white",
        width: 216,
        height: 56,
        marginTop: '20px', // Espacio superior para separar del contenido
        "&:hover": {
            backgroundColor: "#1565C0",
            border: "3px solid #46A044",
        },
        "&:focus": {
            backgroundColor: "#1565C0",
            outline: "none",
        },
    });

    const StyledArrowRightIcon = styled(ArrowRightIcon)`
        color: #0d99ff;
    `;

    return (
        <Box sx={{ display: "flex" }}>
            <Paper
                sx={{
                    padding: 3,
                    minWidth: 200,
                    maxWidth: 400,
                    boxShadow: 3,
                    height: 180,
                    marginTop: 0,
                    backgroundColor: "#f8f8f8",
                    margin: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <Box sx={{ textAlign: 'center', borderBottom: '2px solid #1565c0',  margin: '0 auto',  }}>
                    <Typography variant="h5" gutterBottom textAlign="center" sx={{ color: '#1565c0' }}>
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

            <Box
                sx={{
                    width: '60%',
                    margin: 'auto', // Esto centra horizontalmente el Box
                    marginTop: '8vh',
                    marginBottom: '6vh',
                    marginLeft: '1vh',
                }}
            >
                <Typography variant="h5" gutterBottom textAlign="center">
                    Mis Inversiones
                </Typography>
                <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 3, md: 4 }}>
                    {plazosFijos.map((plazo) => (
                        <Grid item xs={12} key={plazo.id}>
                            <Item>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                                            <strong>Capital Invertido:</strong> {formatCurrency(plazo.amount)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" sx={{ fontSize: '1.0rem' }}>
                                            <strong>Tasa de Interés:</strong> {plazo.interest}%
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" sx={{ fontSize: '1.0rem' }}>
                                            <strong>Plazo/Días:</strong> {plazo.plazoDias}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" sx={{ fontSize: '1.0rem' }}>
                                            <strong>Fecha de Creación:</strong> {plazo.formattedCreationDate}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" sx={{ fontSize: '1.0rem' }}>
                                            <strong>Fecha de Cierre:</strong> {plazo.formattedClosingDate}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Item>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default ListaPlazos;
