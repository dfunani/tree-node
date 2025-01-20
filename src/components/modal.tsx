import React, { Dispatch, SetStateAction, useState } from "react";
import styles from "@/src/components/modal.module.css";
import Registration from "@/src/components/registration";
import { buildDate } from "@/src/public/utils/factories";
import { NodeType } from "@/src/public/types/editor";
import { ProfileType } from "../public/types/user";

type Props = {
  setClicked: Dispatch<SetStateAction<boolean>>;
  setModal: Dispatch<SetStateAction<boolean>>;
  updateNodes: (id: string, node: NodeType | {}) => void;
  id: string;
};

export default function Modal(props: Props) {
  const [details, setDetails] = useState<NodeType | {}>({});

  function handleUpdateRegistration(key: string, value: string) {
    setDetails((prev: NodeType) => {
      return {
        ...(prev ?? {}),
        [key]: key === "dob" ? buildDate(new Date(value)) : value,
      };
    });
  }

  async function handleRegistration() {
    props.updateNodes(props.id, details);
    props.setModal(false);
    props.setClicked(false);
  }
  return (
    <div
      className={styles["modal-container"]}
      // onMouseLeave={() => props.setModal(false)}
    >
      <span
        className={styles["close-button"]}
        onClick={() => {
          props.setModal(false);
          props.setClicked(false);
        }}
      >
        &times;
      </span>
      <Registration
        registration={details}
        handleUpdateRegistration={handleUpdateRegistration}
        handleRegistration={handleRegistration}
      />
    </div>
  );
}
