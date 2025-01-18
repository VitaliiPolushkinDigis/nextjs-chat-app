import { useApi } from "@/utils/api";
import { UserCredentialsParams } from "@/utils/types";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useContext } from "react";
import { useToasts } from "react-toast-notifications";
import { TextFieldComponent } from "../../components/TextFieldComponent/TextFieldComponent";

import { useAppDispatch, useTypedSelector } from "@/redux";
import { getAuth, loginUser } from "@/redux/slices/userSlice";
import { AuthContext } from "@/utils/context/AuthContext";
import styles from "../../components/forms/LoginForm/LoginForm.module.css";
import { validationSchemaLogin } from "@/components/forms/LoginForm/LoginForm.helper";

interface LoginFormProps {}

const LoginForm: FC<LoginFormProps> = () => {
  const { addToast } = useToasts();
  const dispatch = useAppDispatch();
  const { user, loading, error } = useTypedSelector((state) => state.user);
  const { updateUser } = useContext(AuthContext);

  const router = useRouter();
  const formik = useFormik({
    initialValues: { password: "", email: "" },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: validationSchemaLogin,
    onSubmit: (values, actions) => {
      submitForm(values);
      /*  actions.resetForm({}); */
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

  const submitForm = async (values: UserCredentialsParams) => {
    try {
      const res = await dispatch(loginUser(values));
      if (!(res as any).error) {
        addToast("Login Successfully", { appearance: "success" });
        const getStatus = await dispatch(getAuth());
        const status = await useApi.status();
        updateUser(status);
        router.push(`/profile/${(getStatus.payload as any).id}`);
      } else {
        addToast("Login Unsuccessfully", { appearance: "error" });
      }
    } catch (error) {
      console.error(error);
      addToast("Login Unsuccessfully", { appearance: "error" });
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
          Welcome! Login with your email and password
        </div>
        <div>
          <TextFieldComponent
            placeholder="Your email"
            name="email"
            value={values.email ? values.email : ""}
            onChange={handleChange}
            onBlur={handleBlur}
            setFieldTouched={setFieldTouched}
            errorText={errors.email}
            fullWidth
            helperText
            label="Your Email"
            dataAttr="email"
          />
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
        <div className={styles.btnsWrapper}>
          <button
            className={`${styles.btn} ${styles.submitBtn}`}
            type="submit"
            color="primary"
            data-attr="submit"
            style={{ marginRight: "16px" }}
          >
            Submit
          </button>
          <button
            type="reset"
            className={`${styles.btn}`}
            onClick={() => resetForm()}
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
          <Link data-attr="register-link" href="/register">
            Dont have an account? Register.
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
