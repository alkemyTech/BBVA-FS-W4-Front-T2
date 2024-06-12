import * as React from "react";
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
} from "@mui/material";
import { CheckSharp, ClearSharp } from "@mui/icons-material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import fondoRegistro from "../../../assets/fondoLogin.svg"; // Asegúrate de que la ruta es correcta
import fondoRegistroClosedEyes from "../../../assets/gatoOjosCerrados.svg"; // Asegúrate de que la ruta es correcta
import LoadingCat from "../../../assets/components/loadingCat"; // Asegúrate de que la ruta es correcta
import { useImageLoader } from "../../../utils/useImageLoader";

export default function Registro() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({firstName:false, lastName:false, birthDate:false ,userName:false, password:false, confirmPassword:false });
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const imagesLoaded = useImageLoader([fondoRegistro, fondoRegistroClosedEyes]);

  //ESTO SEGURO SE PUEDE PASAR A UN UTILS
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
  ///////////////////////////////////////////////////////////////////
  const handleRegistro = async (event) => {
    event.preventDefault();
    if (
      !firstName ||
      !lastName ||
      !birthDate ||
      !userName ||
      !password ||
      !confirmPassword 
    ) {
      setError({
        userName: !userName,
        password:!password,
        firstName:!firstName,
        lastName:!lastName,
        confirmPassword:!confirmPassword,
        birthDate:!birthDate
      });
      setErrorMessage("Todos los campos son necesarios");
      return;
    }

    if (password !== confirmPassword) {
      setError({
        userName: !userName,
        password:!password,
        firstName:!firstName,
        lastName:!lastName,
        confirmPassword:!confirmPassword,
        birthDate:!birthDate
      });
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }

    // Formatear la fecha de nacimiento al formato dd-mm-yyyy
    const [year, month, day] = birthDate.split("-");
    const formattedBirthDate = `${day}-${month}-${year}`;

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          password,
          firstName,
          lastName,
          birthDate: formattedBirthDate,
        }),
      });

      if (response.ok) {
        console.log("Registro exitoso");
        setError({
          userName: !userName,
          password:!password,
          firstName:!firstName,
          lastName:!lastName,
          confirmPassword:!confirmPassword,
          birthDate:!birthDate
        });
      } else {
        setError({
          userName: !userName,
          password:!password,
          firstName:!firstName,
          lastName:!lastName,
          confirmPassword:!confirmPassword,
          birthDate:!birthDate
        });
        setErrorMessage("Error en el registro");
        console.error("Error en el registro");
      }
    } catch (error) {
      setError({
        userName: !userName,
        password:!password,
        firstName:!firstName,
        lastName:!lastName,
        confirmPassword:!confirmPassword,
        birthDate:!birthDate
      });
      setErrorMessage("Error de red: no se pudo conectar con el servidor");
      console.error("Error de red:", error);
    }
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
            <Typography variant="body1" gutterBottom>
              Crea una nueva cuenta
            </Typography>
            {error && <Alert severity="error">{errorMessage}</Alert>}
            <TextField
              label="Nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={error && firstName === ""}
              helperText={
                error && firstName === "" ? "El nombre es necesario" : ""
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={error && lastName === ""}
              helperText={
                error && lastName === "" ? "El apellido es necesario" : ""
              }
              fullWidth
              margin="normal"
            />
            <TextField
              
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              error={error && birthDate === ""}
              helperText={
                error && birthDate === ""
                  ? "La fecha de nacimiento es necesaria"
                  : ""
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Correo Electrónico"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              error={error && userName === ""}
              helperText={
                error && userName === ""
                  ? "El correo electrónico es necesario"
                  : ""
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error && password === ""}
              helperText={
                error && password === "" ? "La contraseña es necesaria" : ""
              }
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

            <List
              dense
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              }}
            >
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

            <TextField
              label="Confirmar Contraseña"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={error && confirmPassword === ""}
              helperText={
                error && confirmPassword === ""
                  ? "La confirmación de la contraseña es necesaria"
                  : ""
              }
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
              ¿Ya tienes cuenta?{" "}
              <Link to="/login">Volver a inicio de sesión</Link>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}
