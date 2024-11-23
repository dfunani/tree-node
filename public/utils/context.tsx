"use client"

import { createContext, useContext, useState } from 'react';

const GlobalContext = createContext({});

export const GlobalProvider = ({ children }) => {
    const [globalState, setGlobalState] = useState({
        isModalOpen: false,
        id: ""
    });

    const value = { globalState, setGlobalState };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);