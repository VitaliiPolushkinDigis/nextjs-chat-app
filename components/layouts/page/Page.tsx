import { FC, ReactNode, useContext } from "react";
import styles from "./Page.module.css";
import Header from "../header/Header";
import { useTypedSelector } from "@/redux";
import { AuthContext } from "@/utils/context/AuthContext";
import { Box } from "@mui/material";

interface PageProps {
  children: ReactNode;
  display?: string;
  justifyContent?: string;
  background?: string;
}

const Page: FC<PageProps> = ({
  children,
  display = "block",
  background = "#f4f4f4",
  justifyContent = "start",
  ...rest
}) => {
  const u = useTypedSelector((state) => state.user);
  const { user } = useContext(AuthContext);
  return (
    <div
      className={`${styles.root} ${styles.scrollbar}`}
      style={{ display, justifyContent }}
    >
      <Header {...(user || u.user)} />
      {children}
    </div>
  );
};

export default Page;
