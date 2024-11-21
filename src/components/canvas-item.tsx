import Image, { StaticImageData } from "next/image";
import styles from "@/src/components/canvas.module.css";
import { Handle, Position } from "@xyflow/react";
import { buildDate } from "@/public/utils/factories";
import { v4 as uuid4 } from "uuid";

type Props = {
    data: any;
    isConnectable: boolean | undefined;
};


export default function CanvasItem(props: Props) {
    function renderHandlers() {
        const positions = [Position.Top, Position.Bottom, Position.Left, Position.Right]
        let result = []

        for (let position of positions) {
            result.push(
                <Handle
                    key={uuid4()}
                    type="source"
                    id={`${position.toString()}-1`}
                    position={position}
                    // style={{ [offsets]: offset }}
                    isConnectable={props.isConnectable}
                />
            )
            result.push(
                <Handle
                    key={uuid4()}
                    type="target"
                    id={`${position.toString()}-1`}
                    position={position}
                    // style={{ [offsets]: offset + offset / 2 }}
                    isConnectable={props.isConnectable}
                />
            )
        }

        return result
    }

    return (
        <div className={styles["node-item"]}>
            {renderHandlers()}

            <Image
                className={styles["node-img"]}
                src={props.data.image}
                alt={"props.label"}
            />

            <div className={styles["node-content"]}>
                <h3 className={styles["node-name"]}>{`${props.data.fullName[0]} ${props.data.fullName[1]}`}</h3>
                <p className={styles["node-location"]}>{`${props.data.location[0]}, ${props.data.location[1]}`}</p>
                <p className={styles["node-dob"]}>{buildDate(props.data.dob)}</p>
            </div>
        </div>
    );
}
