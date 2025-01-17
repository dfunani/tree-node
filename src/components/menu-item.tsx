import Image, { StaticImageData } from "next/image";
import { DragEvent } from "react";

import styles from "@/src/components/dropdown.module.css";
import { handleImageConversion } from "@/src/public/utils/converters";

type Props = {
  src: StaticImageData | string;
  label: string;
  onDragItem: (position: Position, src: Props["src"] | null) => void;
};
export default function MenuItem(props: Props) {
  async function handleUpdateImage(image: StaticImageData) {
    let response = await fetch(image.src);
    let blob = await response.blob();
    let base64String = await handleImageConversion(blob);
    if (response) return `data:image:png;base64,${base64String}`;
    return null
  }
  return (
    <li
      onDragEndCapture={async (event: DragEvent) =>
        props.onDragItem(
          { x: event.clientX, y: event.clientY },
          await handleUpdateImage(props.src as StaticImageData)
        )
      }
    >
      <div className={styles["card-item"]}>
        <Image src={props.src} alt={props.label} />
      </div>
    </li>
  );
}
