import { FC, FormEvent, useState } from "react";

import { MessageContainer } from "./MessageContainer";
import { MessageInputField } from "./MessageInputField";
import { MessagePanelHeader } from "./MessagePanelHeader";
import { postNewMessage } from "@/utils/api";
import { ConversationType } from "@/utils/types";

interface MessagePanelProps {
  selectedConversation?: ConversationType;
}

const MessagePanel: FC<MessagePanelProps> = ({ selectedConversation }) => {
  const [message, setMessage] = useState("");
  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedConversation?.id || !message) return;
    try {
      postNewMessage({
        conversationId: selectedConversation.id,
        content: message,
      });
    } catch (error) {
      console.log("err", error);
    }

    console.log("send", message);
    setMessage("");
  };
  return (
    <>
      <MessagePanelHeader />
      <MessageContainer id={selectedConversation?.id || 0} />
      <MessageInputField
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </>
  );
};

export default MessagePanel;
