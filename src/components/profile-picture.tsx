import styles from "@/src/components/button.module.css";
import { signOut } from "next-auth/react";
import { StaticImageData } from "next/image";

type Props = {
  image: string | null | StaticImageData;
  name: string;
  toggleMenu: any;
};
export default function ProfilePicture(props: Props) {
  return (
    <button
      className={styles["profile-pill"]}
      onClick={() => props.toggleMenu()}
    >
      {props.image ? (
        <img src={props.image as string} alt="Profile-Picture" />
      ) : (
        <div>{props.name ? props.name[0].toUpperCase() : ""}</div>
      )}
    </button>
  );
}
