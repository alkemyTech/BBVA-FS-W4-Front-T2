import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, TextField, Button, Typography, Card, CardContent } from '@mui/material';
import { setUser } from '../../Redux/slice/userSlice';
import './datos.css';


const DatosUser = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        DNI: '',
        birthDate: '',
        email: '',
        password: '',
    });
    const [isEditing, setIsEditing] = useState(false);

    const [password, setPassword] = useState('');

    useEffect(() => {
        if (user) {
            setUserData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.userName,
                password: user.password,
                DNI: user.dni,
                birthDate: user.birthDate,
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
        const updatedUserData = { ...userData, password };
        dispatch(setUser(updatedUserData));
        console.log('Datos actualizados:', updatedUserData);
    };
    
    const handleEditClick = () => {
        if (isEditing) {
            handleSave();
        }
        setIsEditing(!isEditing);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
                    fullWidth
                />
                <TextField
                    label="Fecha de Nacimiento"
                    variant="outlined"
                    name="birthDate"
                    value={userData.edad}
                    onChange={handleChange}
                    disabled
                    fullWidth
                />

                <TextField
                    label="Contraseña"
                    variant="outlined"
                    name="password"
                    type="password"
                    value={userData.password}
                    onChange={handleChange}
                    disabled={!isEditing}
                    fullWidth
                />
               <Button onClick={handleEditClick} variant="contained">
                    {isEditing ? 'Guardar' : 'Editar'}
                </Button>

            </Box>

            
        </Box>


    );
};

export default DatosUser;
