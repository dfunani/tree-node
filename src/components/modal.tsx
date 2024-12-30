import React, { useState } from "react";
import styles from "@/src/components/modal.module.css";
import { useGlobalContext } from "@/src/public/utils/context";
import Registration from "@/src/components/registration";
import { NodeData, Registrations } from "../public/utils/types";
import { useRouter } from "next/navigation";

type Details = Omit<Registrations, "email" | "password">;
type Props = {
  setModal: any;
  data: NodeData;
};
export default function Modal(props: Props) {
  const router = useRouter();

  const [details, setDetails] = useState(props.data);

  function handleUpdateRegistration(key: string, value: string) {
    // props.data.setNode((prevRegistration) => {
    //   console.log(prevRegistration)
    //   return prevRegistration
    //   return { ...prevRegistration, [key]: value };
    // });
  }

  async function handleRegistration() {
    console.log("Hello")

    // if (response.ok || response.status == 409) {
    //   router.push(`/auth/user/login?resolve=${response.statusText}`);
    // } else {
    //   setError("Registration Failed. Please Try Again Later.");
    // }
  }
  return (
    <div
      className={styles["modal-container"]}
      onMouseLeave={() => props.setModal(false)}
    >
      <div className={styles["modal-content"]}>
        <span
          className={styles["close-button"]}
          onClick={() => props.setModal(false)}
        >
          &times;
        </span>
        <Registration
          registration={props.data}
          handleUpdateRegistration={handleUpdateRegistration}
          handleRegistration={handleRegistration}
        />
      </div>
    </div>
  );
}
