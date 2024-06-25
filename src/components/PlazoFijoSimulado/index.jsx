import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { styled } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState, useEffect } from "react";
import "./fixedTerm.css";

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

export default function PlazoFijoSimulado() {
  const [open, setOpen] = useState(false);

  

  const handleClose = () => {
    setOpen(false);
  };

  //Moneda elejida
  const [moneda, setMoneda] = useState("Pesos");
  //Cuenta Origen
  const [cuenta, setCuenta] = useState("Caja Ahorro");
  // monto ingresado por la persona
  const [monto, setMonto] = useState(0);
  //Fecha inicio
  const [fechaInicial, setFechaInicial] = useState(dayjs());
  // dias a invertir
  const [dias, setDias] = useState(30);
  //Mensaje error menor a 500
  const [error, setError] = useState(false);

  const handleMoneda = (event) => {
    setMoneda(event.target.value);
  };

  const handleCuenta = (event) => {
    setCuenta(event.target.value);
  };

  const handleChangeMonto = (event) => {
    const value = event.target.value;
    const regex = /^(?!0)\d*$/;
    if (regex.test(value)) {
      setMonto(value);
      setError(false);
    }
  };

  const handleFechaInicial = (event) => {
    setFechaInicial(event.target.value);
  };

  const handleChangeDias = (event) => {
    setDias(event.target.value);
  };


  const transformaFecha = (fecha) => {

      const {$M,} = fecha;
      const dia = fecha.date();
      const mes = ($M+1).toString();
      const año = fecha.year();
  
      return año+"-"+mes+"-"+dia;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!monto || monto < 500) {
      setError(true);
      return;
    }

    //Transforma fecha inicial

    const fechaPrincipio = transformaFecha(fechaInicial);

    //Transforma fecha final

    const fechaFinalCal = fechaInicial.add(dias, 'day');
    const fechaFinal = transformaFecha(fechaFinalCal);
    console.log(fechaPrincipio);
    console.log(fechaFinal);

    const formData = {
      moneda,
      cuenta,
      monto,
      fechaPrincipio,
      fechaFinal,
    };
    console.log("Form data submitted:", formData);
    setOpen(true);
  };

  const CustomButton = styled(Button)({
    backgroundColor: "#1565C0",
    color: "white",
    width: 216,
    height: 48,
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
    <section className="box-principal">
      <p className="titulo-plazo-fijo" fontSize="48">
        Simulá tu plazo fijo
      </p>
      <hr className="gray-line-top"></hr>

      <article className="titulos">
        <p className="titulo-secundario ">Moneda</p>
        <p className="titulo-secundario">Cuenta</p>
        <p className="titulo-secundario">Monto a invertir</p>
        <p className="titulo-secundario">Fecha Inicio Plazo Fijo</p>
        <p className="titulo-secundario">Días a invertir</p>
      </article>

      <Box
        component="form"
        noValidate
        autoComplete="off"
        id="box-secundario"
        onSubmit={handleSubmit}
      >
{/*Moneda*/}

        <div>
          <FormControl
            sx={{
              m: 1,
              minWidth: 216,
              minHeight: 48,
              "& .MuiInputBase-root": {
                backgroundColor: "#DBF0FF",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "transparent",
                },
                "&:hover fieldset": {
                  borderColor: "transparent",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0D99FF",
                },
              },
            }}
            className="white-select"
          >
            {/* ESTA INFORMACION TIENE QUE SER DINAMICA */}
            <Select value={moneda} onChange={handleMoneda}>
              <MenuItem value={moneda}>Pesos</MenuItem>
            </Select>
          </FormControl>
        </div>
{/* Cuenta de la plata */}
        <div>
          <FormControl
            sx={{
              m: 1,
              minWidth: 216,
              minHeight: 48,
              "& .MuiInputBase-root": {
                backgroundColor: "#DBF0FF",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "transparent",
                },
                "&:hover fieldset": {
                  borderColor: "transparent",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0D99FF",
                },
              },
            }}
            className="white-select"
          >
            <Select value={cuenta} onChange={handleCuenta}>
              <MenuItem value={cuenta}>Caja ahorro</MenuItem>
            </Select>
          </FormControl>
        </div>

{/* Monto a invertir   */}
        <div>
          <TextField
            required
            id="outlined-required"
            className="white-text-field"
            sx={{
              width: 216,
              height: 48,
              margin: 0,
              "& .MuiInputBase-root": {
                backgroundColor: "#DBF0FF",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: error ? "red" : "transparent",
                },
                "&:hover fieldset": {
                  borderColor: error ? "red" : "transparent",
                },
                "&.Mui-focused fieldset": {
                  borderColor: error ? "red" : "#0D99FF",
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
            error={error}
            helperText={
              error
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
          <Stack spacing={3} 
          sx={{ width: 220,
          m: 1,
          minWidth: 80,
          minHeight: 48,
          "& .MuiInputBase-root": {
            backgroundColor: "#DBF0FF",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "transparent",
            },
            "&:hover fieldset": {
              borderColor: "transparent",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#0D99FF",
            },
          },

          }}>
            <DatePicker  minDate={dayjs()} 
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
              "& .MuiInputBase-root": {
                backgroundColor: "#DBF0FF",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "transparent",
                },
                "&:hover fieldset": {
                  borderColor: "transparent",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0D99FF",
                },
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
          <DialogTitle id="alert-dialog-title">
            {"Simular Plazo Fijo"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Contenido del plazo fijo
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button onClick={handleClose} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
        </div>

        
      </Box>
      <p className="aviso">
        Si la fecha de vencimiento cae un dia no hábil, la misma se pasará{" "}
        <br /> al primer dia hábil del siguiente.
      </p>

      <hr className="gray-line-bottom"></hr>
    </section>
  );
}
