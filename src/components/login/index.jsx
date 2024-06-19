import { useState } from "react";
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
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import fondoLogin from "../../assets/fondoLogin.svg"; // Asegúrate de que la ruta es correcta
import gatoOjosCerrados from "../../assets/gatoOjosCerrados.svg"; // Ajustar si es necesario
import LoadingCat from "../../assets/components/loadingCat"; // Ajustar si es necesario
import { useImageLoader } from "../../utils/useImageLoader";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../Redux/slice/userSlice";
import { login } from "../../utils/Auth";

export default function Login() {
  const [localUserName, setLocalUserName] = useState("");
  const [localPassword, setLocalPassword] = useState("");
  const [dni, setDni] = useState("");
  const [error, setError] = useState({ userName: false, password: false });
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const imagesLoaded = useImageLoader([fondoLogin, gatoOjosCerrados]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!localUserName || !localPassword || !dni) {
      setError({
        userName: !localUserName,
        password: !localPassword ,
        dni: !dni
      });
      setErrorMessage("Por favor, complete todo los campos");
      return;
    }
    try {
      const data = await login(localUserName, localPassword, dni);
        setError({ userName: false, password: false, dni:false });
        dispatch(setUser(data));
        navigate("/home");
      } catch (error) {
        setError({ userName: true, password: true, dni: true });
        setErrorMessage("Usuario, contraseña o DNI incorrectos");
        console.error("Error en el inicio de sesión", error);
      }
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

  if (!imagesLoaded) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
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
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        sx={{
          width: "1170px",
          display: "flex",
          margin: "auto",
          boxShadow: "0 14px 60px rgba(0, 0, 0, 0.06)",
          borderRadius: "10px",
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
          flexDirection: "row",
          alignItems: "stretch",
          backgroundImage: `url(${
            showPassword ? gatoOjosCerrados : fondoLogin
          })`,
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
              value={localUserName}
              onChange={handleUsernameChange}
              error={error.userName}
              fullWidth
              margin="normal"
            />
            <TextField
              label="DNI"
              value={dni}
              onChange={handleDniChange}
              error={error.dni}
              fullWidth
              margin="normal"
            />
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
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 2, mb: 2 }}
            >
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