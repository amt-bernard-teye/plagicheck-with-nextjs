import Image from "next/image";

import styles from "./user-profile.module.css";
import Person from "@/components/atoms/icons/person";

export default function UserProfile() {
  let hasImage = false;
  
  return (
    <div className={styles.profile}>
      <div className={styles.profileImage}>
        {!hasImage 
          ? <div className={styles.profileIcon}>
              <Person />
            </div>
          : <Image 
              src="/profile.jpg" 
              className={styles.profileImg} 
              alt="User profile image"
              fill/>
        }
        <span className={styles.profileIndicator}></span>
      </div>
      <div className={styles.profileDetails}>
        <h5 className={styles.profileName}>Esther Howard</h5>
        <p className={styles.profileEmail}>estherhoward@gmail.com</p>
      </div>
    </div>
  );
}