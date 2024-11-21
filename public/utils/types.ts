import { StaticImageData } from "next/image";

export type Position = {
    x: number;
    y: number;
};
export type Data = {
    fullName: [string, string];
    location: [string, string];
    dob: Date;
    image: StaticImageData | string;
    label: string;
};

export type Nodes = {
    id: string;
    position: Position;
    type: string;
    data: Data;
};
