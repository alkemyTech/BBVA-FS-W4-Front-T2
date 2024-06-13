import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    id: null,
    userName: "",
    nombre: "",
    apellido: "",
    imagePath: ""
  }
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { id, userName, imagePath, nombre, apellido } = action.payload;
      state.user = { id, userName, imagePath, nombre, apellido };
    },
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

//esto deberiamos hacerlo por cada estado global que querramos tener, es decir, por cada estado que vea que debo usar en muchos componentes
//para no enviarlo constantemente por props. Ej. cuando el usuario se loguea lo guardo en redux