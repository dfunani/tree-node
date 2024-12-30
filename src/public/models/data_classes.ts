import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*\d)(?=.*[!@#$%^&*()_+-])[A-Za-z\d!@#$%^&*()_+-]{8,}$/;
const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
const systemDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const objectIDRegex = /^[0-9a-fA-F]{24}$/;
const imageRegex = /^data:image\/(png|jpg|jpeg);base64,/;

export const Registration = z.object({
  email: z.string().email().regex(emailRegex, "Invalid Email."),
  password: z.string().regex(passwordRegex, "Invalid Password."),
  name: z.string().min(1, "Invalid Name.").max(255),
  surname: z.string().min(1, "Invalid Surname.").max(255),
  dob: z.string().regex(dobRegex, "Invalid Date Of Birth."),
  city: z.string().min(1, "Invalid City.").max(255),
  country: z.string().min(1, "Invalid Country").max(255),
  image: z.string().regex(imageRegex).nullable(),
});

export const PatchDetails = z.object({
  name: z.string().min(1, "Invalid Name.").max(255),
  surname: z.string().min(1, "Invalid Surname.").max(255),
  dob: z.string().regex(dobRegex, "Invalid Date Of Birth."),
  city: z.string().min(1, "Invalid City.").max(255),
  country: z.string().min(1, "Invalid Country").max(255),
  image: z.string().regex(imageRegex).nullable(),
});

export const Profile = z.object({
  name: z.string().min(1, "Invalid Name.").max(255),
  surname: z.string().min(1, "Invalid Surname.").max(255),
  dob: z.string().regex(dobRegex, "Invalid Date Of Birth."),
  city: z.string().min(1, "Invalid City.").max(255),
  country: z.string().min(1, "Invalid Country").max(255),
  image: z.string().regex(imageRegex).nullable(),
});

export const Credentials = z.object({
  email: z.string().email().regex(emailRegex, "Invalid Email."),
  password: z.string().regex(passwordRegex, "Invalid Password."),
});

export const Authorize = z.object({
  id: z.string().regex(objectIDRegex),
  email: z.string(),
  password: z.string(),
  createdAt: z.string().regex(systemDateRegex),
  updatedAt: z.string().regex(systemDateRegex),
});
