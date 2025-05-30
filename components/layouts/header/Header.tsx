import { Logo } from "@/components/icons/Logo";
import { User } from "@/utils/types";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import styles from "./Header.module.css";
import { useLogoutMutation } from "@/utils/api";

interface HeaderProps {
  id?: number;
  firstName?: string;
  user?: User;
}

const Header: FC<HeaderProps> = (props) => {
  const router = useRouter();
  const [logout, { isLoading }] = useLogoutMutation();

  const [isMenuOpen, setIsOpenMenu] = useState(false);

  const handleLoginOut = async () => {
    await logout().then((res) => {
      console.log("logout, component", res);

      router.push("/login");
    });
  };

  const linkStyles = {
    fontSize: "22px",
    textShadow:
      "-1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white",
    display: "block",
  };

  return (
    <div className={styles.wrapper}>
      <div
        style={{ cursor: "pointer" }}
        onClick={() => setIsOpenMenu((p) => !p)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          width="24px"
          height="24px" // Ensure height matches for better click area
          style={{ pointerEvents: "all" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
          />
        </svg>
      </div>

      {
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "16px",
            width: "240px",
            height: "auto",
            backgroundColor: "white",
            border: "1px solid #ccc",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            padding: "10px",
            zIndex: 10,
            transition: "opacity 0.3s ease, transform 0.3s ease",
            opacity: isMenuOpen ? 1 : 0,
            transform: isMenuOpen ? "translateY(0)" : "translateY(-20px)",
            pointerEvents: isMenuOpen ? "auto" : "none",
            borderRadius: "16px",
          }}
          onClick={() => setIsOpenMenu(false)}
        >
          <Link
            style={{ marginRight: "50px", ...linkStyles }}
            href={`/profile/${props.user?.id || props?.id}`}
          >
            Profile
          </Link>
          <Link
            style={{ marginRight: "50px", ...linkStyles }}
            href="/conversations"
          >
            Conversations
          </Link>
          <Link style={{ marginRight: "50px", ...linkStyles }} href="/users">
            Users
          </Link>
          {/* <Link style={{ marginRight: "50px", ...linkStyles }} href="/shop">
            Shop
          </Link> */}
          <Link style={{ marginRight: "50px", ...linkStyles }} href="/peer">
            Video Chat: <span style={{ fontSize: "12px" }}>(in dev)</span>
          </Link>
          <div>
            <button
              disabled={isLoading}
              onClick={handleLoginOut}
              className="btn btn-sm"
              style={{
                textTransform: "capitalize",
                ...linkStyles,
                color: "grey",
              }}
            >
              {props?.id ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      }
    </div>
  );
};

export default Header;
