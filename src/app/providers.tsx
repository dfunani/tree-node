// in app/providers.tsx

"use client";

import { ReactNode } from "react";
import { PersistGate } from "redux-persist/integration/react";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";

import { store, persistor } from "@/lib/store";

type Props = {
  session: Session | null;
  children: ReactNode;
};
export default function Providers(props: Props) {
  return (
    <SessionProvider session={props.session}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {props.children}
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
}
