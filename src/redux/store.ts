// import {configureStore} from "@reduxjs/toolkit";
// import authReducer from "./slice/authSlice";

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// });

// export default store;
// export type IRootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
