"use client";

import { ReactNode, createContext, useContext, useState } from "react";

const GlobalContext = createContext({});

type Props = {
  children: ReactNode;
};

export const GlobalProvider = (props: Props) => {
  const [globalState, setGlobalState] = useState({
    isModalOpen: false,
    id: "",
  });

  const value = { globalState, setGlobalState };

  return (
    <GlobalContext.Provider value={value}>
      {props.children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
