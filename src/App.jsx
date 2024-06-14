
import { Route, Routes } from "react-router-dom";
import './App.css';
import Page from "./UI/Page";
import Login from "./components/login";
import PageNotFound from "./UI/Page/PageNotFound";
import Registro from './components/SignUp';
import PlazoFijoSimulado from "./components/PlazoFijoSimulado";
function App() {

  return (
    <Page>
      <Routes>
        
        <Route path="/accounts" element={""} />
        <Route path="/accounts/:userId" element={""} />
        <Route path="/accounts/balance" element={""} />

        <Route path="/" element={<Login />} />
        <Route path="/signUp" element={<Registro/>} />
        <Route path="/signUp/admin" element={""} />
        <Route path="/home" element={""}/>


        <Route path="/fixedTerm" element={<PlazoFijoSimulado/>} />

          <Route path="/loan/simulate" element={""} />

        <Route path="/transactions" element={""} />

        <Route path="/transactions/user/:userId" element={""} />
        <Route path="/transactions/:transactionId" element={""} />

        <Route path="/users" element={""} />
        <Route path="/detail/:id" element={""} />
        <Route path="*" element={<PageNotFound to="/404" replace />} />
      </Routes>

    </Page>
  );
}

export default App;
