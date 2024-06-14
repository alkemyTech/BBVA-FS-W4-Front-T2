import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id:"",
  userName: "",
  firstName:"",
  lastName:"",
  imagePath:"",
  birthDate:""
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { userName, image, firstName, lastName } = action.payload;
      state.userName = userName;
      state.imagePath = image;
      state.firstName = firstName;
      state.lastName = lastName;
    },
    clearUser: () => initialState, 
  },
});

export const { setUser, clearUser} = userSlice.actions;
export default userSlice.reducer;

//esto deberiamos hacerlo por cada estado global que querramos tener, es decir, por cada estado que vea que debo usar en muchos componentes
//para no enviarlo constantemente por props. Ej. cuando el usuario se loguea lo guardo en redux