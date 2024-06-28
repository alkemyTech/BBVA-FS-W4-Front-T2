import React from "react";
import { styled } from '@mui/material/styles';
import { Box, Grid, Typography, List, ListItem, Card, CardContent, Paper, Button } from "@mui/material";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';




const ListaPlazos = () => {
    // Datos estáticos para propósitos de visualización
    const movimientos = [
        {
            id: 1,
            capitalInvertido: 500000,
            tasaInteres: 5.5,
            plazoDias: 30,
            Fecha: "2024/03/12",
            moneda: "ARS",
        },
        {
            id: 2,
            capitalInvertido: 3000,
            tasaInteres: 4.5,
            plazoDias: 60,
            Fecha: "2024/05/19",
            moneda: "USD",
        },
        {
            id: 3,
            capitalInvertido: 3000,
            tasaInteres: 3.5,
            plazoDias: 90,
            Fecha: "2024/06/22",
            moneda: "USD",
        },
    ];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
        }).format(value);


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
    const handleSimulateClick = () => {
        navigate('/inversiones');
    };

    return (
        <Box sx={{ display: "flex", gap: 2 }}>
            <Paper
                sx={{
                    padding: 3,
                    minWidth: 200,
                    maxWidth: 200,
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
                <Box sx={{ textAlign: 'center', borderBottom: '2px solid #1565c0', paddingBottom: '10px', margin: '0 auto', width: 'fit-content' }}>
                    <Typography variant="h5" gutterBottom textAlign="center" sx={{ color: '#1565c0' }}>
                        ¿Aun no tenes un Plazo Fijo?
                    </Typography>
                    <Typography variant="h6" gutterBottom textAlign="center">
                        Inverti aca
                    </Typography>
                    {/* Aquí podrías agregar los filtros o contenido adicional si es necesario */}
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
                    width: '55%',
                    padding: 2,
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
                    {movimientos.map((movimiento) => (
                        <Grid item xs={12} key={movimiento.id}>
                            <Item>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                                            <strong>Capital Invertido:</strong> {formatCurrency(movimiento.capitalInvertido)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" sx={{ fontSize: '1.0rem' }}>
                                            <strong>Tasa de Interés:</strong> {movimiento.tasaInteres}%
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" sx={{ fontSize: '1.0rem' }}>
                                            <strong>Plazo/Días:</strong> {movimiento.plazoDias}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" sx={{ fontSize: '1.0rem' }}>
                                            <strong>Fecha:</strong> {movimiento.Fecha}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" sx={{ fontSize: '1.1rem' }}>
                                            <strong>Moneda:</strong> {movimiento.moneda}
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