import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userName: "",
  password: "",
  token: "",
  nombre:"",
  apellido:"",
  
};

export const userSlice = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    setUser: (state, action) => {
      return (state = action.payload);
    },
    //clearUser: () => initialState, por si quisieramos limpiar el estado
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;

//esto deberiamos hacerlo por cada estado global que querramos tener, es decir, por cada estado que vea que debo usar en muchos componentes
//para no enviarlo constantemente por props. Ej. cuando el usuario se loguea lo guardo en redux