import { FC, useContext, useEffect } from "react";
import ConversationSidebar from "../components/ConversationSidebar/ConversationSidebar";
import Page from "../components/layouts/page/Page";
import { SocketContext } from "@/utils/context/SocketContext";
import { useAppDispatch } from "@/redux";
import { useParams } from "next/navigation";
import { MessageEventPayload } from "@/utils/types";
import { Grid } from "@mui/material";
import { addMessage, fetchMessages } from "@/redux/slices/messageSlice";
import MessagePanel from "../components/messages/MessagePanel";

interface ConversationProps {}

const Conversation: FC<ConversationProps> = () => {
  const socket = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    const conversationId = parseInt((id as string)!);
    if (conversationId) dispatch(fetchMessages(conversationId));
  }, [dispatch, id]);

  useEffect(() => {
    socket.on("connected", () => console.log("Connected"));
    socket.on("onMessage", (payload: MessageEventPayload) => {
      console.log("Message Received");
      const { conversation, ...message } = payload;
      dispatch(addMessage(payload));
    });
    return () => {
      socket.off("connected");
      socket.off("onMessage");
    };
  }, []);

  return (
    <Page>
      <ConversationSidebar />
      <Grid sx={{ marginLeft: "360px", height: "99vh" }}>
        <MessagePanel></MessagePanel>
      </Grid>
    </Page>
  );
};

export default Conversation;
