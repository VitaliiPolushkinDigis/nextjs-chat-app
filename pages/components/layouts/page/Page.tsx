import { FC, ReactNode } from "react";
import { classes, Root } from "./Page.helper";
import Header from "../header/Header";

interface PageProps {
  children: ReactNode;
  display?: string;
  justifyContent?: string;
  background?: string;
}

const Page: FC<PageProps> = ({
  children,
  display = "block",
  background = "#fff",
  justifyContent = "center",
  ...rest
}) => {
  return (
    <Root
      display={display}
      justifyContent={justifyContent}
      background={background}
      className={classes.root}
    >
      <Header {...rest} />
      {children}
    </Root>
  );
};

export default Page;
