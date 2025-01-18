import { formatRelative } from "date-fns";
import { FC, useContext, useEffect, useMemo } from "react";
import { MessageType, User } from "@/utils/types";
import { AuthContext } from "@/utils/context/AuthContext";
import { useTypedSelector } from "@/redux";
import styles from "../ConversationSidebar/ConversationSidebar.module.css";

type Props = {
  id: number;
};

type FormattedMessageProps = {
  user?: User;
  message: MessageType;
};
export const FormattedMessage: FC<FormattedMessageProps> = ({
  user,
  message,
}) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        alignItems: "center",
        padding: "5px 0",
        wordBreak: "break-all",
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          backgroundColor: "#ee4343",
        }}
      />
      <div>
        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          <span
            className="authorName"
            style={{
              color: user?.id === message.author.id ? "#0e2317" : "#5E8BFF",
            }}
          >
            {message.author.firstName} {message.author.lastName}
          </span>
          <span style={{ color: "#757575" }}>
            {formatRelative(new Date(message.createdAt), new Date())}
          </span>
        </div>
        <div>{message.content}</div>
      </div>
    </div>
  );
};

export const MessageContainer: FC<Props> = ({ id }) => {
  const { user } = useContext(AuthContext);
  const { messages, loading } = useTypedSelector((state) => state.messages);
  const currentConversationMessages = useMemo(
    () => messages.find((m) => m.id === id),
    [messages]
  );
  const emptyMessageList =
    !currentConversationMessages ||
    !currentConversationMessages?.messages.length;

  const formatMessages = () => {
    if (emptyMessageList) {
      return <p>There are no messages yet...</p>;
    }

    return currentConversationMessages?.messages.map(
      (m, index: number, arr) => {
        const nextIndex = index + 1;
        const currentMessage = arr[index];
        const nextMessage = arr[nextIndex];

        if (arr.length === nextIndex)
          return <FormattedMessage key={m.id} user={user} message={m} />;

        if (currentMessage.author.id === nextMessage.author.id) {
          return (
            <div
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
                padding: "5px 0",
              }}
              key={m.id}
            >
              <div style={{ padding: "0 0 0 70px" }}>{m.content}</div>
            </div>
          );
        }
        return <FormattedMessage key={m.id} user={user} message={m} />;
      }
    );
  };

  useEffect(() => {
    formatMessages();
  });

  return (
    <div
      style={{
        height: "calc(100% - 65px)",
        boxSizing: "border-box",
        padding: " 10px 0",
        display: "flex",
        flexDirection: "column-reverse",
        overflowY: "auto",
        ...(emptyMessageList
          ? { justifyContent: "center", alignItems: "center" }
          : {}),
        /*  &::-webkit-scrollbar {
    display: none;
  } */
      }}
      className={styles.scrollbar}
      data-attr="messages-list"
    >
      {loading ? <p>Loading...</p> : formatMessages()}
    </div>
  );
};
