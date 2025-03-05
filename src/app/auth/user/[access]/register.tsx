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
  const [resolveText, setResolveText] = useState<string | null>(null);
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
      setResolveText(null);
      setSubmit(true);
    } else setResolveText("Please Provide Valid Email and Password.");
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
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
      },
    });

    if (response.ok) {
      router.push(`/auth/user/login?resolve=Created`);
    } else if (response.status == 409) {
      router.push(`/auth/user/login?resolve=Conflict`);
    } else {
      setResolveText("Invalid Submission. Provide All Fields Below.");
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
      {resolveText && <p className={styles.error}>{resolveText}</p>}

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
