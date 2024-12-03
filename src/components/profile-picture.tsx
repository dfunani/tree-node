import styles from "@/src/components/button.module.css";
import { signOut } from "next-auth/react";

type Props = {
  image: string;
  name: string;
};
export default function ProfilePicture(props: Props) {
  return (
    <button className={styles["profile-pill"]} onClick={() => signOut()}>
      {!props.image ? (
        <img src={props.image} alt="Profile-Picture" />
      ) : (
        <div>{props.name.toUpperCase()}</div>
      )}
    </button>
  );
}
