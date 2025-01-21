import { useAppDispatch, useTypedSelector } from "@/redux";
import { fetchConversationsThunk } from "@/redux/slices/conversationSlice";

import { FC, useContext, useEffect, useState } from "react";
import ConversationSidebar from "../../components/ConversationSidebar/ConversationSidebar";
import Page from "../../components/layouts/page/Page";
import { AuthContext } from "@/utils/context/AuthContext";
import { usePostConversationMutation } from "@/utils/api";
import { SocketContext } from "@/utils/context/SocketContext";
import { addMessage, fetchMessages } from "@/redux/slices/messageSlice";
import { ConversationType, MessageEventPayload } from "@/utils/types";
import MessagePanel from "@/components/messages/MessagePanel";
import styles from "../../components/sidebar/Sidebar.module.css";

import dynamic from "next/dynamic";

// Dynamically import the component with ssr: false to disable SSR
const ConversationsPageComponent = dynamic(
  () => import("../../components/ConversationPage/ConversationsPage"),
  {
    ssr: false,
  }
);

interface ConversationsProps {}

const ConversationPage: FC<ConversationsProps> = () => {
  return <ConversationsPageComponent />;
};

export default ConversationPage;
