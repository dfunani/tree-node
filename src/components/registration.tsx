import { ChangeEvent, useState } from "react";

import styles from "@/src/public/styles/auth.module.css";
import { Registrations } from "@/src/public/utils/types";
import AddButton from "./addButton";

type Props = {
  registration: Omit<Registrations, "email" | "password">;
  handleUpdateRegistration: (key: string, value: any) => void;
  handleRegistration: () => void;
};
export default function Registration(props: Props) {
  function handleImageConversion(file: File) {
    const client = new FileReader();
    client.readAsArrayBuffer(file);
    client.onload = (event: ProgressEvent<FileReader>) => {
      const arrayBuffer = event.target?.result;
      if (arrayBuffer) {
        const buffer = Buffer.from(arrayBuffer as Buffer);
        const base64String = buffer.toString("base64");
        props.handleUpdateRegistration("image", `data:${file.type};base64,${base64String}`);
      }
    };
  }
  return (
    <div className={styles["form"]}>
      <div className={styles.profile}>
        <input
          className={styles["file"]}
          type="file"
          name="Picture"
          id="picture"
          accept="image/*"
          onChange={async (event: ChangeEvent) => {
            let response = event.target as HTMLInputElement;
            if (!response) return;

            let files = response.files;
            if (!files) return;

            handleImageConversion(files[0]);
          }}
        />
        <div className={styles["file-button"]}>
          {!props.registration.image && <AddButton />}
          {props.registration.image && (
            <img
              src={props.registration.image}
              alt={"Profile-Picture"}
              className={styles["file-image"]}
            />
          )}
        </div>
      </div>
      <input
        className={styles.input}
        aria-label="Name"
        type="name"
        placeholder="Name"
        onChange={(event: ChangeEvent) =>
          props.handleUpdateRegistration(
            "name",
            (event.target as HTMLInputElement).value
          )
        }
      />
      <input
        className={styles.input}
        aria-label="Surname"
        type="text"
        placeholder="Surname"
        onChange={(event: ChangeEvent) =>
          props.handleUpdateRegistration(
            "surname",
            (event.target as HTMLInputElement).value
          )
        }
      />
      <input
        className={styles.input}
        aria-label="Date of Birth"
        type="date"
        placeholder="Date of Birth"
        onChange={(event: ChangeEvent) =>
          props.handleUpdateRegistration(
            "dob",
            (event.target as HTMLInputElement).value
          )
        }
      />
      <input
        className={styles.input}
        aria-label="City"
        type="text"
        placeholder="City"
        onChange={(event: ChangeEvent) =>
          props.handleUpdateRegistration(
            "city",
            (event.target as HTMLInputElement).value
          )
        }
      />
      <input
        className={styles.input}
        aria-label="Country"
        type="text"
        placeholder="Country"
        onChange={(event: ChangeEvent) =>
          props.handleUpdateRegistration(
            "country",
            (event.target as HTMLInputElement).value
          )
        }
      />
      <div className={styles.section}>
        <button
          className={styles.button}
          onClick={() => props.handleRegistration()}
          type="button"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
