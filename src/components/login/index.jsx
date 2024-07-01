import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Link,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import fondoLogin from "../../assets/fondoLogin.svg"; // Asegúrate de que la ruta es correcta
import gatoOjosCerrados from "../../assets/gatoOjosCerrados.svg"; // Ajustar si es necesario
import { useImageLoader } from "../../utils/useImageLoader";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../Redux/slice/userSlice";
import { login } from "../../utils/Auth";
import CatLoader from "../../UI/CatLoader/catLoader";
import "./Login.css"; // Import the CSS file for animations

export default function Login() {
  const [localUserName, setLocalUserName] = useState("");
  const [localPassword, setLocalPassword] = useState("");
  const [dni, setDni] = useState("");
  const [error, setError] = useState({ userName: false, password: false });
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const imagesLoaded = useImageLoader([fondoLogin, gatoOjosCerrados]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (!localUserName || !localPassword || !dni) {
      setError({
        userName: !localUserName,
        password: !localPassword,
        dni: !dni,
      });
      setErrorMessage("Por favor, complete todo los campos");
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }
    try {
      const data = await login(localUserName, localPassword, dni);
      setError({ userName: false, password: false, dni: false });
      dispatch(setUser(data));
      navigate("/home");
    } catch (error) {
      setError({ userName: true, password: true, dni: true });
      setErrorMessage("Usuario, contraseña o DNI incorrectos");
      setSnackbarOpen(true);
      console.error("Error en el inicio de sesión", error);
    }
    setLoading(false);
  };

  const handleUsernameChange = (e) => {
    setLocalUserName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setLocalPassword(e.target.value);
  };

  const handleDniChange = (e) => {
    setDni(e.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (!imagesLoaded) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CatLoader />
      </Box>
    );
  }

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      <Grid
        container
        sx={{
          width: "980px",
          boxShadow: "0 14px 60px rgba(0, 0, 0, 0.06)",
          borderRadius: "10px",
          backgroundImage: `url(${
            showPassword ? gatoOjosCerrados : fondoLogin
          })`,
          backgroundSize: "cover",
          minHeight: "300px",
        }}
        component="form"
        onSubmit={handleLogin}
      >
        <Grid item xs={6} sx={{ p: 4.5, mt: 9 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                color={"primary"}
              >
                Iniciar Sesión
              </Typography>
            </Grid>
            {error.userName ||
              (error.password && (
                <Alert severity="error">{errorMessage}</Alert>
              ))}
            <Grid item xs={12}>
              <TextField
                label="Correo Electrónico"
                value={localUserName}
                onChange={handleUsernameChange}
                error={error.userName}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="DNI"
                value={dni}
                onChange={handleDniChange}
                error={error.dni}
                fullWidth
                margin="normal"
                inputProps={{
                  inputMode: "numeric",
                  pattern: "\\d{8}", // Cambiado a 8 dígitos
                  maxLength: 8, // Ajustado a 8
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                value={localPassword}
                onChange={handlePasswordChange}
                error={error.password}
                fullWidth
                margin="dense"
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
            </Grid>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                disabled={loading}
                className={loading ? "button-loading" : ""}
              >
                Iniciar Sesión
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{color:"black"}}>¿Aún no tienes cuenta?</Typography>
                <Link
                  href="/signUp"
                  underline="hover"
                  sx={{
                    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
                  }}
                >
                  Regístrate aquí
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4} />
      </Grid>
    </>
  );
}
