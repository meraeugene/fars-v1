import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSliceReducer from "./slices/authSlice";

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authSliceReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: [apiSlice.reducerPath],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    (
      getDefaultMiddleware({
        serializableCheck: false,
      }) as any
    ).concat(apiSlice.middleware),
  devTools: true,
});

export const persistor = persistStore(store);
