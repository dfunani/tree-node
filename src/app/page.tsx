"use client";

import "@/src/app/globals.css";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Canvas from "@/src/components/canvas";
import Redirect from "@/src/components/redirect";
import { GlobalProvider } from "@/src/public/utils/context";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) router.push("/auth/user/login");
  });

  return (
    <div className="main">
      <GlobalProvider>{session ? <Canvas /> : <Redirect />}</GlobalProvider>
    </div>
  );
}
