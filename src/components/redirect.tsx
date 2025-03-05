"use client";

import styles from "@/src/public/styles/redirect.module.css";

export default function Redirect() {
  return (
    <div className={styles.container}>
      <div className={styles["redirect-message"]}>Redirect...</div>
    </div>
  );
}
