"use client";

import styles from "@/src/public/styles/auth.module.css";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import { Logins } from "@/src/public/utils/types";
import Login from "@/src/components/login";

const Errors = {
  Conflict: "User Already Exists.",
  Invalid: "Invalid Credentials Provided.",
  Created: "Successfully Registered",
};

export default function Page() {
  const router = useRouter();
  let query = useSearchParams();
  let resolve = query.get("resolve");
  let errorText = handleErrors(resolve);

  const [credentials, setCredentials] = useState<Logins>({
    email: "",
    password: "",
  });

  function handleErrors(error: string | null) {
    switch (error) {
      case "Conflict":
        return Errors[error];
      case "Invalid":
        return Errors[error];
      case "Created":
        return Errors[error];
      default:
        return null;
    }
  }

  function handleUpdateCredentials(key: string, value: string) {
    setCredentials((prevCreds: Logins) => {
      return { ...prevCreds, [key]: value };
    });
  }

  async function handleLogin() {
    let response = await signIn("credentials", {
      ...credentials,
      redirect: false,
      callbackUrl: "/",
    });

    if (!response?.ok) {
      router.push("/auth/user/login?resolve=Invalid");
    } else router.push("/");
  }

  return (
    <div className={styles["login-container"]}>
      <h2 className={styles.h2}>Login</h2>
      <Login
        credentials={{
          email: credentials.email,
          password: credentials.password,
        }}
        handleUpdateCredentials={handleUpdateCredentials}
        handleLogin={handleLogin}
      />
      {errorText && <p className={styles.error}>{errorText}</p>}
    </div>
  );
}
