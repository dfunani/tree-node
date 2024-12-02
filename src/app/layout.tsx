// in app/layout.tsx

import "@/src/app/globals.css";

import { ReactNode } from "react";
import { getServerSession } from "next-auth";

import Providers from "@/src/app/providers";

type Props = {
  children: ReactNode;
};
export default async function RootLayout(props: Props) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body>
        <Providers session={session}>{props.children}</Providers>
      </body>
    </html>
  );
}
