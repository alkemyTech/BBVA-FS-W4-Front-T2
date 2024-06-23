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
import { useImageLoader } from "../../utils/useImageLoader";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../Redux/slice/userSlice";
import { login } from "../../utils/Auth";
import CatLoader from "../../UI/CatLoader/catLoader";

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
        }}
      >
        <CatLoader />
      </Box>
    );
  }

  return (
      <Grid 
        container 
        sx={{ 
          width: "980px", 
          boxShadow: "0 14px 60px rgba(0, 0, 0, 0.06)",  
          borderRadius: "10px",  
          backgroundImage: `url(${ showPassword ? gatoOjosCerrados : 
          fondoLogin})`,
          backgroundSize: "cover",
          minHeight: "300px",
          
        }}
        component="form"
        onSubmit={handleLogin}
      >
          <Grid item xs={6} sx={{ p: 4.5, mt:9}}>
            <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h4" component="h1" gutterBottom color={"primary"}>
              Iniciar Sesión
              </Typography>
            </Grid>
            {error.userName || 
              (error.password && <Alert severity="error">{errorMessage}</Alert>
            )}
            <Grid item xs={12}>
              <TextField
                label="Correo Electrónico"
                value={localUserName}
                onChange={handleUsernameChange}
                error={error.userName}
                helperText={
                 error.userName ? "El correo electrónico es necesario":""
               }
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
            <Grid item xs={12}>
              <FormControlLabel 
                
                control={<Checkbox name="rememberMe" />}
                label="Recuérdame"
                sx={{color: "black"}}
              />
              
            </Grid>
            <Grid item xs={12}>
            <Button variant="contained" type="submit" fullWidth >
              Iniciar Sesión
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" sx={{ mt: 1 }}>
              <Typography variant="body2">
                ¿Aún no tienes cuenta?
              </Typography>
              <Link href="/signUp" underline="hover">
                Regístrate aquí
              </Link>
            </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}/>
    </Grid> 
  );
}