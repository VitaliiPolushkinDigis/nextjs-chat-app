import { FC, useContext, useEffect, useState } from "react";
import CreateNewConversationForm from "../forms/CreateNewConversationForm/CreateNewConversationForm";
import SimpleModal from "../modals/SimpleModal";
import ConversationCreateBtn from "./ConversationCreateBtn/ConversationCreateBtn";

import { AuthContext } from "@/utils/context/AuthContext";
import { useTypedSelector } from "@/redux";

import { ConversationType } from "@/utils/types";
import styles from "./ConversationSidebar.module.css";

import { Sidebar } from "../sidebar/Sidebar";
import classes from "../sidebar/Sidebar.module.css";
import Loader from "../Loader/Loader";

interface ConversationSidebarProps {
  createConversation: any;
  setSelectedConversation: (conversation: ConversationType) => void;
  selectedConversation?: ConversationType;
}

const ConversationSidebar: FC<ConversationSidebarProps> = ({
  createConversation,
  selectedConversation,
  setSelectedConversation,
}) => {
  const [showModal, setShowModal] = useState(false);

  const { user } = useContext(AuthContext);
  const [isCollapsed, setIsCollapsed] = useState<Boolean | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const { conversations, loading } = useTypedSelector(
    (state) => state.conversations
  );

  const getDisplayUser = (conversation: ConversationType) => {
    return conversation.creator.id === user?.id
      ? conversation.recipient
      : conversation.creator;
  };

  useEffect(() => {
    // Function to check if the device is mobile based on window width
    const checkSize = () => {
      setIsMobile(window.innerWidth <= 768); // Consider 768px or adjust as needed
    };

    // Call on component mount
    checkSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkSize);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("resize", checkSize);
    };
  }, []);

  return (
    <Sidebar
      collapsed={Boolean(selectedConversation?.id) && Boolean(isCollapsed)}
    >
      {isMobile && (
        <div
          className={classes.collapseIcon}
          onClick={() => setIsCollapsed((p) => !p)}
          style={
            isCollapsed === null
              ? { display: "none" }
              : !isCollapsed
              ? {
                  display: "block",
                  transform: "translateX(200px) rotate(180deg)",
                  transition: "translateX 0.3s ease-in-out",
                }
              : { display: "block", transition: "translateX 0.3s ease-in-out" }
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
      )}

      <SimpleModal
        open={showModal}
        handleClose={() => setShowModal(false)}
        padding="20px"
      >
        <CreateNewConversationForm
          onClose={() => setShowModal(false)}
          createConversation={createConversation}
        />
      </SimpleModal>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Your Chats</h1>
        <div>
          <ConversationCreateBtn showModal={() => setShowModal(true)} />
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        conversations.map((conversation) => (
          <div
            style={{
              ...(selectedConversation?.id === conversation.id
                ? {
                    backgroundSize: "cover",
                    backgroundImage:
                      "url(https://web.telegram.org/a/chat-bg-br.f34cc96fbfb048812820.png)",
                  }
                : {}),
              marginBottom: "8px",
              borderRadius: "16px",
              cursor: "pointer",
            }}
            key={conversation.id}
            onClick={() => {
              setSelectedConversation(conversation);
              setIsCollapsed(true);
            }}
          >
            <div className={styles.conversations}>
              <div
                style={{
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  backgroundSize: "cover",
                  backgroundImage:
                    "url(https://web.telegram.org/a/chat-bg-br.f34cc96fbfb048812820.png)",
                  marginRight: "8px",
                }}
                data-attr="avatar"
              ></div>
              <div>
                <div
                  style={{
                    ...(selectedConversation?.id === conversation.id
                      ? { color: "white", fontWeight: 600 }
                      : {}),
                    display: "-webkit-box",
                    WebkitLineClamp: 2, // Limit to 2 lines
                    WebkitBoxOrient: "vertical", // Vertical orientation for truncation
                    overflow: "hidden", // Hide overflow
                    textOverflow: "ellipsis", // Add ellipsis
                  }}
                  className={classes.conversationRecepient}
                >
                  <div className={classes.conversationWriteToText}>
                    Write to:{" "}
                  </div>
                  {`${getDisplayUser(conversation).firstName} ${
                    getDisplayUser(conversation).lastName
                  }`}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </Sidebar>
  );
};

export default ConversationSidebar;
