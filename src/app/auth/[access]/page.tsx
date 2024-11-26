// "use client"

import { useParams } from "next/navigation";
import Login from "./login";
import Register from "./register";
import "@/src/app/globals.css"

export default async function Authentication({params}) {
  // let params = await useParams();
  console.log(await params)
  
  return <div className="main">{(await params).access === "login" ? <Login/> : <Register/>}</div>
}
