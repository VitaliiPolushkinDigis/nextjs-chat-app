import { useAppDispatch, useTypedSelector } from "@/redux";
import { fetchConversationsThunk } from "@/redux/slices/conversationSlice";
import { addMessage, fetchMessages } from "@/redux/slices/messageSlice";
import { usePostConversationMutation } from "@/utils/api";
import { AuthContext } from "@/utils/context/AuthContext";
import { SocketContext } from "@/utils/context/SocketContext";
import { ConversationType, MessageEventPayload } from "@/utils/types";
import { FC, useContext, useEffect, useState } from "react";
import Page from "../layouts/page/Page";
import ConversationSidebar from "../ConversationSidebar/ConversationSidebar";
import MessagePanel from "../messages/MessagePanel";
import styles from "../sidebar/Sidebar.module.css";

interface ConversationsProps {}

const ConversationPage: FC<ConversationsProps> = () => {
  const dispatch = useAppDispatch();
  const u = useTypedSelector((state) => state.user);
  const { user } = useContext(AuthContext);
  const [createConversation, result] = usePostConversationMutation();

  const [selectedConversation, setSelectedConversation] = useState<
    ConversationType | undefined
  >();

  const socket = useContext(SocketContext);

  useEffect(() => {
    dispatch(fetchConversationsThunk());
  }, [dispatch, result.data]);

  useEffect(() => {
    if (selectedConversation?.id) {
      dispatch(fetchMessages(selectedConversation.id));
    }
  }, [dispatch, selectedConversation]);

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
  }, [selectedConversation]);

  return (
    <Page display="flex" {...{ user: user || u.user }}>
      <ConversationSidebar
        createConversation={createConversation}
        selectedConversation={selectedConversation}
        setSelectedConversation={(c) => setSelectedConversation(c)}
      />
      {!selectedConversation ? (
        <p
          className={styles.noConversationSelectedText}
          data-attr="conversation-content"
        >
          Select the chat to see the conversation
        </p>
      ) : (
        <div className={styles.messagesWrapper}>
          <MessagePanel
            selectedConversation={selectedConversation}
          ></MessagePanel>
        </div>
      )}
    </Page>
  );
};

export default ConversationPage;
