import { StaticImageData } from "next/image";

export type ImageFactoryResponse = {
  [key: string]: StaticImageData;
};

export type ThemeOptions = "light" | "dark";
