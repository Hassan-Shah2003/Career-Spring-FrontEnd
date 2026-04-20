import * as Yup from "yup";

export const profileSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters"),

  age: Yup.number()
    .typeError("Age must be a number")
    .min(15, "Minimum age should be 15")
    .max(80, "Maximum age should be 80")
    .required("Age is required"),

  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),

  tagline: Yup.string()
    .required("Tagline is required")
    .min(5, "Tagline must be at least 5 characters"),

  location: Yup.string()
    .required("Location is required")
    .min(2, "Location is too short"),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10,15}$/, "Phone must be 10–15 digits"),

  about: Yup.string()
    .required("About section cannot be empty")
    .min(20, "About must be at least 20 characters long"),

  profilePhoto: Yup.string().nullable(),

  // ⭐ SKILLS
  skills: Yup.array().of(
    Yup.object().shape({
      name: Yup.string()
        .required("Skill name is required")
        .min(2, "Skill name too short"),
    })
  ),

  // ⭐ EXPERIENCE
  experience: Yup.array().of(
    Yup.object().shape({
      position: Yup.string().required("Position is required"),
      company: Yup.string().required("Company is required"),
      period: Yup.string().required("Period is required"),
      description: Yup.string()
        .required("Description is required")
        .min(10, "Description too short"),
    })
  ),

  // ⭐ EDUCATION
  education: Yup.array().of(
    Yup.object().shape({
      degree: Yup.string().required("Degree is required"),
      institution: Yup.string().required("Institution is required"),
      period: Yup.string().required("Period is required"),
      grade: Yup.number()
        .typeError("Grade must be a number")
        .min(1, "Grade cannot be less than 1")
        .max(100, "Grade cannot be more than 100")
        .required("Grade is required"),
    })
  ),

  // ⭐ STATS
  stats: Yup.array().of(
    Yup.object().shape({
      label: Yup.string().required(),
      number: Yup.number()
        .typeError("Number must be numeric")
        .min(0, "Number cannot be negative")
        .required("Stat number is required"),
    })
  ),
});
