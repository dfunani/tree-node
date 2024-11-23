"use client";

import { GlobalProvider } from "@/public/utils/context";
import styles from "@/src/app/page.module.css";
import Canvas from "@/src/components/canvas";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import Login from "@/src/app/auth/login";

export default  function Home() {
  const { data: session, status } = useSession()
  if (!session) {
    return (<div className={styles.main}><Login /></div>)
  }
  return (
    <div className={styles.main}>
      <GlobalProvider><Canvas /></GlobalProvider>
    </div>
  );
}
