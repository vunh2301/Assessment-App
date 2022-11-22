import {
  configureStore,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { objectIdToString } from "../utils";
import asessmentsSlice from "./asessmentsSlice";
import usersSlice from "./usersSlice";

export const store = configureStore({
  reducer: {
    assessments: asessmentsSlice.reducer,
    users: usersSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
