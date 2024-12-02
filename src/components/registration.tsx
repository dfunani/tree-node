import { ChangeEvent } from "react";

import styles from "@/src/public/styles/auth.module.css";
import { Registrations } from "@/src/public/utils/types";

type Registration = Omit<Registrations, "email" | "password">;

type Props = {
  registration: Registration;
  handleUpdateRegistration: (key: string, value: string) => void;
  handleRegistration: () => void;
};
export default function Registration(props: Props) {
  return (
    <div className={styles["form"]}>
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
