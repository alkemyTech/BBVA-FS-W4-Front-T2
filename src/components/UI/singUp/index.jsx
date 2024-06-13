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
import fondoRegistro from "../../../assets/fondoLogin.svg";
import fondoRegistroClosedEyes from "../../../assets/gatoOjosCerrados.svg";
import LoadingCat from "../../../assets/components/loadingCat";
import { useImageLoader } from "../../../utils/useImageLoader";

export default function Registro() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({
    firstName: false,
    lastName: false,
    birthDate: false,
    userName: false,
    password: false,
    confirmPassword: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false); // Nuevo estado
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const imagesLoaded = useImageLoader([fondoRegistro, fondoRegistroClosedEyes]);

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
    setIsSubmitted(true); // Indicar que se ha enviado el formulario

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
        password: !password,
        firstName: !firstName,
        lastName: !lastName,
        confirmPassword: !confirmPassword,
        birthDate: !birthDate,
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
      return; // Prevenir el envío del formulario
    }

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
        // setsuccefull
      } else {
        setErrorMessage("Error en el registro");
        console.error("Error en el registro");
      }
    } catch (error) {
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
            {isSubmitted && (error.userName || error.password || error.birthDate || error.lastName || error.confirmPassword) && (
              <Alert severity="error">{errorMessage}</Alert>
            )}
            <TextField
              label="Nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={isSubmitted && error.firstName}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
              label="Correo Electrónico"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              error={isSubmitted && error.userName}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={isSubmitted && error.password}
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
              ¿Ya tienes cuenta?{" "}
              <Link to="/login">Volver a inicio de sesión</Link>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}
