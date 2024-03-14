import { Box, Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface HeaderProps {
  id?: string;
  firstName?: string;
}

const Header: FC<HeaderProps> = (props) => {
  const router = useRouter();
  const handleLoginOut = () => {
    router.push("/login");
  };

  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        backgroundImage:
          "linear-gradient( 89.7deg,rgba(255,255,255,0.7) 1.1%, rgba(223,0,80,1) 3.7%, rgba(29,255,255,1) 61.5%, rgba(5,17,255,1) 76.4%, rgba(202,0,253,1) 92.4%, rgba(255,255,255,1) 100.2% )",
      }}
    >
      <Link href="/">ChatApp</Link>

      <Box style={{ display: "flex", alignItems: "center" }}>
        <Link style={{ marginRight: "50px" }} href="/conversations">
          Conversations
        </Link>
        <Link style={{ marginRight: "50px" }} href="/shop">
          Shop
        </Link>
        <Link style={{ marginRight: "50px" }} href="/peer">
          WebRTC
        </Link>
        <Box>{props?.firstName}</Box>
        <Box>
          <Button onClick={handleLoginOut}>
            {props?.id ? "Logout" : "Login"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
