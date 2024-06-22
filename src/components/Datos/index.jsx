import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, TextField, Button, Typography, Card, CardContent, Grid } from '@mui/material';
import { setUser } from '../../Redux/slice/userSlice';
import './datos.css';

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
        <Box className="box-principal">

            <Typography className="titulo" margin={2} variant="h4" gutterBottom>
                Mi Perfil
            </Typography>
            <Box className="columnauno" component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, }}>
                <TextField
                    label="Nombre"
                    variant="outlined"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleChange}
                    disabled
                    fullWidth
                />

                <TextField
                    label="DNI"
                    variant="outlined"
                    name="DNI"
                    value={userData.DNI}
                    onChange={handleChange}
                    disabled
                    fullWidth
                />

                <TextField
                    label=""
                    variant="outlined"
                    name="email"
                    value={userData.email}
                    disabled
                    fullWidth

                />
            </Box>

            <Box className="columnados" component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, }}>
                <TextField
                    label="Apellido"
                    variant="outlined"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleChange}
                    disabled
                    fullWidth
                />
                <TextField
                    label="Edad"
                    variant="outlined"
                    name="edad"
                    value={userData.edad}
                    onChange={handleChange}
                    disabled
                    fullWidth
                />

                <TextField
                    label="Teléfono"
                    variant="outlined"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    fullWidth
                />
            </Box>

            
        </Box>


    );
};

export default DatosUser;

