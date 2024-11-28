"use client";

import styles from "@/src/app/auth/[access]/auth.module.css";
import { getProviders, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

type Logins = {
  email: string;
  password: string;
};

function Login() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<Logins>({
    email: "",
    password: "",
  });

  function handleUpdateCredentials(key: string, value: string) {
    setCredentials((prevCreds: Logins) => {
      return { ...prevCreds, [key]: value };
    });
  }

  return (
    <div className={styles["login-container"]}>
      <h2 className={styles.h2}>Login</h2>
      <input
        className={styles.input}
        aria-label="Email"
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(event: ChangeEvent) =>
          handleUpdateCredentials(
            "email",
            (event.target as HTMLInputElement).value ?? ""
          )
        }
      />
      <input
        className={styles.input}
        aria-label="Password"
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(event: ChangeEvent) =>
          handleUpdateCredentials(
            "password",
            (event.target as HTMLInputElement).value ?? ""
          )
        }
      />
      <div>
        <button
          className={styles.button}
          onClick={async () => {
            let response = await signIn("credentials", {
              ...credentials,
              redirect: false,
            });
            if (!response?.ok) {
              router.push("/auth/register");
            } else router.push("/");
          }}
          type="button"
        >
          Login
        </button>
        <button
          className={styles.button}
          onClick={() => router.push("/auth/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default Login;
