import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { styled } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import dayjs from "dayjs";
import "dayjs/locale/de";
import "dayjs/locale/en-gb";
import "dayjs/locale/zh-cn";
import Stack from "@mui/material/Stack";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useSelector, useDispatch } from "react-redux";
import { fetchAccounts } from "../../Redux/slice/accountSlice";
import Checkbox from "@mui/material/Checkbox";

import "./fixedTerm.css";

import Bubble from "../Calculadora";

export default function PlazoFijoSimulado() {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.account.accounts);
  const status = useSelector((state) => state.account.status);
  const error = useSelector((state) => state.account.error);
  const userId = 1;
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAccounts(userId));
    }
  }, [status, dispatch, userId]);

  function obtenerNombreDelMes(numeroMes) {
    const nombresMeses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    if (numeroMes < 1 || numeroMes > 12) {
      return "Número de mes inválido";
    }
    return nombresMeses[numeroMes - 1];
  }

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const [cuenta, setCuenta] = useState();
  const [monto, setMonto] = useState("");
  const [fechaInicial, setFechaInicial] = useState(dayjs());
  const [dias, setDias] = useState(30);
  const [errorMonto, setErrorMonto] = useState(false);
  const [errorDias, setErrorDias] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const handleCuenta = async (event) => {
    const value = event.target.value;
    setCuenta(value);

    try {
      const response = await fetch(
        `http://localhost:8080/accounts/select/${value}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const updatedToken = response.headers
          .get("Authorization")
          .split(" ")[1]; // Obtener el nuevo token del header
        localStorage.setItem("token", updatedToken); // Guardar el nuevo token en localStorage
      } else {
        console.error("Error al actualizar el token:", response.statusText);
      }
    } catch (error) {
      console.error("Error al actualizar el token:", error);
    }
  };

  const handleChangeMonto = (event) => {
    const value = event.target.value.replace(/\./g, "");
    const regex = /^(?!0\d)\d*$/;
    if (regex.test(value)) {
      if (value === "") {
        setMonto("");
      } else {
        setMonto(Number(value).toLocaleString("de-DE"));
      }
      setErrorMonto(false);
    } else {
      setErrorMonto(true);
    }
  };

  const handleFechaInicial = (event) => setFechaInicial(event.target.value);
  const handleChangeDias = (event) => {
    const value = event.target.value;
    const numericValue = parseInt(value, 10);

    if (value === "") {
      setDias(""); // Permitir que el campo esté vacío temporalmente
      setErrorDias(true); // Mostrar error si el campo está vacío
    } else if (!isNaN(numericValue)) {
      setDias(numericValue); // Actualizar el estado con el valor numérico
      setErrorDias(numericValue < 30); // Validar si los días son menos de 30
    }
  };

  const handleBlurDias = () => {
    if (dias === "") {
      setDias(30); // Establecer el valor predeterminado si el campo está vacío al perder el foco
      setErrorDias(false); // Limpiar el error si se establece el valor predeterminado
    }
  };

  const transformaFecha = (fecha) => {
    const { $M } = fecha;
    let dia = fecha.date();
    let mes = ($M + 1).toString();
    const año = fecha.year();

    if (mes < 10) {
      mes = "0" + mes;
    }

    if (dia < 10) {
      dia = "0" + dia;
    }

    return `${dia}/${mes}/${año}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const montoNumber = parseInt(monto.replace(/\./g, ""), 10);
    if (!montoNumber || montoNumber < 500) {
      setErrorMonto(true);
      return;
    }

    const creationDate = transformaFecha(fechaInicial);
    const closingDateCal = fechaInicial.add(dias, "day");
    const closingDate = transformaFecha(closingDateCal);

    const montoSinPuntos = monto.replace(/\./g, "");
    const invertedAmount = parseFloat(montoSinPuntos);

    const formData = {
      invertedAmount,
      creationDate,
      closingDate,
      accountId: cuenta, // Incluye la cuenta seleccionada en formData
    };

    try {
      const response = await fetch("http://localhost:8080/fixedTerm/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setSimulationResult(data);
        setOpen(true);
        console.log(formData);
      } else {
        console.error("Error al simular plazo fijo:", response.statusText);
      }
    } catch (error) {
      console.error("Error al simular plazo fijo:", error);
    }
  };
  const handleCreate = async () => {
    const creationDate = transformaFecha(fechaInicial);
    const closingDateCal = fechaInicial.add(dias, "day");
    const closingDate = transformaFecha(closingDateCal);

    const montoSinPuntos = monto.replace(/\./g, "");
    const invertedAmount = parseFloat(montoSinPuntos);

    const formData = {
      invertedAmount,
      creationDate,
      closingDate,
    };

    try {
      const response = await fetch("http://localhost:8080/fixedTerm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setSimulationResult(data);
        console.log("Plazo fijo creado:", data);
        setOpen(false);
        navigate("/home");
      } else {
        console.error("Error al crear plazo fijo:", response.statusText);
      }
    } catch (error) {
      console.error("Error al crear plazo fijo:", error);
    }
  };

  const handleAceptarTerminos = (event) => {
    setAceptaTerminos(event.target.checked);
  };

  const CustomButton = styled(Button)({
    backgroundColor: "#1565C0",
    color: "white",
    width: 216,
    height: 56,
    "&:hover": {
      backgroundColor: "#1565C0",
      border: "3px solid #46A044",
    },
    "&:focus": {
      backgroundColor: "#1565C0",
      outline: "none",
    },
  });

  const CustomButtonSecundario = styled(Button)({
    backgroundColor: "#2CABF3",
    color: "white",
    width: 150,
    height: 40,
    "&:hover": {
      backgroundColor: "#2CABF3",
      border: "3px solid #2CABF3",
    },
    "&:focus": {
      backgroundColor: "#2CABF3",
      outline: "none",
    },
  });

  const CustomButtonCrear = styled(Button)({
    backgroundColor: "#1565C0",
    color: "white",
    width: 150,
    height: 40,
    "&:hover": {
      backgroundColor: "#1565C0",
      border: "3px solid #46A044",
    },
    "&:focus": {
      backgroundColor: "#1565C0",
      outline: "none",
    },
  });

  const StyledArrowRightIcon = styled(ArrowRightIcon)`
    color: #0d99ff;
  `;

  return (
    <section className="box-principal-ft">
      <p className="titulo-plazo-fijo" fontSize="48">
        Simulá tu plazo fijo
      </p>
      <hr className="gray-line-top" />

      <article className="titulos">
        <p className="titulo-secundario cuenta">Cuenta Origen</p>
        <p className="titulo-secundario montoInvertir">Monto a invertir</p>
        <p className="titulo-secundario fechaInicio">Fecha Inicio Plazo Fijo</p>
        <p className="titulo-secundario diasInvertir">Días a invertir</p>
        <p className="titulo-secundario"></p>
      </article>

      <Box
        component="form"
        noValidate
        autoComplete="off"
        id="box-secundario"
        onSubmit={handleSubmit}
      >
        {/* Cuentas */}
        <div>
          <FormControl
            sx={{
              m: 1,
              minWidth: 216,
              minHeight: 48,
              "& .MuiInputBase-root": { backgroundColor: "#DBF0FF" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "transparent" },
                "&:hover fieldset": { borderColor: "transparent" },
                "&.Mui-focused fieldset": { borderColor: "#0D99FF" },
              },
            }}
            className="white-select"
          >
            <Select value={cuenta} onChange={handleCuenta}>
              {status === "loading" && <MenuItem>Cargando cuentas...</MenuItem>}
              {status === "succeeded" &&
                accounts.map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.accountType === "CAJA_AHORRO"
                      ? "Caja de Ahorro"
                      : account.accountType === "CUENTA_CORRIENTE"
                      ? "Cuenta Corriente"
                      : account.accountType}{" "}
                    {account.currency}
                  </MenuItem>
                ))}
              {status === "failed" && (
                <MenuItem>Error al cargar cuentas</MenuItem>
              )}
            </Select>
          </FormControl>
        </div>

        {/* Monto a invertir */}
        <div>
          <TextField
            required
            id="outlined-required"
            className="white-text-field"
            sx={{
              width: 216,
              height: 48,
              marginBottom: 1,
              "& .MuiInputBase-root": { backgroundColor: "#DBF0FF" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: errorMonto ? "red" : "transparent",
                },
                "&:hover fieldset": {
                  borderColor: errorMonto ? "red" : "transparent",
                },
                "&.Mui-focused fieldset": {
                  borderColor: errorMonto ? "red" : "#0D99FF",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            value={monto}
            onChange={handleChangeMonto}
            error={errorMonto}
            helperText={
              errorMonto
                ? "El monto ingresado tiene que ser mayor o igual a 500"
                : ""
            }
          />
        </div>

        {/* Calendario de Fecha de inicio */}
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={"en-gb"}
        >
          <Stack
            spacing={3}
            sx={{
              width: 216,
              m: 1,
              minWidth: 80,
              minHeight: 48,
              "& .MuiInputBase-root": { backgroundColor: "#DBF0FF" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "transparent" },
                "&:hover fieldset": { borderColor: "transparent" },
                "&.Mui-focused fieldset": { borderColor: "#0D99FF" },
              },
            }}
          >
            <DatePicker
              minDate={dayjs()}
              value={fechaInicial}
              onChange={(fechaInicial) => setFechaInicial(fechaInicial)}
            />
          </Stack>
        </LocalizationProvider>

        {/* Días a invertir */}
        <div>
          <TextField
            value={dias}
            onChange={handleChangeDias}
            sx={{
              m: 1,
              minWidth: 216,
              minHeight: 48,
              "& .MuiInputBase-root": { backgroundColor: "#DBF0FF" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "transparent" },
                "&:hover fieldset": { borderColor: "transparent" },
                "&.Mui-focused fieldset": { borderColor: "#0D99FF" },
              },
            }}
            className="white-select"
          ></TextField>
        </div>

        {/* Terminos y Condiciones */}

        {/* Boton simular */}
        <div>
          <CustomButton
            variant="outlined"
            onClick={handleSubmit}
            disabled={!cuenta || dias < 30}
          >
            Simular <StyledArrowRightIcon />
          </CustomButton>

          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              <p className="titulo-resumen-plazo-fijo">
                Resumen del Plazo Fijo
              </p>
            </DialogTitle>
            <DialogContent className="box-popup">
              <DialogContentText id="alert-dialog-description">
                {simulationResult && (
                  <span className="all-popup-box">
                    <article className="popup-text-box">
                      <span className="popup-text">
                        <p>Capital Invertido:</p>
                        <p>
                          ${" "}
                          {new Intl.NumberFormat("de-DE").format(
                            simulationResult.invertedAmount
                          )}
                        </p>
                      </span>
                      <span className="popup-text">
                        <p>Intereses Ganados:</p>
                        <p>
                          ${" "}
                          {parseFloat(simulationResult.gainedInterest)
                            .toFixed(2)
                            .replace(".00", "")
                            .replace(".", ",")
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
                        </p>
                      </span>
                      <span className="popup-text">
                        <p>Taza de interes:</p>
                        <p>0,2%</p>
                      </span>
                    </article>

                    <span className="popup-plazo-box">
                      <p>{dias} días</p>
                      <p id="popup-plazo-meses">
                        {fechaInicial.date()} de{" "}
                        {obtenerNombreDelMes(fechaInicial.month() + 1)} -{" "}
                        {simulationResult.closingDate.split("/")[0]} de{" "}
                        {obtenerNombreDelMes(
                          parseInt(
                            simulationResult.closingDate.split("/")[1],
                            10
                          )
                        )}
                      </p>
                    </span>
                  </span>
                )}
              </DialogContentText>
            </DialogContent>
            <DialogActions className="dialog-actions-box">
              <div className="popup-botones">
                <hr className="ayuda" />

                <span className="terminos-y-condiciones">
                  <p>
                    <Checkbox
                      checked={aceptaTerminos}
                      onChange={handleAceptarTerminos}
                      inputProps={label.inputProps}
                    />
                    Aceptar términos y condiciones
                  </p>
                </span>

                <CustomButtonSecundario onClick={handleClose}>
                  Cancelar
                </CustomButtonSecundario>

                <CustomButtonCrear
                  onClick={handleCreate}
                  autoFocus
                  disabled={!aceptaTerminos}
                >
                  Crear
                </CustomButtonCrear>
              </div>
            </DialogActions>
          </Dialog>
        </div>
      </Box>

      <p className="aviso">
        No olvide que los plazos fijos tienen un plazo minimo de 30 días <br />
        Terminos y Condiciones: No se puede mover este dinero hasta que no
        cumpla la fecha estipulada
      </p>
      <hr className="gray-line-bottom" />

      <Bubble />
    </section>
  );
}
