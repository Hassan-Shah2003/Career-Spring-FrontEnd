const DefaultValues = {
  // STEP 1: Basic Info
  jobTitle: "",
  jobCategory: "",
  jobType: "", 
  location: "",
  numberOpening: 1,

  // STEP 2: Job Details
  description: "",
  responsibilities: [],
  qualification: [],
  ExperienceLevel: "",
  EducationRequirement: "",
  skills: [],

  // STEP 3: Salary & Benefits
  MinimumSalary: "",
  MaximumSalary: "",
  currency: "",
  negotiable: false,
  perks: [], 
  workSchedule: "",

  // STEP 4: Application Settings
  applyMethod: "platform",
  applicationUrl: "",
  contactEmail: "",
  deadline: "",
  visibility: "Public - Listed on job board",
  isFeatured:false,
};

export default DefaultValues;