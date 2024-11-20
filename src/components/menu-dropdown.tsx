import styles from "@/components/dropdown.module.css"

export default function MenuDropdown() {
    return <div className={styles["dropdown-menu"]}>
        <ul>
            <li><a href="#">Option 1</a></li>
            <li><a href="#">Option 2</a></li>
            <li><a href="#">Option 3</a></li>
        </ul>
    </div>
}