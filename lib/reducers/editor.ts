import { EditorStateType } from "@/src/public/types/editor";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: EditorStateType = {
  nodes: null,
  edges: null,
};

const editorState = createSlice({
  name: "editor",
  initialState,
  reducers: {
    UPDATE: (
      state: EditorStateType,
      action: PayloadAction<EditorStateType>
    ) => {
      state = { ...state, ...action.payload };
      return state;
    },
    CLEAR: (state: EditorStateType) => {
      state = initialState;
      return state;
    },
  },
});

export const { UPDATE, CLEAR } = editorState.actions;

export default editorState.reducer;
