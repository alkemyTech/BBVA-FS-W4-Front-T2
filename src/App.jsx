import { Route, Routes, Router } from "react-router-dom";
import "./App.css";
import Page from "./UI/Page";
import Login from "./components/login";
import Home from "./components/Home";
import PageNotFound from "./UI/Page/PageNotFound";
import Registro from "./components/SignUp";
import PlazoFijoSimulado from "./components/PlazoFijoSimulado";
import Gastos from "./components/Gastos";
import Transferir from "./components/Transferir";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import DatosUser from "./components/Datos";
import Deposito from "./components/deposit";

function App() {
  return (
    <Page>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signUp" element={<Registro />} />
        <Route path="/signUp/admin" element={""} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/home" element={<Home />} />

          <Route path="/fixedTerm" element={<PlazoFijoSimulado />} />
          <Route path="/Transferir" element={<Transferir />} />
          <Route path="/MisDatos" element={<DatosUser />} />

          <Route path="/pagos" element={<Gastos />} />

          <Route path="/depositar" element={<Deposito />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Page>
  );
}

export default App;
