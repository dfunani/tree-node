"use client";

import "@/src/app/globals.css";

import { useParams } from "next/navigation";
import Error from "next/error";

import Login from "@/src/app/auth/user/[access]/login";
import Register from "@/src/app/auth/user/[access]/register";

const SLUGS = ["login", "register"];

export default function Page() {
  const { access } = useParams();
  const param = access?.toString() ?? "";

  if (!SLUGS.includes(param)) {
    return <Error statusCode={404} />;
  }

  return (
    <div className="main">{access === "login" ? <Login /> : <Register />}</div>
  );
}
