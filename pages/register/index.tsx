import { Button, Grid, Typography } from "@mui/material";
import { useFormik } from "formik";
import { FC } from "react";

import { useApi } from "@/utils/api";
import { CreateUserParams } from "@/utils/types";
import Link from "next/link";
import { useToasts } from "react-toast-notifications";
import { TextFieldComponent } from "../../components/TextFieldComponent/TextFieldComponent";

interface RegisterFormProps {}

const RegisterForm: FC<RegisterFormProps> = () => {
  const { addToast } = useToasts();
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
    /*  validationSchema: validationSchemaAccountBox, */
    onSubmit: (values, actions) => {
      const { repeatPassword, ...dataToSend } = values;
      submitForm(dataToSend);
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
      });
    } catch (error: any) {
      addToast(error.response.data.message, { appearance: "error" });
    }
  };

  return (
    <form /* className={styles.registerForm} */ onSubmit={handleSubmit}>
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
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <TextFieldComponent
            placeholder="Your Name"
            name="firstName"
            value={values.firstName ? values.firstName : ""}
            onChange={handleChange}
            onBlur={handleBlur}
            setFieldTouched={setFieldTouched}
            errorText={errors.firstName}
            fullWidth
            helperText
            label="Your Name"
            dataAttr="firstName"
          />
        </Grid>
        <Grid item xs={6}>
          <TextFieldComponent
            placeholder="Your Lastname"
            name="lastName"
            value={values.lastName ? values.lastName : ""}
            onChange={handleChange}
            onBlur={handleBlur}
            setFieldTouched={setFieldTouched}
            errorText={errors.lastName}
            fullWidth
            helperText
            label="Your Lastname"
            dataAttr="lastName"
          />
        </Grid>
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
      <Grid>
        <TextFieldComponent
          placeholder="Your password"
          name="repeatPassword"
          value={values.repeatPassword ? values.repeatPassword : ""}
          onChange={handleChange}
          onBlur={handleBlur}
          setFieldTouched={setFieldTouched}
          errorText={errors.repeatPassword}
          fullWidth
          helperText
          label="Your password"
          dataAttr="password-repeat"
        />
      </Grid>
      <Button
        data-attr="submit"
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        fullWidth
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
        <Link href="/login">Already have an account? Login.</Link>
      </Typography>
    </form>
  );
};

export default RegisterForm;
