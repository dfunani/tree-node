// "use client"

import Login from "./login";
import Register from "./register";
import "@/src/app/globals.css"

export default async function Authentication({params}) {
  console.log(await params)
  
  return <div className="main">{(await params).access === "login" ? <Login/> : <Register/>}</div>
}
