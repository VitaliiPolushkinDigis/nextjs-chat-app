import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { FC, useContext, useState } from "react";
import CreateNewConversationForm from "../forms/CreateNewConversationForm/CreateNewConversationForm";
import SimpleModal from "../modals/SimpleModal";
import ConversationCreateBtn from "./ConversationCreateBtn/ConversationCreateBtn";
import { useAuth } from "@/utils/hooks/useAuth";
import { AuthContext } from "@/utils/context/AuthContext";
import { useTypedSelector } from "@/redux";
import Link from "next/link";
import { ConversationType } from "@/utils/types";
import { useStyles } from "./ConversationSidebar.styles";

const ConversationSidebar: FC = ({}) => {
  const [showModal, setShowModal] = useState(false);
  const styles = useStyles();
  const { user } = useContext(AuthContext);

  const { conversations } = useTypedSelector((state) => state.conversations);

  const getDisplayUser = (conversation: ConversationType) => {
    return conversation.creator.id === user?.id
      ? conversation.recipient
      : conversation.creator;
  };

  return (
    <Grid
      sx={{
        top: "0",
        left: "0",
        height: "100vh",
        padding: "12px",
        position: "fixed",
        paddingTop: "36px",
      }}
      width={"360px"}
      bgcolor={"linear-gradient(90deg, #0000003d, #00000000);"}
    >
      <SimpleModal
        open={showModal}
        handleClose={() => setShowModal(false)}
        padding="20px"
      >
        <CreateNewConversationForm />
      </SimpleModal>
      <h1>ConversationSidebar</h1>
      <Grid display="flex" justifyContent={"flex-end"}>
        <ConversationCreateBtn showModal={() => setShowModal(true)} />
      </Grid>
      {conversations.map((conversation) => (
        <Link
          style={{ textDecoration: "none" }}
          key={conversation.id}
          href={`/conversations/${conversation.id}`}
        >
          <Box className={styles.conversations}>
            <Box
              sx={{
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                background: "#3a9",
              }}
              data-attr="avatar"
            ></Box>
            <Box>
              <Typography>
                Write to:{" "}
                {`${getDisplayUser(conversation).firstName} ${
                  getDisplayUser(conversation).lastName
                }`}
              </Typography>
              <Typography>Creator: {conversation.creator.email}</Typography>
              <Typography>Recipient: {conversation.recipient.email}</Typography>
            </Box>
          </Box>
        </Link>
      ))}
    </Grid>
  );
};

export default ConversationSidebar;
