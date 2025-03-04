// app/not-found.js
import styles from "@/src/app/not-found.module.css";

import Link from "next/link";
import Image from "next/image";

import not_found_image from "@/src/public/images/not-found.jpg";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404 - Page Not Found</h1>
        <p className={styles.message}>
          Oops! It looks like you&apos;ve wandered off the path.
        </p>
        <Image
          src={not_found_image}
          alt="Lost in the Woods"
          className={styles.image}
          width={600}
          height={300}
        />
        <div className={styles.navigation}>
          <Link href="/">
            <div className={styles.link}>Go back home</div>
          </Link>
          {/* Add more navigation links as needed */}
        </div>
      </div>
    </div>
  );
}
