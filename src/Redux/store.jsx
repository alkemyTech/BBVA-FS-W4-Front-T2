import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistUserConfig = {
  key: "user",
  storage,
};

const persistedUserReducer = persistReducer(persistUserConfig, userReducer);

//aca en el store tenemos que ir poniendo todos los reducers que creemos
const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export default store;