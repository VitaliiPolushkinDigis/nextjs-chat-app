import { Button, Grid, Typography } from "@mui/material";
import { useFormik } from "formik";
import { FC, useContext } from "react";
import { useToasts } from "react-toast-notifications";
import { TextFieldComponent } from "../components/TextFieldComponent/TextFieldComponent";
import { UserCredentialsParams } from "@/utils/types";
import { postLoginUser, useApi } from "@/utils/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setCookie } from "nookies";

import { Theme } from "@mui/material";
import { AuthContext } from "@/utils/context/AuthContext";
import { HttpStatusCode } from "axios";
import { useAppDispatch, useTypedSelector } from "@/redux";
import { getAuth, loginUser } from "@/redux/slices/userSlice";

/* export const useStyles = makeStyles((theme: Theme) => ({
  root: {
    background: "#eee",
    borderRadius: "15px",
    padding: "45px 30px",
    height: "100%",
    position: "relative",
  },
  registerForm: {
    "& > div": {
      marginBottom: "16px",
    },
  },
})); */

interface LoginFormProps {}

const LoginForm: FC<LoginFormProps> = () => {
  const { addToast } = useToasts();
  const dispatch = useAppDispatch();
  /*   const { user, updateUser } = useContext(AuthContext); */
  /* const styles = useStyles(); */
  const { user, loading, error } = useTypedSelector((state) => state.user);
  console.log(user, loading, error);

  const router = useRouter();
  const formik = useFormik({
    initialValues: { password: "", email: "" },
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: false,
    /*  validationSchema: validationSchemaAccountBox, */
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

        /*  const status = await useApi.status();
        updateUser(status); */
        /*  
      router.push("/conversations"); */
      } else {
        addToast("Login Unsuccessfully", { appearance: "error" });
      }
    } catch (error) {
      console.error(error);
      addToast("Login Unsuccessfully", { appearance: "error" });
    }
  };

  return (
    <form
      /* className={styles.registerForm} */
      onSubmit={handleSubmit}
      data-attr="form"
    >
      <Grid>
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
      </Grid>
      <Grid>
        <TextFieldComponent
          placeholder="Your password"
          name="password"
          value={values.password ? values.password : ""}
          onChange={handleChange}
          onBlur={handleBlur}
          setFieldTouched={setFieldTouched}
          errorText={errors.password}
          fullWidth
          helperText
          label="Your password"
          dataAttr="password"
        />
      </Grid>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        data-attr="submit"
      >
        Submit
      </Button>
      <Button
        type="reset"
        onClick={() => resetForm()}
        variant="outlined"
        color="info"
        size="large"
        fullWidth
      >
        Reset
      </Button>
      <Typography>
        <Link data-attr="register-link" href="/register">
          Dont have an account? Register.
        </Link>
      </Typography>
    </form>
  );
};

export default LoginForm;
