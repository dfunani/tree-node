import React, { useState } from 'react';
import styles from "@/components/button.module.css"

function MenuButton() {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleMenu = () => {
        setIsExpanded((prev: boolean) => !prev);
    };

    function expandMenu() {
        return (<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
        </svg>)
    }

    function MinimizeMenu() {
        return <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-dash-lg" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8" />
        </svg>
    }

    return (
        <button className={styles["menu-button"]} onClick={toggleMenu}>
            {isExpanded ? MinimizeMenu() : expandMenu()}
        </button>
    );
}

export default MenuButton;