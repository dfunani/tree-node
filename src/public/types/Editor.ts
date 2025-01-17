import { StaticImageData } from "next/image";

export type UpdateNodeProfile = {
  name?: string;
  surname?: string;
  dob?: string;
  city?: string;
  country?: string;
  image?: string | null | StaticImageData;
};
