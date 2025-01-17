import { UserStateType } from "@/src/public/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserStateType = {
  email: null,
  id: null,
  isNewUser: null,
};

const userState = createSlice({
  name: "user",
  initialState,
  reducers: {
    UPDATE: (state: UserStateType, action: PayloadAction<UserStateType>) => {
      state = { ...state, ...action.payload };
      return state;
    },
    CLEAR: (state: UserStateType) => {
      state = initialState;
      return state;
    },
  },
});

export const { UPDATE, CLEAR } = userState.actions;

export default userState.reducer;
