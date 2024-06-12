import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id:"",
  userName: "",
  nombre:"",
  apellido:"",
  imagePath:"",
  token: ""
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { userName, image, token, nombre, apellido } = action.payload;
      state.userName = userName;
      state.imagePath = image;
      state.token = token;
      state.nombre = nombre;
      state.apellido = apellido;
    },
    clearUser: () => initialState, 
  },
});

export const { setUser ,clearUser} = userSlice.actions;
export default userSlice.reducer;

//esto deberiamos hacerlo por cada estado global que querramos tener, es decir, por cada estado que vea que debo usar en muchos componentes
//para no enviarlo constantemente por props. Ej. cuando el usuario se loguea lo guardo en redux