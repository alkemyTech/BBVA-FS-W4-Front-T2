import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store, {persistor} from './Redux/store.js'
import LoadingCat from './assets/components/loadingCat';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={<LoadingCat />} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
  </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root')

)
