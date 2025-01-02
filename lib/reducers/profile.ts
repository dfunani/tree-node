import { Edges, Nodes, Profile } from "@/src/public/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ProfileState = {
  name: string | null;
  surname: string | null;
  dob: string | null;
  city: string | null;
  country: string | null;
  image: string | null;
};

const initialState: ProfileState = {
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
    UPDATE: (state: ProfileState, action: PayloadAction<ProfileState>) => {
      state = { ...state, ...action.payload };
      return state;
    },
    CLEAR: (state: ProfileState) => {
      state = initialState;
      return state;
    },
  },
});

export const { UPDATE, CLEAR } = profileState.actions;

export default profileState.reducer;
