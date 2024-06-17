
import { Route, Routes, Router } from "react-router-dom";
import './App.css';
import Page from "./UI/Page";
import Login from "./components/login";
import PageNotFound from "./UI/Page/PageNotFound";
import Registro from './components/SignUp';
import PlazoFijoSimulado from "./components/PlazoFijoSimulado";
import ProtectedRoutes from "./utils/ProtectedRoutes";

function App() {
  return (
    <Page>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signUp" element={<Registro />} />
          <Route path="/signUp/admin" element={""} />

          <Route element={<ProtectedRoutes />}>
             <Route path="/home" element={""} />

             <Route path="/fixedTerm" element={<PlazoFijoSimulado/>} />

            <Route path="/accounts" element={<div>Accounts</div>} />
            <Route path="/accounts/:userId" element={<div>Account Detail</div>} />
            <Route path="/accounts/balance" element={<div>Balance</div>} />

            <Route path="/loan/simulate" element={<div>Simulate Loan</div>} />

            <Route path="/transactions" element={<div>Transactions</div>} />
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