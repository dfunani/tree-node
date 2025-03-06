import styles from "@/src/public/styles/button.module.css";

import Image, { StaticImageData } from "next/image";

type Props = {
  image: string | null | StaticImageData;
  name: string;
  toggleMenu: () => void;
};

export default function ProfilePicture(props: Props) {
  return (
    <button
      className={styles["profile-pill"]}
      onClick={() => props.toggleMenu()}
    >
      {props.image ? (
        <Image
          src={props.image as string}
          alt="Profile-Picture"
          width={40}
          height={40}
        />
      ) : (
        <div>{props.name ? props.name[0].toUpperCase() : ""}</div>
      )}
    </button>
  );
}
