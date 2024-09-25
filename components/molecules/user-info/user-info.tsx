import Person from "@/components/atoms/icons/person";
import styles from "./user-info.module.css";

type UserInfoProps = {
  image: string | undefined | null;
  name: string;
}

export default function UserInfo({image, name}: UserInfoProps) {
  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <Person />
      </div>
      <span>{name}</span>
    </div>
  );
}