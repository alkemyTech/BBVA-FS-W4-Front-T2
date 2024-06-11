import './App.css'
import Page from "./components/UI/page";
import Header from "./components/UI/Header";
import Login from './login'
import ResponsiveAppBar from './components/UI/Header';

function App() {


  return (
    <Page>

    <Login>
    <ResponsiveAppBar/>
    </Login>
    </Page>
  )
}

export default App
