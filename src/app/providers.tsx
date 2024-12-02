// in app/providers.tsx

"use client";

import { ReactNode } from "react";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

type Props = {
  session: Session | null;
  children: ReactNode;
};
export default function Providers(props: Props) {
  return (
    <SessionProvider session={props.session}>{props.children}</SessionProvider>
  );
}
