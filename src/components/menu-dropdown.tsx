import { ReactNode } from "react"
import styles from "@/src/components/dropdown.module.css"

type Props = {
    children: ReactNode
}

export default function MenuDropdown(props: Props) {
    return <div className={styles["dropdown-menu"]}>
        <ul>
            {props.children}
        </ul>
    </div>
}