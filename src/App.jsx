
import './App.css'
import { Route, Routes } from "react-router-dom";
import Page from "./components/UI/page";
import Header from "./components/UI/Header";
import Login from './login'
import ResponsiveAppBar from './components/UI/Header';
import Footer from './components/UI/Footer';
import Pie from './components/UI/Footer';
import Login from "./login";
import Login from "./components/UI/login";
import PageNotFound from "./components/UI/page/PageNotFound";
import Registro from './components/UI/singUp';
function App() {

  return (
    <Page>
    <Login>
    <ResponsiveAppBar/>
    <Pie/>
    </Login>
      <Routes>
        
        <Route path="/accounts" element={""} />
        <Route path="/accounts/:userId" element={""} />
        <Route path="/accounts/balance" element={""} />

        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<Registro/>} />
        <Route path="/signUp/admin" element={""} />
        <Route path="/home" element={""}/>


        <Route path="/fixedTerm" element={""} />
        <Route path="/fixedTerm/simulate" element={""} />

        <Route path="/loan/simulate" element={""} />

        <Route path="/transactions" element={""} />

        <Route path="/transactions/deposit" element={""} />
        <Route path="/transactions/payment" element={""} />
        <Route path="/transactions/expenses" element={"Gastos"} />


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
