import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Grid,
  Alert,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { CheckSharp, ClearSharp } from "@mui/icons-material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import fondoRegistro from "../../assets/fondoLogin.svg";
import fondoRegistroClosedEyes from "../../assets/gatoOjosCerrados.svg";
import LoadingCat from "../../assets/components/loadingCat";
import { useImageLoader } from "../../utils/useImageLoader";
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../Redux/slice/userSlice';
import {register} from "../../utils/Auth";
import { useNavigate } from "react-router-dom";

export default function Registro() {
  const user = useSelector((state) => state.user);
  const { id, userName, firstName, lastName } = user;
  const [birthDate, setBirthDate] = useState("");
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({
    firstName: false,
    lastName: false,
    birthDate: false,
    userName: false,
    password: false,
    confirmPassword: false,
    dni: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const imagesLoaded = useImageLoader([fondoRegistro, fondoRegistroClosedEyes]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const requirements = useMemo(
    () => [
      { regex: /.{8,}/, text: "Al menos 8 caracteres" },
      { regex: /[0-9]/, text: "Al menos 1 número (0...9)" },
      { regex: /[a-z]/, text: "Al menos 1 letra minúscula (a...z)" },
      { regex: /[A-Z]/, text: "Al menos 1 letra mayúscula (A...Z)" },
    ],
    []
  );
  const [allRequirementsMet, setAllRequirementsMet] = useState(false);

  useEffect(() => {
    const allMet = requirements.every((req) => req.regex.test(password));
    setAllRequirementsMet(allMet);
  }, [password, requirements]);

  const handleRegistro = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);

    if (
      !firstName ||
      !lastName ||
      !birthDate ||
      !userName ||
      !dni ||
      !password ||
      !confirmPassword
    ) {
      setError({
        userName: !userName,
        password: !password,
        firstName: !firstName,
        lastName: !lastName,
        confirmPassword: !confirmPassword,
        birthDate: !birthDate,
        dni: !dni,
      });
      setErrorMessage("Todos los campos son necesarios");
      return;
    }

    if (password !== confirmPassword) {
      setError({
        password: true,
        confirmPassword: true,
      });
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }


    try {
      const data = await register(userName, firstName, lastName, birthDate, password, dni);
      setError({ userName: false, password: false, dni: false, firstName: false, lastName: false, birthDate: false });
      dispatch(setUser(data));
      console.log("Registro exitoso");
      navigate("/home");
    } catch (error) {
      if (error.response) {
        // Error de respuesta del servidor
        setError({ userName: true, password: true, dni: true, firstName: true, lastName: true, birthDate: true });
        setErrorMessage("Usuario, contraseña o DNI incorrectos");
        console.error("Error en el inicio de sesión", error);
      } else if (error.request) {
        // Error de red
        setErrorMessage("Error de red: no se pudo conectar con el servidor");
        console.error("Error de red:", error);
      } else {
        // Otro tipo de error
        setErrorMessage("Ocurrió un error inesperado");
        console.error("Error inesperado:", error);
      }
    }
    };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleFocus = () => {
    setTooltipOpen(true);
  };

  const handleBlur = () => {
    setTooltipOpen(false);
  };

  const handleChange = (field) => (e) => {
    dispatch(setUser({ ...user, [field]: e.target.value }));
  };

  if (!imagesLoaded) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#182346",
        }}
      >
        <LoadingCat />
      </Box>
    );
  }

  return (
    <Grid
      container
      sx={{
        height: "100vh",
        backgroundColor: "#182346",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        sx={{
          width: "1170px",
          display: "flex",
          background: "#fff",
          margin: "auto",
          boxShadow: "0 14px 60px rgba(0, 0, 0, 0.06)",
          borderRadius: "10px",
          overflow: "hidden",
          position: "relative",
          backgroundImage: `url(${
            showPassword ? fondoRegistroClosedEyes : fondoRegistro
          })`,
          backgroundSize: "cover",
          minHeight: "700px",
        }}
      >
        <Grid container>
          <Grid item xs={12} md={6} sx={{ padding: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Registro
            </Typography>
            {isSubmitted &&
              (error.userName ||
                error.password ||
                error.birthDate ||
                error.lastName ||
                error.confirmPassword ||
                error.dni) && (
                <Alert severity="error">{errorMessage}</Alert>
              )}
            <TextField
              label="Nombre"
              value={firstName}
              onChange={handleChange('firstName')}
              error={isSubmitted && error.firstName}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Apellido"
              value={lastName}
              onChange={handleChange('lastName')}
              error={isSubmitted && error.lastName}
              fullWidth
              margin="normal"
            />
            <TextField
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              error={isSubmitted && error.birthDate}
              fullWidth
              margin="normal"
            />
            <TextField
              label="DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              error={isSubmitted && error.dni}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Correo Electrónico"
              value={userName}
              onChange={handleChange('userName')}
              error={isSubmitted && error.userName}
              fullWidth
              margin="normal"
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
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={isSubmitted && error.password}
                fullWidth
                margin="normal"
                onFocus={handleFocus}
                onBlur={handleBlur}
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        sx={{
                          "&:focus": { outline: "none" },
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Tooltip>

            <TextField
              label="Confirmar Contraseña"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={isSubmitted && error.confirmPassword}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                      sx={{
                        "&:focus": { outline: "none" },
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              type="submit"
              fullWidth
              onClick={handleRegistro}
            >
              Registrarse
            </Button>
            <Typography variant="body2" sx={{ marginTop: 2 }}>
              ¿Ya tienes cuenta? <Link to="/">Volver a inicio de sesión</Link>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}