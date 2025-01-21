import * as Yup from "yup";

export const validationSchemaRegister = Yup.object({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),
  repeatPassword: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .oneOf([Yup.ref("password"), null as any], "Passwords must match") // Ensures repeatPassword matches password
    .required("Please confirm your password"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
});
