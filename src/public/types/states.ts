import { ProfileStateType, UserStateType } from "@/src/public/types/user";
import { EditorStateType } from "@/src/public/types/editor";

export type StateReducerType = {
  user: UserStateType;
  editor: EditorStateType;
  profile: ProfileStateType;
};
