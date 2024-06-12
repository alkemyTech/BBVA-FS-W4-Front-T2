import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState } from "react";
export default function PlazoFijoSimulado() {
  const [dias, setDias] = useState("");

  const handleChange = (event) => {
    setDias(event.target.value);
  };

  return (
    <>
      <p>
        <br />
      </p>

      <Typography>Simulá tu plazo fijo</Typography>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <Typography>Monto a invertir</Typography>
          <TextField required id="outlined-required" defaultValue="$200.000" />
        </div>
        <div>
          <Typography>Días a invertir</Typography>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Select
              id="demo-simple-select-helper"
              value={dias}
              onChange={handleChange}
            >
              <MenuItem value="">
              </MenuItem>
              <MenuItem value={30}>30 días</MenuItem>
              <MenuItem value={90}>90 días</MenuItem>
              <MenuItem value={180}>180 días</MenuItem>
            </Select>
            <FormHelperText>With label + helper text</FormHelperText>
          </FormControl>
        </div>
        <div>
          <Button variant="outlined">Simular Plazo Fijo</Button>
        </div>
       
      </Box>
      <Typography>
        Si la fecha de vencimiento cae un dia no habill, la misma se pasará al
        primer dia hábil del siguiente.
      </Typography>
    </>
  );
}
