import { User } from "@/utils/types";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface HeaderProps {
  id?: string;
  firstName?: string;
  user?: User;
}

const Header: FC<HeaderProps> = (props) => {
  const router = useRouter();
  const handleLoginOut = () => {
    router.push("/login");
  };

  console.log("props", props);

  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        position: "fixed",
        width: "100vw",
        zIndex: 10,
      }}
    >
      <Link href="/">ChatApp</Link>

      <Box style={{ display: "flex", alignItems: "center" }}>
        <Link
          style={{ marginRight: "50px" }}
          href={`/profile/${props.user?.id || props?.id}`}
        >
          Profile
        </Link>
        <Link style={{ marginRight: "50px" }} href="/conversations">
          Conversations
        </Link>
        <Link style={{ marginRight: "50px" }} href="/shop">
          Shop
        </Link>
        <Link style={{ marginRight: "50px" }} href="/peer">
          Video Chat
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
