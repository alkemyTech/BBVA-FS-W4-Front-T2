import './App.css'
import { Route, Routes } from "react-router-dom";
import Page from "./components/UI/page";
import Login from './login'

function App() {

  //Accounts
  //Login
  //FixedTermDeposit
  //LoanController
  //TransactionController
  //UserController


  return (
    <Page>
      <Routes>

        
        <Route path="/accounts" element={""}/>
        <Route path="/accounts/create" element={""}/>
        <Route path="/accounts/editar/:accountId" element={""}/>
        <Route path="/accounts/:userId" element={""}/>
        <Route path="/accounts/select/:accountId" element={""}/>
        <Route path="/accounts/balance" element={""}/>

        <Route path="/auth/login" element={""}/>
        <Route path="/auth/register" element={""}/>
        <Route path="/auth/register/admin" element={""}/>

        <Route path="/fixedTerm" element={""}/>
        <Route path="/fixedTerm/simulate" element={""}/>

        <Route path="/loan/simulate" element={""}/>

        <Route path="/transactions" element={""}/>
        <Route path="/transactions/sendArs" element={""}/>
        <Route path="/transactions/sendUsd" element={""}/>
        <Route path="/transactions/payment" element={""}/>
        <Route path="/transactions/deposit" element={""}/>
        <Route path="/transactions/user/:userId" element={""}/>
        <Route path="/transactions/transaction/:transactionId" element={""}/>
        <Route path="/transactions/detail/:id" element={""}/>

        <Route path="/users" element={""}/>
        <Route path="/id/:id" element={""}/>
        <Route path="/detail/:id" element={""}/>
        <Route path="/cbu/:idCbu/users/:idUser" element={""}/>
        <Route path="/users/:id" element={""}/>


        <Route path="/auth/login" element={<Login/>}/>


      </Routes>
    </Page>
  )
}

export default App
