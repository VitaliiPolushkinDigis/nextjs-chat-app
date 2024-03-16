import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

interface Props {
  display: string;
  justifyContent: string;
  background: string;
}

const PREFIX = "Page";

export const classes = {
  root: `${PREFIX}-page`,
};

export const Root = styled(Grid)<Props>(
  ({ theme, background, display, justifyContent }) => ({
    [`&.${classes.root}`]: {
      display: display,
      justifyContent: justifyContent,
      minHeight: "100vh",
      background: background,
      backgroundImage:
        "url(https://img.freepik.com/free-photo/vivid-blurred-colorful-wallpaper-background_58702-2902.jpg?w=1380&t=st=1710624129~exp=1710624729~hmac=ced8d0af16d8ea23344f471736e4bae824b55d46812e8c8c4d98ae8f031b3bf4)",
    },
  })
);
