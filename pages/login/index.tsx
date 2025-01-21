import { useApi, useLazyStatusQuery, useLoginMutation } from "@/utils/api";
import { UserCredentialsParams } from "@/utils/types";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useContext } from "react";
import { useToasts } from "react-toast-notifications";
import { TextFieldComponent } from "../../components/TextFieldComponent/TextFieldComponent";
import { AuthContext } from "@/utils/context/AuthContext";
import styles from "../../components/forms/LoginForm/LoginForm.module.css";
import { validationSchemaLogin } from "@/components/forms/LoginForm/LoginForm.helper";

interface LoginFormProps {}

const LoginForm: FC<LoginFormProps> = () => {
  const { addToast } = useToasts();
  const { updateUser } = useContext(AuthContext);
  const [login, { isLoading }] = useLoginMutation();
  const [getStatus] = useLazyStatusQuery();
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
    touched,
  } = formik;

  const submitForm = async (values: UserCredentialsParams) => {
    try {
      const { access_token } = await login(values).unwrap();

      if (access_token) {
        addToast("Login Successfully", { appearance: "success" });

        const { data } = await getStatus();

        updateUser(data);
        router.push(`/profile/${data.id}`);
      } else {
        addToast("Login Unsuccessfully", { appearance: "error" });
      }
    } catch (error) {
      console.error("ERRORORORO", error);
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
            onBlur={(e) => {
              handleBlur(e);
              setFieldTouched("email", true);
            }}
            setFieldTouched={setFieldTouched}
            errorText={errors.email}
            fullWidth
            helperText
            label="Your Email"
            dataAttr="email"
            touched={touched.email}
            disabled={isLoading}
          />
        </div>
        <div>
          <TextFieldComponent
            placeholder="Your password"
            name="password"
            value={values.password ? values.password : ""}
            onChange={handleChange}
            onBlur={(e) => {
              handleBlur(e);
              setFieldTouched("password", true);
            }}
            setFieldTouched={setFieldTouched}
            errorText={errors.password}
            fullWidth
            helperText
            label="Your password"
            dataAttr="password"
            type="password"
            touched={touched.password}
            disabled={isLoading}
          />
        </div>
        <div className={styles.btnsWrapper}>
          <button
            disabled={isLoading}
            className={`${styles.btn} ${styles.submitBtn}`}
            type="submit"
            color="primary"
            data-attr="submit"
            style={{ marginRight: "16px" }}
          >
            Submit
          </button>
          <button
            disabled={isLoading}
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
