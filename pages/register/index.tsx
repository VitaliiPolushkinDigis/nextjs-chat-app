import { Button, Grid, Typography } from "@mui/material";
import { useFormik } from "formik";
import { FC } from "react";

import { useApi } from "@/utils/api";
import { CreateUserParams } from "@/utils/types";
import Link from "next/link";
import { useToasts } from "react-toast-notifications";
import { TextFieldComponent } from "../../components/TextFieldComponent/TextFieldComponent";
import styles from "@/components/forms/LoginForm/LoginForm.module.css";
import { validationSchemaRegister } from "@/components/RegisterForm/RegisterForm.helper";
import { useRouter } from "next/navigation";

interface RegisterFormProps {}

const RegisterForm: FC<RegisterFormProps> = () => {
  const { addToast } = useToasts();
  const router = useRouter();
  /*  const styles = useStyles(); */
  const formik = useFormik({
    initialValues: {
      password: "",
      repeatPassword: "",
      email: "",
      firstName: "",
      lastName: "",
    },
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: false,
    validationSchema: validationSchemaRegister,
    onSubmit: (values, actions) => {
      const { repeatPassword, ...dataToSend } = values;
      submitForm(dataToSend as any);
      actions.resetForm({});
    },
  });
  const {
    handleBlur,
    handleSubmit,
    setFieldTouched,
    values,
    handleChange,
    errors,
    resetForm,
  } = formik;

  const submitForm = async (data: CreateUserParams) => {
    try {
      await useApi.register(data).then(() => {
        addToast("Registered Successfully", { appearance: "success" });
        router.push("/login");
      });
    } catch (error: any) {
      addToast(error.response.data.message, { appearance: "error" });
    }
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit} data-attr="form">
        <div
          style={{
            fontSize: "22px",
            marginBottom: "16px",
            color: "primary.main",
          }}
        >
          Welcome! Fill the form to register new account
        </div>
        <div>
          <TextFieldComponent
            placeholder="Your email"
            name="email"
            value={values.email || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            setFieldTouched={setFieldTouched}
            errorText={errors.email}
            fullWidth
            dataAttr="email"
            label="Your Email"
            helperText
          />
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ marginRight: "16px" }}>
            <TextFieldComponent
              placeholder="Your First Name"
              name="firstName"
              value={values.firstName || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              setFieldTouched={setFieldTouched}
              errorText={errors.firstName}
              fullWidth
              dataAttr="firstName"
              label="Your First Name"
            />
          </div>
          <div>
            <TextFieldComponent
              placeholder="Your Last Name"
              name="lastName"
              value={values.lastName || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              setFieldTouched={setFieldTouched}
              errorText={errors.lastName}
              fullWidth
              dataAttr="lastName"
              label="Your Last Name"
            />
          </div>
        </div>
        <div>
          <TextFieldComponent
            placeholder="Your password"
            name="password"
            value={values.password ? values.password : ""}
            onChange={handleChange}
            onBlur={handleBlur}
            setFieldTouched={setFieldTouched}
            errorText={errors.password}
            fullWidth
            label="Your password"
            dataAttr="password"
            type="password"
          />
        </div>
        <div>
          <TextFieldComponent
            placeholder="Your password"
            name="repeatPassword"
            value={values.repeatPassword ? values.repeatPassword : ""}
            onChange={handleChange}
            onBlur={handleBlur}
            setFieldTouched={setFieldTouched}
            errorText={errors.repeatPassword}
            fullWidth
            label="Repeat your password"
            dataAttr="password-repeat"
            type="password"
          />
        </div>
        <div className={styles.btnsWrapper}>
          <button
            className={`${styles.btn} ${styles.submitBtn}`}
            data-attr="submit"
            type="submit"
            color="primary"
            style={{ marginRight: "16px" }}
          >
            Submit
          </button>
          <button
            type="reset"
            onClick={() => resetForm()}
            className={`${styles.btn}`}
          >
            Reset
          </button>
        </div>
        <p
          style={{
            marginTop: "16px",
            textAlign: "center",
            color: "primary.main",
            textDecoration: "underline",
          }}
        >
          <Link href="/login">Already have an account? Login.</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
