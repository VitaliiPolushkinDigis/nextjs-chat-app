import { FC } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

interface ConversationCreateBtnProps {
  showModal: () => void;
}

const ConversationCreateBtn: FC<ConversationCreateBtnProps> = ({
  showModal,
}) => {
  return (
    <div
      onClick={showModal}
      style={{
        cursor: "pointer",
        borderRadius: "4px",
        background: "#378158",
        padding: "4px 6px",
        color: "white",
      }}
    >
      <span>New Chat</span>
    </div>
  );
};

export default ConversationCreateBtn;
