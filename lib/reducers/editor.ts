import { Edges, Nodes } from "@/src/public/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type EditorState = {
  nodes: Nodes[] | null;
  edges: Edges[] | null;
};

const initialState: EditorState = {
  nodes: null,
  edges: null,
};

const editorState = createSlice({
  name: "editor",
  initialState,
  reducers: {
    UPDATE: (state: EditorState, action: PayloadAction<EditorState>) => {
      state = { ...state, ...action.payload };
      return state;
    },
    CLEAR: (state: EditorState) => {
      state = initialState;
      return state;
    },
  },
});

export const { UPDATE, CLEAR } = editorState.actions;

export default editorState.reducer;
