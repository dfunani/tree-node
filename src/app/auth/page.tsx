"use client"
import styles from "@/src/app/auth/auth.module.css"
import { signIn } from "next-auth/react";


export function Register() {
    function handleSubmit(formData){
        // fetch("/api/auth", {method: "POST", body: JSON.stringify(formData)})
        console.log(formData)
    }
    return (
        <div className={styles.main}>
            <div className={styles["login-container"]}>
                <h2 className={styles.h2}>Register</h2>
                <form action={(formData) => handleSubmit(formData)}>
                    <input className={styles.input} aria-label="Username" type="email" placeholder="Email" />
                    <input className={styles.input} aria-label="Password" type="password" placeholder="Password" />
                    <input className={styles.input} aria-label="dob" type="date" placeholder="Date of Birth" />
                    <input className={styles.input} aria-label="Location" type="text" placeholder="City, County" />
                    <button className={styles.button} type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default Register;