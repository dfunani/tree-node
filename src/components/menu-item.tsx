import Image, { StaticImageData } from "next/image";
import { DragEvent } from "react";

import { Position } from "@/src/public/utils/types";
import styles from "@/src/components/dropdown.module.css";

type Props = {
  src: StaticImageData | string;
  label: string;
  onDragItem: (position: Position, src: Props["src"]) => void;
};
export default function MenuItem(props: Props) {
  return (
    <li
      onDragEndCapture={(event: DragEvent) =>
        props.onDragItem({ x: event.clientX, y: event.clientY }, props.src)
      }
    >
      <div className={styles["card-item"]}>
        <Image src={props.src} alt={props.label} />
      </div>
    </li>
  );
}
