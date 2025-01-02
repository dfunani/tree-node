import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserState = {
  email: string | null;
  id: string | null;
  isNewUser: boolean | null;
};

const initialState: UserState = {
  email: null,
  id: null,
  isNewUser: null,
};

const userState = createSlice({
  name: "user",
  initialState,
  reducers: {
    UPDATE: (state: UserState, action: PayloadAction<UserState>) => {
      state = { ...state, ...action.payload };
      return state;
    },
    CLEAR: (state: UserState) => {
      state = initialState;
      return state;
    },
  },
});

export const { UPDATE, CLEAR } = userState.actions;

export default userState.reducer;
