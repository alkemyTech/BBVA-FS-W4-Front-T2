import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { styled } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState } from "react";
import "./fixedTerm.css";

export default function PlazoFijoSimulado() {
  const [dias, setDias] = useState(30);

  const handleChange = (event) => {
    setDias(event.target.value);
  };

  const CustomButton = styled(Button)({
    backgroundColor: "#103551",
    border: "3px solid #46A044",
    color: "white",
    width: 216,
    height: 48,
    "&:hover": {
      backgroundColor: "#082838",
    },
    "&:focus": {
      backgroundColor: "#103551",
      border: "3px solid #46A044",
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
        <p className="titulo-secundario monto">Monto a invertir</p>

        <p className="titulo-secundario dias">Días a invertir</p>
      </article>

      <Box component="form" noValidate autoComplete="off" id="box-secundario">
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
                  borderColor: "transparent", // optional: to match the background color
                },
                "&:hover fieldset": {
                  borderColor: "transparent", // optional: to match the background color
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0D99FF", // to match the button border
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        </div>

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
            <Select value={dias} onChange={handleChange}>
              <MenuItem value={30}>30 días</MenuItem>
              <MenuItem value={90}>90 días</MenuItem>
              <MenuItem value={180}>180 días</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div>
          <CustomButton>
            Simular <StyledArrowRightIcon />
          </CustomButton>
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
