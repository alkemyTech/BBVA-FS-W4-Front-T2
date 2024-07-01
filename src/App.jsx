import { Route, Routes, Router } from "react-router-dom";
import "./App.css";
import Page from "./UI/Page";
import Login from "./components/login";
import {HomeWithSnackbar} from "./components/Home";
import PageNotFound from "./UI/Page/PageNotFound";
import Registro from "./components/SignUp";
import PlazoFijoSimulado from "./components/PlazoFijoSimulado";
import Gastos from "./components/Gastos";
import Transferir from "./components/Transferir";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import DatosUser from "./components/Datos";
import Deposito from "./components/deposit"
import Movimientos from "./components/Movimientos";
import MisCuentas from "./components/MisCuentas";
import ListaPlazos from "./components/ListaPF";
import { useNavigate } from 'react-router-dom';


import Converter from "./components/Converter";



function App() {
  return (
    <Page>
      <Routes>
        <Route path="/converter" element={<Converter/>}/>
        <Route path="/" element={<Login />} />
        <Route path="/signUp" element={<Registro />} />
        <Route path="/signUp/admin" element={""} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/home" element={<HomeWithSnackbar />} />

          <Route path="/simulated" element={<PlazoFijoSimulado />} />
          <Route path="/Transferir" element={<Transferir />} />
          <Route path="/MisDatos" element={<DatosUser />} />
          <Route path="/mis-cuentas" element={<MisCuentas/>} />
          <Route path="/inversiones" element={<ListaPlazos/>} />

             <Route path="/pagos" element={<Gastos/>} />

              <Route path="/Transacciones" element={<Movimientos/>} />
            <Route path="/depositar" element={<Deposito/>} />

          </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Page>
  );
}

export default App;
