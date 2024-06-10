import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store, {persistor} from './Redux/store.js'
import LoadingCat from './assets/components/loadingCat';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={<LoadingCat />} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
  </React.StrictMode>,
  document.getElementById('root')

)
