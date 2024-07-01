import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, TextField, Button, Typography, Card, CardContent, Grid } from '@mui/material';
import { setUser } from '../../Redux/slice/userSlice';
import { fetchBirthDate, updateUser } from '../../utils/Auth';
import './datos.css';
import { useNavigate } from 'react-router-dom';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Asegura dos dígitos
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses son de 0 a 11, se suma 1
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};
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
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad de la contraseña




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
        setShowPasswordRequirements(true); // Mostrar el mensaje de validación al hacer clic en "Editar"
        setShowPassword(true); // Mostrar la contraseña en texto plano al hacer clic en "Editar"
    };


    const handlePasswordChange = (e) => {
        setPassword(e.target.value);

    };

    return (
        <Box className="box-principal">
            <Box className="titulo" display="flex" alignItems="center" margin={2} justifyContent="center">
                <Typography sx={{  color: "#1565c0;" }} margin={1} variant="h4" gutterBottom >
                    Mi Perfil
                </Typography>
                <AccountBoxIcon sx={{ fontSize: 35, color: "#1565c0;" }}  />
            </Box>
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
                    value={formatDate(userData.birthDate)}
                    onChange={handleChange}
                    disabled
                    fullWidth
                />

                <TextField
                    label="Contraseña"
                    variant="outlined"
                    name="password"
                    type={isEditing && showPassword ? 'text' : 'password'} // Mostrar la contraseña en texto plano si está en modo edición
                    value={isEditing ? password : initialPassword} // Mostrar contraseña editable si está en modo edición
                    onChange={handlePasswordChange}
                    disabled={!isEditing}
                    fullWidth
                />
                {isEditing && showPasswordRequirements && (
                    <Typography variant="body2" color="error">
                        Es necesario 8 caracteres, 1 número, 1 letra minúscula, 1 letra mayúscula
                    </Typography>
                )}
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