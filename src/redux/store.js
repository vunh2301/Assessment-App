import {
  configureStore,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { objectIdToString } from "../utils";

const assessmentsAdapter = createEntityAdapter({
  selectId: entry => entry._id,
});
const asessmentsSlice = createSlice({
  name: "assessments",
  initialState: assessmentsAdapter.getInitialState({
    status: "idle",
    error: "",
  }),
  extraReducers(builder) {
    builder
      .addCase(fetchAssessments.pending, (state, action) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchAssessments.fulfilled, (state, action) => {
        const { entries } = action.payload;
        assessmentsAdapter.setAll(state, entries);
        state.status = "idle";
        state.error = "";
      })
      .addCase(fetchAssessments.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error;
      });
  },
});
export const fetchAssessments = createAsyncThunk(
  "asessments/fetchAssessments",
  async (payload, { rejectWithValue }) => {
    const { mongo } = payload;
    try {
      const result = await mongo.db("a247").collection("assessment").find();
      const entries = objectIdToString(result);
      return { entries };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const store = configureStore({
  reducer: {
    assessments: asessmentsSlice.reducer,
  },
});

const selectors = assessmentsAdapter.getSelectors(state => state);
export const selectAssessments = state =>
  selectors.selectAll(state.assessments);
