import { useAppDispatch, useTypedSelector } from "@/redux";
import { fetchConversationsThunk } from "@/redux/slices/conversationSlice";
import { Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { FC, useContext, useEffect } from "react";
import ConversationSidebar from "../components/ConversationSidebar/ConversationSidebar";
import Page from "../components/layouts/page/Page";
import { AuthContext } from "@/utils/context/AuthContext";

interface ConversationsProps {}

const ConversationPage: FC<ConversationsProps> = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { conversations } = useTypedSelector((state) => state.conversations);
  const u = useTypedSelector((state) => state.user);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const data = dispatch(fetchConversationsThunk());
  }, [dispatch]);

  return (
    <Page {...{ user: user || u.user }}>
      <ConversationSidebar />
      {!params?.id && (
        <Typography
          sx={{ marginLeft: "360px" }}
          data-attr="conversation-content"
        >
          Select the chat to see the conversation
        </Typography>
      )}
    </Page>
  );
};

export default ConversationPage;
