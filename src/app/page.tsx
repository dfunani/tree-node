"use client";

import { GlobalProvider } from "@/public/utils/context";
import styles from "@/src/app/page.module.css";
import Canvas from "@/src/components/canvas";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Redirect from "../components/redirect";
import { useEffect } from "react";
import "@/src/app/globals.css";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!session) router.push("/auth/login");
  }, []);
  return (
    <div className="main">
      <GlobalProvider>{session ? <Canvas /> : <Redirect />}</GlobalProvider>
    </div>
  );
}
