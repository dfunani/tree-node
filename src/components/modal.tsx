import React, { useState } from 'react';
import styles from "@/src/components/modal.module.css";
import { useGlobalContext } from '@/public/utils/context';

type Props = {

}
export default function Modal(props: Props) {
    const { globalState, setGlobalState } = useGlobalContext();

    return (
        <div className={styles["modal-container"]}>
            <div className={styles["modal-content"]}>
                <span className={styles["close-button"]} onClick={() => setGlobalState({ ...globalState, isModalOpen: false, id: "" })}>&times;</span>
                <p>This is the modal content.</p>
            </div>
        </div>
    );
}