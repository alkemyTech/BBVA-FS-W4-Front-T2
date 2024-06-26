import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import accountReducer from "./slice/accountSlice";
import transactionReducer from "./slice/transactionSlice"
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistUserConfig = {
  key: "user",
  storage,
};

const persistAccountConfig = {
  key: "account",
  storage,
};

const persistTransactionConfig = {
  key: "transactions",
  storage,
};

const persistedUserReducer = persistReducer(persistUserConfig, userReducer);
const persistAccountReducer = persistReducer(persistAccountConfig, accountReducer);
const persistTransactionReducer = persistReducer(persistTransactionConfig, transactionReducer);

//aca en el store tenemos que ir poniendo todos los reducers que creemos
const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    account: persistAccountReducer,
    transactions: persistTransactionReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export default store;
