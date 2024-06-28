import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
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
import "./fixedTerm.css";


import Bubble from "../Calculadora"

export default function PlazoFijoSimulado() {
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
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    if (numeroMes < 1 || numeroMes > 12) {
      return "Número de mes inválido";
    }
    return nombresMeses[numeroMes - 1];
  }

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const [cuenta, setCuenta] = useState("");
  const [monto, setMonto] = useState("");
  const [fechaInicial, setFechaInicial] = useState(dayjs());
  const [dias, setDias] = useState(30);
  const [errorMonto, setErrorMonto] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  const handleCuenta = async (event) => {
    const value = event.target.value;
    setCuenta(value);
  
    try {
      const response = await fetch(`http://localhost:8080/accounts/select/${value}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.ok) {
        const updatedToken = response.headers.get('Authorization').split(' ')[1]; // Obtener el nuevo token del header
        localStorage.setItem('token', updatedToken); // Guardar el nuevo token en localStorage
      } else {
        console.error('Error al actualizar el token:', response.statusText);
      }
    } catch (error) {
      console.error('Error al actualizar el token:', error);
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
  const handleChangeDias = (event) => setDias(event.target.value);

  const transformaFecha = (fecha) => {
    const { $M } = fecha;
    let dia = fecha.date();
    let mes = ($M + 1).toString();
    const año = fecha.year();

    if(mes<10){
      mes = '0' + mes;
    }

    if(dia<10){
      dia = '0' + dia;
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

    const montoSinPuntos = monto.replace(/\./g, '');
    const invertedAmount = parseFloat(montoSinPuntos);
    
    const formData = {
      invertedAmount,
      creationDate,
      closingDate,
    };

    try {
      const response = await fetch("http://localhost:8080/fixedTerm/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
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

    const montoSinPuntos = monto.replace(/\./g, '');
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
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setSimulationResult(data);
        console.log("Plazo fijo creado:", data);
        setOpen(false);
        navigate('/home');
      } else {
        console.error("Error al crear plazo fijo:", response.statusText);
      }
    } catch (error) {
      console.error("Error al crear plazo fijo:", error);
    }
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
        <p className="titulo-secundario cuenta">Cuentas</p>
        <p className="titulo-secundario montoInvertir">Monto a invertir</p>
        <p className="titulo-secundario fechaInicio">Fecha Inicio Plazo Fijo</p>
        <p className="titulo-secundario diasInvertir">Días a invertir</p>
      </article>

      <Box component="form" noValidate autoComplete="off" id="box-secundario" onSubmit={handleSubmit}>
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
              {status === "succeeded" && accounts.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.accountType + " " + account.currency}
                </MenuItem>
              ))}
              {status === "failed" && <MenuItem>Error al cargar cuentas</MenuItem>}
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
                "& fieldset": { borderColor: errorMonto ? "red" : "transparent" },
                "&:hover fieldset": { borderColor: errorMonto ? "red" : "transparent" },
                "&.Mui-focused fieldset": { borderColor: errorMonto ? "red" : "#0D99FF" },
              },
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            value={monto}
            onChange={handleChangeMonto}
            error={errorMonto}
            helperText={
              errorMonto ? "El monto ingresado tiene que ser mayor o igual a 500" : ""
            }
          />
        </div>

        {/* Calendario de Fecha de inicio */}
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en-gb"}>
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

        {/* Boton simular */}
        <div>
          <CustomButton variant="outlined" onClick={handleSubmit}>
            Simular <StyledArrowRightIcon />
          </CustomButton>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Resumen del Plazo Fijo"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {simulationResult && (
                  <>
                    <p>Capital Invertido: {simulationResult.invertedAmount}</p>
                    <p>Intereses Ganados: {simulationResult.gainedInterest}</p>
                    <p>Taza de interes: 0.2%</p>
                    <p>Plazo: {fechaInicial.date()} de {obtenerNombreDelMes(fechaInicial.month() + 1)} - {simulationResult.closingDate.split("/")[0]} de {obtenerNombreDelMes(parseInt(simulationResult.closingDate.split("/")[1],10))}</p>
                    <p>{dias} días</p>
                  </>
                )}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <CustomButton onClick={handleClose}>Cancelar</CustomButton>
              <CustomButton onClick={handleCreate} autoFocus>
                Crear
              </CustomButton>
            </DialogActions>
          </Dialog>
        </div>
      </Box>
      <p className="aviso">
        Si la fecha de vencimiento cae un día no hábil, la misma se pasará{" "}
        <br /> al primer día hábil siguiente.
      </p>
      <hr className="gray-line-bottom" />

    
      <Bubble/>
    </section>
  );
}