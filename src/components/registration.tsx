import { ChangeEvent } from "react";

import styles from "@/src/public/styles/auth.module.css";
import AddButton from "./addButton";
import { RegistrationType } from "@/src/public/types/user";
import { handleImageConversion } from "@/src/public/utils/converters";

type Props = {
  registration: Omit<RegistrationType, "email" | "password">;
  handleUpdateRegistration: (key: string, value: any) => void;
  handleRegistration: () => void;
};
export default function Registration(props: Props) {
  async function handleUpdateImage(file: File) {
    const image = await handleImageConversion(file);
    props.handleUpdateRegistration(
      "image",
      `data:${file.type};base64,${image}`
    );
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
          required
          onChange={async (event: ChangeEvent) => {
            let response = event.target as HTMLInputElement;
            if (!response) return;

            let files = response.files;
            if (!files) return;

            handleUpdateImage(files[0]);
          }}
        />
        <div className={styles["file-button"]}>
          {!props.registration.image && <AddButton />}
          {props.registration.image && (
            <img
              src={props.registration.image as string}
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
        required
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
        required
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
        required
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
        required
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
        required
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
