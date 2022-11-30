import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { ObjectId, objectIdToString } from "../utils";

const assessmentsAdapter = createEntityAdapter({
  selectId: entry => entry._id,
  sortComparer: (a, b) => b._id.localeCompare(a._id),
});
const asessmentsSlice = createSlice({
  name: "assessments",
  initialState: assessmentsAdapter.getInitialState({
    status: "idle",
    error: "",
    user: {},
  }),
  extraReducers(builder) {
    builder
      .addCase(fetchAssessments.fulfilled, (state, action) => {
        const entries = action.payload;
        assessmentsAdapter.setAll(state, entries);
        state.status = "idle";
        state.error = "";
      })
      .addCase(insertAssessment.fulfilled, (state, action) => {
        const entity = action.payload;
        assessmentsAdapter.addOne(state, entity);
        state.status = "idle";
        state.error = "";
      })
      .addCase(insertAssessments.fulfilled, (state, action) => {
        const entities = action.payload;

        console.log(entities);
        assessmentsAdapter.addMany(state, entities);
        state.status = "idle";
        state.error = "";
      })
      .addCase(updateAssessments.fulfilled, (state, action) => {
        const { ids, update } = action.payload;
        for (const index in ids) {
          assessmentsAdapter.updateOne(state, {
            id: ids[index],
            changes: update,
          });
        }
        state.status = "idle";
        state.error = "";
      })
      .addCase(deleteAssessment.fulfilled, (state, action) => {
        const id = action.payload;
        assessmentsAdapter.removeOne(state, id);
        state.status = "idle";
        state.error = "";
      })
      .addCase(getUser.fulfilled, (state, action) => {
        const user = action.payload;
        state.user = user;
        state.status = "idle";
        state.error = "";
      });
  },
});

//FETCH ALL
export const fetchAssessments = createAsyncThunk(
  "assessments/fetchAssessments",
  async (payload, { rejectWithValue }) => {
    const { mongo, user } = payload;
    try {
      const result = await mongo
        .db("a247")
        .collection("assessments")
        .aggregate([
          {
            $sort: {
              _id: -1,
            },
          },
          {
            $match: {
              owner: user.id,
            },
          },
        ]);
      const entries = objectIdToString(result);
      return entries;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
//INSERT
export const insertAssessment = createAsyncThunk(
  "assessments/insertAssessment",
  async (payload, { rejectWithValue }) => {
    const { mongo, entity, user } = payload;
    try {
      const { insertedId } = await mongo
        .db("a247")
        .collection("assessments")
        .insertOne({ ...entity, owner: user.id });
      return objectIdToString({
        ...entity,
        _id: insertedId,
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
//INSERTMANY
export const insertAssessments = createAsyncThunk(
  "assessments/insertAssessments",
  async (payload, { rejectWithValue }) => {
    const { mongo, entities } = payload;
    try {
      const { insertedIds } = await mongo
        .db("a247")
        .collection("assessments")
        .insertMany(entities);
      return entities.map((entity, index) => {
        return {
          ...objectIdToString(entity),
          _id: insertedIds[index].toString(),
        };
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
//UPDATE
export const updateAssessments = createAsyncThunk(
  "assessments/updateAssessments",
  async (payload, { rejectWithValue }) => {
    const { ids, mongo, update } = payload;
    try {
      await mongo
        .db("a247")
        .collection("assessments")
        .updateMany(
          {
            _id: {
              $in: ids,
            },
          },
          {
            $set: update,
          }
        );
      return {
        ids: objectIdToString(ids),
        update,
      };
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

//DELETE
export const deleteAssessment = createAsyncThunk(
  "assessments/deleteAssessment",
  async (payload, { rejectWithValue }) => {
    const { mongo, id } = payload;
    try {
      await mongo
        .db("a247")
        .collection("assessments")
        .deleteOne({ _id: ObjectId(id) });
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//FETCH ALL
export const getUser = createAsyncThunk(
  "assessments/getUser",
  async (payload, { rejectWithValue }) => {
    const { mongo, user } = payload;
    try {
      const result = await mongo.db("a247").collection("user").findOne({
        userID: user.id,
      });
      return objectIdToString(result);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
const assessmentsSelectors = assessmentsAdapter.getSelectors(
  state => state.assessments
);

export const selectAssessments = state => assessmentsSelectors.selectAll(state);
export const selectUser = state => state.assessments.user;
export const selectTopNewAssessments = state =>
  selectAssessments(state).filter((_, i) => i < 5);
export default asessmentsSlice;
