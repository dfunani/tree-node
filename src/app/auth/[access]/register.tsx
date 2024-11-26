"use client";
import styles from "@/src/app/auth/[access]/auth.module.css";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

type Regsitration = {
  email: string;
  password: string;
  name: string;
  surname: string;
  dob: string;
  location: string;
};
export function Register() {
  const router = useRouter();
  const [registration, setRegistration] = useState<Regsitration>({
    username: "",
    password: "",
    dob: "",
    location: "",
  });

  function handleUpdateRegistration(key: string, value: string) {
    setRegistration((prevRegistration) => {
      return { ...prevRegistration, [key]: value };
    });
  }
  async function handleSubmit() {
    let response = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({
        username: "usernames",
        password: "password1",
        dob: "dob",
        location: "locations",
      }),
    });
    if (response.ok) {
      router.push("/");
    } else router.push("/auth/register");
  }
  return (
    <div className={styles.main}>
      <div className={styles["login-container"]}>
        <h2 className={styles.h2}>Register</h2>
        <input
          className={styles.input}
          aria-label="Name"
          type="text"
          placeholder="Name"
          onChange={(event: ChangeEvent) =>
            handleUpdateRegistration(
              "username",
              (event.target as HTMLInputElement).value
            )
          }
        />
        <input
          className={styles.input}
          aria-label="Surname"
          type="text"
          placeholder="Surname"
          onChange={(event: ChangeEvent) =>
            handleUpdateRegistration(
              "username",
              (event.target as HTMLInputElement).value
            )
          }
        />
        <input
          className={styles.input}
          aria-label="Password"
          type="password"
          placeholder="Password"
          onChange={(event: ChangeEvent) =>
            handleUpdateRegistration(
              "username",
              (event.target as HTMLInputElement).value
            )
          }
        />
        <input
          className={styles.input}
          aria-label="dob"
          type="date"
          placeholder="Date of Birth"
          onChange={(event: ChangeEvent) =>
            handleUpdateRegistration(
              "username",
              (event.target as HTMLInputElement).value
            )
          }
        />
        <input
          className={styles.input}
          aria-label="Location"
          type="text"
          placeholder="City, County"
          onChange={(event: ChangeEvent) =>
            handleUpdateRegistration(
              "username",
              (event.target as HTMLInputElement).value
            )
          }
        />
        <button
          className={styles.button}
          onClick={() => handleSubmit()}
          type="button"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default Register;
