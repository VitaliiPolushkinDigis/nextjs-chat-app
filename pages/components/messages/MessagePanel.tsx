import { FC, FormEvent, useState } from "react";

import { MessageContainer } from "./MessageContainer";
import { MessageInputField } from "./MessageInputField";
import { MessagePanelHeader } from "./MessagePanelHeader";
import { useParams } from "next/navigation";
import { postNewMessage } from "@/utils/api";

interface MessagePanelProps {}

const MessagePanel: FC<MessagePanelProps> = ({}) => {
  const params = useParams();
  const id = params?.id;
  const [message, setMessage] = useState("");
  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id || !message) return;
    try {
      postNewMessage({
        conversationId: parseInt(id as string),
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
      <MessageContainer />
      <MessageInputField
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </>
  );
};

export default MessagePanel;
