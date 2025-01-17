import { ProfileStateType } from "@/src/public/types/user";
import { Edges, Nodes, Profile } from "@/src/public/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ProfileStateType = {
  name: null,
  surname: null,
  dob: null,
  city: null,
  country: null,
  image: null,
};

const profileState = createSlice({
  name: "profile",
  initialState,
  reducers: {
    UPDATE: (
      state: ProfileStateType,
      action: PayloadAction<ProfileStateType>
    ) => {
      state = { ...state, ...action.payload };
      return state;
    },
    CLEAR: (state: ProfileStateType) => {
      state = initialState;
      return state;
    },
  },
});

export const { UPDATE, CLEAR } = profileState.actions;

export default profileState.reducer;
