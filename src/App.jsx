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
import Deposito from "./components/deposit"
import Movimientos from "./components/Movimientos";



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

             <Route path="/pagos" element={<Gastos/>} />

            <Route path="/accounts" element={<div>Accounts</div>} />
            <Route path="/accounts/:userId" element={<div>Account Detail</div>} />
            <Route path="/accounts/balance" element={<div>Balance</div>} />

            <Route path="/loan/simulate" element={<div>Simulate Loan</div>} />

            <Route path="/Transacciones" element={<Movimientos/>} />
            <Route path="/depositar" element={<Deposito/>} />

            <Route path="/transactions/user/:userId" element={<div>User Transactions</div>} />
            <Route path="/transactions/:transactionId" element={<div>Transaction Detail</div>} />
            
            <Route path="/users" element={<div>Users</div>} />
            <Route path="/detail/:id" element={<div>Detail</div>} />
          </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Page>
  );
}

export default App;
