import { StaticImageData } from "next/image";

export type Position = {
    x: number;
    y: number;
};
export type Data = {
    fullName: [string, string];
    location: [string, string];
    dob: string;
    image: StaticImageData | string;
    label: string;
};

export type Nodes = {
    id: string;
    position: Position;
    type: string;
    data: Data;
};

export type Edges = {
    id: string;
    source: string;
    sourceHandle: string;
    target: string;
    targetHandle: string;
}

export type Regsitration = {
    email: string;
    password: string;
    name: string;
    surname: string;
    dob: Date | null;
    city: string;
    country: string;
  };