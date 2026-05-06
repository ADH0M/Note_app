"use client";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";
import { Provider } from "react-redux";
import { useState } from "react";
import projectReducer from "./reducers/project";
import openSearchSlice from "./reducers/searchSlice";

const store = configureStore({
  reducer: {
    authReducer,
    projectReducer,
    openSearchSlice
  },
});

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [state] = useState<typeof store>(() => store);
  return <Provider store={state}>{children}</Provider>;
};

export default StoreProvider;

export type RootState = ReturnType<typeof store.getState>;
export type DisptachStore = typeof store.dispatch;
