import { configureStore, createSlice } from '@reduxjs/toolkit';

const baseURL = 'https://lotusosasco.ddns.net/api';

const slice = createSlice({
  name: 'portal',
  initialState: {
    isLogged: false,
    baseURL: baseURL
  },
  reducers: {
    setLogged: (state, action) => {
      state.isLogged = action.payload.isLogged;
    },
    setBaseUrl: (state, action) => {
      state.baseURL = action.payload.baseURL;
    }
  }
});

export const { setLogged, setBaseUrl } = slice.actions;
export const store = configureStore({
  reducer: slice.reducer
});
