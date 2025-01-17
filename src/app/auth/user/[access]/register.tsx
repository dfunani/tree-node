"use client";

import styles from "@/src/public/styles/auth.module.css";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Login from "@/src/components/login";
import Registration from "@/src/components/registration";

import { validateEmail, validatePassword } from "@/src/public/utils/validators";
import { RegistrationType } from "@/src/public/types/user";

export default function Page() {
  const router = useRouter();
  const [submit, setSubmit] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [registration, setRegistration] = useState<RegistrationType>({
    email: "",
    password: "",
    name: "",
    surname: "",
    dob: "",
    city: "",
    country: "",
    image: "",
  });

  function handleLogin() {
    if (
      validateEmail(registration.email) &&
      validatePassword(registration.password)
    ) {
      setError(null);
      setSubmit(true);
    } else setError("Please Provide Valid Email and Password.");
  }

  function handleUpdateRegistration(key: string, value: string) {
    setRegistration((prevRegistration: RegistrationType) => {
      return { ...prevRegistration, [key]: value };
    });
  }

  async function handleRegistration() {
    const response = await fetch("/api/auth/user", {
      method: "POST",
      body: JSON.stringify(registration),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      router.push(`/auth/user/login?resolve=Created`);
    } else if (response.status == 409) {
      router.push(`/auth/user/login?resolve=Conflict`);
    } else {
      setError("Invalid Submission. Update Required Fields.");
    }
  }
  return (
    <div className={styles["login-container"]}>
      <h2 className={styles.h2}>{submit ? "User Information" : "Register"}</h2>
      {!submit && (
        <Login
          credentials={{
            email: registration.email,
            password: registration.password,
          }}
          handleUpdateCredentials={handleUpdateRegistration}
          handleLogin={handleLogin}
        />
      )}
      {error && <p className={styles.error}>{error}</p>}

      {submit && (
        <Registration
          registration={registration}
          handleUpdateRegistration={handleUpdateRegistration}
          handleRegistration={handleRegistration}
        />
      )}
    </div>
  );
}
