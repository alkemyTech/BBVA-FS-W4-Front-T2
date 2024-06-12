import React, { useState } from "react";
import { Box, Paper, TextField, Button, Typography, IconButton, InputAdornment, Checkbox, FormControlLabel, Link, Grid, Alert} from '@mui/material';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import fondoLogin from "../../../assets/fondoLogin.svg"; // Asegúrate de que la ruta es correcta
import gatoOjosCerrados from "../../../assets/gatoOjosCerrados.svg"; // Ajustar si es necesario
import LoadingCat from "../../../assets/components/loadingCat"; // Ajustar si es necesario
import { useImageLoader } from "../../../utils/useImageLoader";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

export default function Login() {
  const user = useSelector((state) => state.user);
  const [localUser, setLocalUser] = useState({ userName: '', password: '' });
  const { userName, password } = localUser;
  const [error, setError] = useState({ userName: false, password: false });
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const imagesLoaded = useImageLoader([fondoLogin, gatoOjosCerrados]);

  const dispatch = useDispatch();

  const navigate = useNavigate(); // Initialize useNavigate


  const handleLogin = async (event) => {
    event.preventDefault();
    if (!userName || !password) {
      setError({
        userName: !userName,
        password: !password,
      });
      setErrorMessage("El correo electrónico y la contraseña son necesarios");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, password }),
      });

      if (response.ok) {
        const token = response.headers.get("AUTHORIZATION");
        localStorage.setItem("token", token);
        console.log("Inicio de sesión exitoso");
        setError({ userName: false, password: false });
        navigate("/home"); // Redirect to /home on successful login
      } else {
        setError({ userName: true, password: true });
        setErrorMessage("Usuario o contraseña incorrectos");
        console.error("Error en el inicio de sesión");
      }
    } catch (error) {
      setError({ userName: true, password: true });
      setErrorMessage("Error de red: no se pudo conectar con el servidor");
      console.error("Error de red:", error);
    }
  };

  const handleUsernameChange = (e) => {
    setLocalUser({ ...localUser, userName: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setLocalUser({ ...localUser, password: e.target.value });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
          zIndex: 1,
          flexDirection: "row",
          alignItems: "stretch",
          backgroundImage: `url(${showPassword ? gatoOjosCerrados : fondoLogin})`,
          backgroundSize: "cover",
          minHeight: "700px",
        }}
      >
        <Grid container sx={{ flex: 1 }}>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: 3,
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Iniciar Sesión
            </Typography>
            {error.userName || error.password ? (
              <Alert severity="error">{errorMessage}</Alert>
            ) : null}
            <TextField
              label="Correo Electrónico"
              value={userName}
              onChange={handleUsernameChange}
              error={error.userName}
              helperText={
                error.userName ? "El correo electrónico es necesario" : ""
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              error={error.password}
              helperText={error.password ? "La contraseña es necesaria" : ""}
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
            <Grid container justifyContent="space-between" alignItems="center" sx={{ mt: 2, mb: 2 }}>
              <FormControlLabel
                control={<Checkbox name="rememberMe" />}
                label="Recuérdame"
              />
              <Link href="/" underline="hover">
                ¿Olvidaste tu contraseña?
              </Link>
            </Grid>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              onClick={handleLogin}
            >
              Iniciar Sesión
            </Button>
            <Typography variant="body2" sx={{ mt: 2 }}>
              ¿Aún no tienes cuenta?{" "}
              <Link href="/signUp" underline="hover">
                Regístrate aquí
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}
