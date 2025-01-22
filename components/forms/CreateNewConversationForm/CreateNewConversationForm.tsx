import { useFormik } from "formik";
import { FC, useState } from "react";
import { useGetUsersWithoutConversationsQuery } from "@/utils/api";
import { useToasts } from "react-toast-notifications";

interface CreateNewConversationFormProps {
  onClose: () => void;
  createConversation: any;
}

const CreateNewConversationForm: FC<CreateNewConversationFormProps> = ({
  onClose,
  createConversation,
}) => {
  const {
    handleBlur,
    handleSubmit,
    setFieldTouched,
    values,
    handleChange,
    errors,
    resetForm,
  } = useFormik({
    initialValues: { name: "", message: "" },
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: false,
    /*  validationSchema: validationSchemaAccountBox, */
    onSubmit: (values, actions) => {
      submitForm();
      actions.resetForm({});
    },
  });

  const { data, isLoading } = useGetUsersWithoutConversationsQuery({
    withoutConversationWithMe: true,
  });
  const [selectedUserForNewConversation, setSelectedUserForNewConversation] =
    useState<number | undefined>();
  const { addToast } = useToasts();

  const submitForm = async () => {
    try {
      if (selectedUserForNewConversation) {
        createConversation({
          recipientId: selectedUserForNewConversation,
          message: "test",
        }).then(() => {
          addToast("Created!");
          onClose();
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h3>Select the user and start a conversation</h3>

      <form
        style={{ width: "100%", marginTop: "16px" }}
        onSubmit={handleSubmit}
      >
        <div style={{ overflowY: "auto", maxHeight: "70vh" }}>
          {data
            ? data.map((u) => (
                <p
                  style={{
                    cursor: "pointer",
                    marginBottom: "16px",
                    background:
                      selectedUserForNewConversation === u.id
                        ? "#378158"
                        : "transparent",
                    textTransform: "capitalize",
                  }}
                  key={u.id}
                  onClick={() => setSelectedUserForNewConversation(u.id)}
                >{`${u.firstName} ${u.lastName}`}</p>
              ))
            : "Loading..."}
        </div>

        <button
          className="btn submitBtn"
          type="submit"
          color="primary"
          style={{ marginTop: "16px" }}
        >
          Create new Conversation
        </button>
      </form>
    </div>
  );
};

export default CreateNewConversationForm;
