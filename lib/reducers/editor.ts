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
    UPDATE: (_: EditorStateType, action: PayloadAction<EditorStateType>) => {
      return action.payload;
    },
  },
});

export const { UPDATE } = editorState.actions;

export default editorState.reducer;
