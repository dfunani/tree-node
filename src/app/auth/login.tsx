"use client"

import styles from "@/src/app/auth/auth.module.css"
import { getProviders, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


function Login() {
    const router = useRouter()
    function handleLogin() {
        // "use server"
        signIn("credentials", { redirect: true, username: "", password: "" })
    }

    return (
        <div className={styles.main}>
            <div className={styles["login-container"]}>
                <h2 className={styles.h2}>Login</h2>
                <form>
                    <input className={styles.input} aria-label="Username" type="email" placeholder="Email" />
                    <input className={styles.input} aria-label="Password" type="password" placeholder="Password" />
                    <button className={styles.button} onClick={() => {
          signIn("credentials");
        }} type="button">Login</button>
                </form>
            </div>
            <button onClick={() => router.push("/auth")}>Register</button>
        </div>
    );
}

export default Login;