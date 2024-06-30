import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./Redux/store.jsx";
import createTheme from "@mui/material/styles/createTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import CatLoader from "./UI/CatLoader/catLoader.jsx";
import { SnackbarProvider } from 'notistack';  // Importa el SnackbarProvider

const theme = createTheme({
  typography: {
    fontFamily: "Roboto",
  },
  palette: {
    primary: {
      main: "#1565C0",
    },
  },
  secondary: {
    main: "#162368",
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <React.StrictMode>
        <Provider store={store}>
          <PersistGate loading={<CatLoader />} persistor={persistor}>
            <SnackbarProvider maxSnack={3}>  {/* Envolviendo tu aplicación con SnackbarProvider */}
              <App />
            </SnackbarProvider>
          </PersistGate>
        </Provider>
      </React.StrictMode>
    </BrowserRouter>
  </ThemeProvider>
);