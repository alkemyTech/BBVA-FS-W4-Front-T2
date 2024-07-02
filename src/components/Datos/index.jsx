import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, TextField, Button, Typography, Tooltip, List, ListItem, ListItemText, InputAdornment, IconButton } from '@mui/material';
import { setUser } from '../../Redux/slice/userSlice';
import { fetchBirthDate, updateUser } from '../../utils/Auth';
import { useNavigate } from 'react-router-dom';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { CheckSharp, ClearSharp, Visibility, VisibilityOff } from '@mui/icons-material';
import './datos.css';
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
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
    const [initialPassword, setInitialPassword] = useState('********');
    const [password, setPassword] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);
    
    const requirements = useMemo(() => [
        { regex: /.{8,}/, text: "Al menos 8 caracteres" },
        { regex: /[0-9]/, text: "Al menos 1 número (0...9)" },
        { regex: /[a-z]/, text: "Al menos 1 letra minúscula (a...z)" },
        { regex: /[A-Z]/, text: "Al menos 1 letra mayúscula (A...Z)" },
    ], []);
    
    const [allRequirementsMet, setAllRequirementsMet] = useState(false);
    
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
            setInitialPassword('********');
            setPassword('');
        }
    }, [user]);
    
    useEffect(() => {
        const allMet = requirements.every((req) => req.regex.test(password));
        setAllRequirementsMet(allMet);
    }, [password, requirements]);
    
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
            updatedUserData.password = password || userData.password;
            const updatedUser = await updateUser(user.id, updatedUserData);
            dispatch(setUser(updatedUser));
            console.log('Datos actualizados:', updatedUser);
            setIsEditing(false);
            setShowNotification(true);
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            console.error('Error al guardar los datos:', error);
        }
    };
    
    const handleEditClick = () => {
        if (isEditing) {
            handleSave();
        }
        setIsEditing(!isEditing);
        setShowPassword(true);
    };
    
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    
    const handleFocus = () => {
        setTooltipOpen(true);
    };
    
    const handleBlur = () => {
        setTooltipOpen(false);
    };
    return (
        <Box
            className="box-principal"
            sx={{
                backgroundImage: showPassword ? 'url(/src/assets/meowOjosCerrados.svg)' : 'url(/src/assets/meow.svg)',
            }}
        >
            <Box className="titulo" display="flex" alignItems="center" margin={2} justifyContent="center">
                <Typography sx={{ color: "#1565C0" }} margin={1} variant="h4" gutterBottom >
                    Mi Perfil
                </Typography>
                <AccountBoxIcon sx={{ fontSize: 35, color: "#1565C0" }} />
            </Box>
            <Box className="columnauno" component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
            </Box>
            <Box className="columnados" component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                <Tooltip
                    title={
                        <List dense>
                            {requirements.map((req, index) => (
                                <ListItem key={index}>
                                    {req.regex.test(password) ? (
                                        <CheckSharp color="success" />
                                    ) : (
                                        <ClearSharp color="error" />
                                    )}
                                    <ListItemText primary={req.text} />
                                </ListItem>
                            ))}
                        </List>
                    }
                    arrow
                    placement="top"
                    open={tooltipOpen}
                >
                    <TextField
                        label="*************"
                        variant="outlined"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={handlePasswordChange}
                        disabled={!isEditing}
                        fullWidth
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment>
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        sx={{ "&:focus": { outline: "none" } }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Tooltip>
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