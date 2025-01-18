import { FC, PropsWithChildren } from "react";
import styles from "./Sidebar.module.css";

interface Props extends PropsWithChildren {
  collapsed?: boolean;
}

export const Sidebar: FC<Props> = ({ children, collapsed }) => {
  return (
    <div
      className={`${styles.wrapper} ${styles.scrollbar} ${
        collapsed ? styles.collapsed : ""
      }`}
    >
      {children}
    </div>
  );
};
