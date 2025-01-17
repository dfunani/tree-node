"use client";

import styles from "@/src/public/styles/auth.module.css";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import Login from "@/src/components/login";
import { CredentialsType } from "@/src/public/types/user";
import { handleErrors } from "@/src/public/errors/messages";

export default function Page() {
  const router = useRouter();
  const query = useSearchParams();
  const resolve = query.get("resolve");
  let resolveMessage = null;

  const [credentials, setCredentials] = useState<CredentialsType>({
    email: "",
    password: "",
  });
  const [errorText, setErrorText] = useState<string | null>(null);

  function handleUpdateCredentials(key: string, value: string) {
    setCredentials((prevCreds: CredentialsType) => {
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

  useEffect(() => {
    if (resolve) {
      setErrorText(handleErrors("user", resolve));
      setTimeout(() => {
        router.push("/auth/user/login");
        setErrorText(null);
      }, 2000);
    }
  });

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
