
import { Route, Routes } from "react-router-dom";
import './App.css';
import Page from "./components/UI/page";
import PageNotFound from "./components/UI/page/PageNotFound";
import Login from './login';
function App() {

  return (
    <Page>
      <Routes>
        <Route path="/accounts" element={""} />
        <Route path="/accounts/:userId" element={""} />
        <Route path="/accounts/balance" element={""} />

        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={""} />
        <Route path="/signUp/admin" element={""} />

        <Route path="/fixedTerm" element={""} />
        <Route path="/fixedTerm/simulate" element={""} />

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
