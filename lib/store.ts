import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux"; // Import combineReducers
import userReducer from "./reducers/user";
import editorReducer from "./reducers/editor";
import profileReducer from "./reducers/profile";
import { configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  user: userReducer,
  editor: editorReducer,
  profile: profileReducer
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "editor", "profile"], // Only persist the 'user' slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };
