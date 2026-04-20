import * as yup from "yup";

const SignupSchema = yup.object({
  fullName: yup.string().required("Full name is required").min(3),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required().min(6),
  role: yup.string().required("Select a role"),
  companyName: yup.string().when("role", {
    is: "company",
    then: (schema) => schema.required("Company name is required"),
  }),
  phoneNumber: yup.string().required("Phone number is required"),
  location: yup.string().required("Location is required"),
  about: yup.string().min(10, "Write at least 10 characters"),
});

export default SignupSchema;