import './App.css'
import Page from "./components/UI/page";
import Header from "./components/UI/Header";
import Login from './login'
import ResponsiveAppBar from './components/UI/Header';
import Footer from './components/UI/Footer';
import Pie from './components/UI/Footer';

function App() {


  return (
    <Page>

    <Login>
    <ResponsiveAppBar/>
    <Pie/>
    </Login>
    </Page>
  )
}

export default App
