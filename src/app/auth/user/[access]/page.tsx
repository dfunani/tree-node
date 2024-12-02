"use client";

import "@/src/app/globals.css";

import { useParams} from "next/navigation";
import Error from "next/error";

import Login from "./login";
import Register from "./register";

const SLUGS = ["login", "register"];

export default function Page() {
  let { access } = useParams();
  let param = access?.toString() ?? "";
  
  if (!SLUGS.includes(param)) {
    return <Error statusCode={404} />;
  }

  return (
    <div className="main">{access === "login" ? <Login /> : <Register />}</div>
  );
}
