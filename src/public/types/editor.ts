import { ProfileType } from "@/src/public/types/user";

export type EditorType = {
  id: String;
  user_id: string;
} & EditorStateType;

export type EditorStateType = {
  nodes: NodeType[] | null;
  edges: EdgeType[] | null;
};

export type PositionType = {
  x: number;
  y: number;
};
export type NodeType = {
  id: string;
  position: PositionType;
  type: string;
  data: NodeDataType;
};

export type EdgeType = {
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
};

export type NodeDataType = ProfileType & { label: string };
