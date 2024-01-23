import { AuthContext } from "@/utils/context/AuthContext";
import { useAuth } from "@/utils/hooks/useAuth";
import { Box } from "@mui/material";
import { FC, useContext } from "react";

interface ConversationsProps {}

const Conversations: FC<ConversationsProps> = () => {
  const { loading } = useAuth();
  const { user } = useContext(AuthContext);

  return <Box>conversations</Box>;
};

export default Conversations;
