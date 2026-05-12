"use client";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";
import { Provider } from "react-redux";
import { useState } from "react";
import projectReducer from "./reducers/project";
import openSearchSlice from "./reducers/searchSlice";
import { todoApi } from "./reduxApi/todo";

const store = configureStore({
  reducer: {
    authReducer,
    projectReducer,
    openSearchSlice,
    [todoApi.reducerPath]: todoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(todoApi.middleware),
});

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [state] = useState<typeof store>(() => store);
  return <Provider store={state}>{children}</Provider>;
};

export default StoreProvider;

export type RootState = ReturnType<typeof store.getState>;
export type DisptachStore = typeof store.dispatch;
