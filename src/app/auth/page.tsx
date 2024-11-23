"use client"
import styles from "@/src/app/auth/auth.module.css"
import { useRouter } from "next/navigation";

export function Register() {
    const router = useRouter()
    async function handleSubmit() {
        let response = await fetch("/api/auth", {
            method: "POST", body: JSON.stringify({
                username: "usernames",
                password: "password1",
                dob: "dob",
                location: "locations"
            })
        })
        router.push("/")
    }
    return (
        <div className={styles.main}>
            <div className={styles["login-container"]}>
                <h2 className={styles.h2}>Register</h2>
                <input className={styles.input} aria-label="Username" type="email" placeholder="Email" />
                <input className={styles.input} aria-label="Password" type="password" placeholder="Password" />
                <input className={styles.input} aria-label="dob" type="date" placeholder="Date of Birth" />
                <input className={styles.input} aria-label="Location" type="text" placeholder="City, County" />
                <button className={styles.button} onClick={() => handleSubmit()} type="button">Submit</button>
            </div>
        </div>
    );
}

export default Register;