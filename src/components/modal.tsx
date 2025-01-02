import React, { useState } from "react";
import styles from "@/src/components/modal.module.css";
import { useGlobalContext } from "@/src/public/utils/context";
import Registration from "@/src/components/registration";
import { NodeData, Nodes, Registrations } from "../public/utils/types";
import { useRouter } from "next/navigation";
import { StaticImageData } from "next/image";
import { UpdateNodeProfile } from "../public/types/auth";
import { buildDate } from "../public/utils/factories";

type Props = {
  setClicked: any;
  setModal: any;
  updateNodes: (id: string, node: any) => void;
  id: string;
};

export default function Modal(props: Props) {
  const [details, setDetails] = useState<UpdateNodeProfile>({});

  function handleUpdateRegistration(key: string, value: string) {
    setDetails((prev: UpdateNodeProfile) => {
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
