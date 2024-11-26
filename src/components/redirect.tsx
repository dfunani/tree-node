"use client";

import styles from "@/src/components/redirect.module.css";
import { signIn } from "next-auth/react";

export default function Redirect() {
  return (
    <div className={styles.container}>
      <div className={styles["redirect-message"]}>Redirect...</div>
    </div>
  );
}
