import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, TextField, Button, Typography, Card, CardContent, Grid } from '@mui/material';
import { setUser } from '../../Redux/slice/userSlice';

const DatosUser = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        DNI: '',
        edad: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        if (user) {
            setUserData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.userName,
                phone: user.phone,
                DNI: user.DNI,
                edad: user.edad,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = () => {
        dispatch(setUser(userData));
        console.log('Datos actualizados:', userData);
    };

    return (
        <Grid container justifyContent="center" sx={{ mt: 3, mb: 8 }}>
            <Grid item xs={12} sm={10} md={8} lg={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3.5 }}>
                            Mi Perfil
                        </Typography>
                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Nombre"
                                        variant="outlined"
                                        name="firstName"
                                        value={userData.firstName}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Apellido"
                                        variant="outlined"
                                        name="lastName"
                                        value={userData.lastName}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="DNI"
                                        variant="outlined"
                                        name="DNI"
                                        value={userData.DNI}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Edad"
                                        variant="outlined"
                                        name="edad"
                                        value={userData.edad}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Username / Correo"
                                        variant="outlined"
                                        name="email"
                                        value={userData.email}
                                        disabled
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Teléfono"
                                        variant="outlined"
                                        name="phone"
                                        value={userData.phone}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant="contained" color="primary" onClick={handleSave} fullWidth>
                                        Guardar
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default DatosUser;

