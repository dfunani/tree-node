"use client";
import { Regsitrations, ServerResponse } from "@/public/utils/types";
import { validateEmail, validatePassword } from "@/public/utils/validators";
import styles from "@/src/app/auth/[access]/auth.module.css";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

export function Register() {
  const router = useRouter();
  const [submit, setSubmit] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [registration, setRegistration] = useState<Regsitrations>({
    email: "",
    password: "",
    name: "",
    surname: "",
    dob: null,
    city: "",
    country: "",
  });

  function handleSubmit() {
    if (
      validateEmail(registration.email) &&
      validatePassword(registration.password)
    ) {
      setError(null);
      setSubmit(true);
    } else setError("Please Provide Valid Email and Password.");
  }

  function handleUpdateRegistration(key: string, value: string) {
    setRegistration((prevRegistration: Regsitrations) => {
      return { ...prevRegistration, [key]: value };
    });
  }
  async function handleRegistration() {
    let response = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(registration),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok || response.status == 400) {
      router.push("/");
    } else {
      let result: ServerResponse = await response.json();
      setError(result.message);
    }
  }
  return (
    <div className={styles["login-container"]}>
      <h2 className={styles.h2}>{submit ? "User Information" : "Register"}</h2>
      {!submit && (
        <div className={styles["form"]}>
          <input
            className={styles.input}
            aria-label="Email"
            // autoSave="off"
            type="email"
            placeholder="Email"
            value={registration.email}
            onChange={(event: ChangeEvent) =>
              handleUpdateRegistration(
                "email",
                (event.currentTarget as HTMLInputElement).value
              )
            }
          />
          <input
            className={styles.input}
            aria-label="Password"
            type="password"
            placeholder="Password"
            value={registration.password}
            onChange={(event: ChangeEvent) =>
              handleUpdateRegistration(
                "password",
                (event.currentTarget as HTMLInputElement).value
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
      )}
      {error && <p className={styles.error}>{error}</p>}

      {submit && (
        <div className={styles["form"]}>
          <input
            className={styles.input}
            aria-label="Name"
            type="name"
            placeholder="Name"
            onChange={(event: ChangeEvent) =>
              handleUpdateRegistration(
                "name",
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
                "surname",
                (event.target as HTMLInputElement).value
              )
            }
          />
          <input
            className={styles.input}
            aria-label="Date of Birth"
            type="date"
            placeholder="Date of Birth"
            onChange={(event: ChangeEvent) =>
              handleUpdateRegistration(
                "dob",
                (event.target as HTMLInputElement).value
              )
            }
          />
          <input
            className={styles.input}
            aria-label="City"
            type="text"
            placeholder="City"
            onChange={(event: ChangeEvent) =>
              handleUpdateRegistration(
                "city",
                (event.target as HTMLInputElement).value
              )
            }
          />
          <input
            className={styles.input}
            aria-label="Country"
            type="text"
            placeholder="Country"
            onChange={(event: ChangeEvent) =>
              handleUpdateRegistration(
                "country",
                (event.target as HTMLInputElement).value
              )
            }
          />
          <button
            className={styles.button}
            onClick={() => handleRegistration()}
            type="button"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

export default Register;
