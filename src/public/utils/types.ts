import { StaticImageData } from "next/image";
import { Dispatch, SetStateAction } from "react";

export type Position = {
  x: number;
  y: number;
};

export type Nodes = {
  id: string;
  position: Position;
  type: string;
  data: NodeData;
};

export type NodeData = Profile & { label: string };

export type Edges = {
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
};

export type Registrations = {
  email: string;
  password: string;
  name: string;
  surname: string;
  dob: string;
  city: string;
  country: string;
  image: string | null | StaticImageData;
};

export type Logins = {
  email: string;
  password: string;
};

export type Users = Pick<Registrations, "email" | "password"> & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type Profile = Omit<Registrations, "email" | "password">;

export type ServerResponse = {
  message: any;
};
