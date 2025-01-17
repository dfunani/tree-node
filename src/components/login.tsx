"use client";

import { ChangeEvent } from "react";

import styles from "@/src/public/styles/auth.module.css";
import { useParams, useRouter } from "next/navigation";
import { CredentialsType } from "@/src/public/types/user";

type Props = {
  credentials: CredentialsType;
  handleUpdateCredentials: (key: string, value: string) => void;
  handleLogin: () => void;
};
export default function Login(props: Props) {
  const router = useRouter();
  let { access } = useParams();
  let param = access?.toString() ?? "";

  return (
    <div className={styles["form"]}>
      <input
        className={styles.input}
        aria-label="Email"
        autoSave="off"
        autoComplete="off"
        type="email"
        placeholder="Email"
        onChange={(event: ChangeEvent) =>
          props.handleUpdateCredentials(
            "email",
            (event.currentTarget as HTMLInputElement).value
          )
        }
      />
      <input
        className={styles.input}
        aria-label="Password"
        type="password"
        autoSave="off"
        autoComplete="off"
        placeholder="Password"
        onChange={(event: ChangeEvent) =>
          props.handleUpdateCredentials(
            "password",
            (event.currentTarget as HTMLInputElement).value
          )
        }
      />
      <div className={styles.section}>
        <button
          className={styles.button}
          onClick={() => props.handleLogin()}
          type="button"
        >
          {param === "login" ? "Login" : "Submit"}
        </button>
        {param === "login" && (
          <button
            className={styles.button}
            onClick={() => router.push("/auth/user/register")}
          >
            Register
          </button>
        )}
      </div>
    </div>
  );
}
