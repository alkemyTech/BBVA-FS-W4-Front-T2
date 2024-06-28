import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, TextField, Button, Typography, Card, CardContent, Grid } from '@mui/material';
import { setUser } from '../../Redux/slice/userSlice';
import { fetchBirthDate, updateUser } from '../../utils/Auth';
import './datos.css';
import { useNavigate } from 'react-router-dom';


const DatosUser = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();


    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        DNI: '',
        email: '',
        password: '',
        birthDate: '',
    });

    const [initialPassword, setInitialPassword] = useState('********'); // Contraseña inicial mostrada
    const [password, setPassword] = useState(''); // Contraseña editable en modo edición
    const [isEditing, setIsEditing] = useState(false);
    const [showNotification, setShowNotification] = useState(false);



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
            setInitialPassword('********'); // Inicializa la contraseña inicial mostrada
            setPassword('');// Inicializa la contraseña editable
        }
    }, [user]);

    useEffect(() => {
        const fetchUserBirthDate = async () => {
            try {
                const birthDate = await fetchBirthDate(user.id);
                setUserData(prevUserData => ({
                    ...prevUserData,
                    birthDate: birthDate,
                }));
            } catch (error) {
                console.error('Error al obtener la fecha de nacimiento:', error);
            }
        };

        if (user.id) {
            fetchUserBirthDate();
        }
    }, [user.id]);

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };



    const handleSave = async () => {

        try {
            const updatedUserData = { ...userData };
            // Actualizar la contraseña sólo si se ha cambiado
            updatedUserData.password = password || userData.password;
            const updatedUser = await updateUser(user.id, updatedUserData);
            dispatch(setUser(updatedUser));
            console.log('Datos actualizados:', updatedUser);
            setIsEditing(false);
            setShowNotification(true);
            setTimeout(() => {
                navigate('/'); // Redirigir al login después de un breve retraso
            }, 1000); // 1 segundos de retraso para mostrar la notificación
        } catch (error) {
            console.error('Error al guardar los datos:', error);
        }
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
                    label="Email"
                    variant="outlined"
                    name="email"
                    value={userData.email}
                    disabled
                    InputLabelProps={{ shrink: true }} // Mantener el label arriba
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
                    label="Fecha de Nacimiento"
                    variant="outlined"
                    name="birthDate"
                    value={userData.birthDate}
                    onChange={handleChange}
                    disabled
                    fullWidth
                />

                <TextField
                    label="Contraseña"
                    variant="outlined"
                    name="password"
                    type="password"
                    value={isEditing ? password : initialPassword} // Mostrar contraseña editable si está en modo edición
                    onChange={handlePasswordChange}
                    disabled={!isEditing}
                    fullWidth
                />
                {/* Muestra el botón de editar o la notificación */}
                {showNotification ? (
                    <Box className="notification">
                        <Typography variant="body1" color="success.main">
                            Su contraseña fue guardada con éxito
                        </Typography>
                    </Box>
                ) : (
                    <Button onClick={handleEditClick} variant="contained">
                        {isEditing ? 'Guardar' : 'Editar'}
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default DatosUser;