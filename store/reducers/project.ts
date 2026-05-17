/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProjectType } from "@/generated/prisma";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ITask {
  loading: boolean;
  error: boolean;
  data?: ITaskData[];
  errorMsg?: string;
}

interface ITaskData {
  id: string;
  title: string;
  type: ProjectType;
  order: number;
  userId: string;
  createdAt: string;
  _count?: {
    tasks: number;
    notes: number;
  };
}

export const userProjects = createAsyncThunk(
  "getProjects/projects",
  async (userId: string, thunkAPI) => {
    try {
      const res = await fetch(`/api/projects?userId=${userId}`, {
        next: { tags: ["projects"] },
        
      });
      const data = await res.json();
      return data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Unknown error");
    }
  },
);

const initialState: ITask = {
  loading: false,
  error: false,
  data: [],
  errorMsg: "",
};

const slice = createSlice({
  name: "project",
  initialState,
  reducers: {
    reorderProjects: (state, action) => {
      state.data = action.payload.data;
      return state;
    },
    project_tracker(state, action) {},
    task(state, action) {},
    meeting_notes(state, action) {},
    orderProjects (state, action ) {
      if(action.payload.active && action.payload.over &&state.data){
        const activeInd =state.data.find(pro =>pro.id ===action.payload.active);
        const overInd   = state.data.find(pro =>pro.id ===action.payload.over);
        const temp = activeInd!.order;
        activeInd!.order=overInd!.order;
        overInd!.order =temp
        state.data.sort((a,b)=>a.order-b.order) ;
        
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userProjects.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.errorMsg = undefined;
        return state;
      })
      .addCase(
        userProjects.fulfilled,
        (state, action: PayloadAction<ITaskData[]>) => {
          state.loading = false;
          state.error = false;
          state.errorMsg = undefined;
          state.data = action.payload;
          return state;
        },
      )
      .addCase(userProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.errorMsg = action.payload as string;
        state.data = [];
        return state;
      });
  },
});

const projectReducer = slice.reducer;
export const { reorderProjects ,orderProjects } = slice.actions;
export default projectReducer;
