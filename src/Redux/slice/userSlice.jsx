import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id:1,
  userName: "",
  firstName:"",
  lastName:"",
  imagePath:"",
  dni: "", 


};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { id, userName, image, firstName, lastName, dni,  } = action.payload;
      state.id = id;
      state.userName = userName;
      state.imagePath = image;
      state.firstName = firstName;
      state.lastName = lastName;
      state.dni = dni;
    

      
    },
    
    clearUser: () => initialState, 
  },
});

export const { setUser, clearUser} = userSlice.actions;
export default userSlice.reducer;

//esto deberiamos hacerlo por cada estado global que querramos tener, es decir, por cada estado que vea que debo usar en muchos componentes
//para no enviarlo constantemente por props. Ej. cuando el usuario se loguea lo guardo en redux