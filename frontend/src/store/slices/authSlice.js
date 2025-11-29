import { createSlice } from '@reduxjs/toolkit';

const initial = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null
};

const slice = createSlice({
  name: 'auth',
  initialState: initial,
  reducers: {
    setAuth(state, action){
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    clearAuth(state){
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }
});

export const { setAuth, clearAuth } = slice.actions;
export default slice.reducer;
