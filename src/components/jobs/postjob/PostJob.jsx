import toast from "react-hot-toast";
import react, { useState } from "react"
import JobStepOne from './JobStepOne'
import JobStepTwo from './JobStepTwo'
import JobStepThree from './JobStepThree'
import JobStepFour from './JobStepFour'
import JobStepFive from './JobStepFive'
import Navbar from '../../common/navbar/Navbar.jsx'
import CustomStepper from '../../common/steepernav/SteeperNav.jsx'
import { FormProvider, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup";
import DefaultValues from "../../common/defaultValues/DefaultValues.jsx"
import JobSchema from "../../../utils/schemas/JobSchema.jsx"
import { useMemo } from "react";
// import supaBase from "../../../services/supabaseClient.js"
import { Link, useNavigate } from "react-router-dom";
import { ArrowBigLeft, ArrowLeftCircle, ChevronLeft, MoveLeftIcon } from "lucide-react";
import { useAuth } from "../../Auth/AuthContext.jsx";
import Swal from "sweetalert2";
import API from "../../../services/api/api";

const PostJob = () => {
  const { user } = useAuth()
  // console.log(user);

  const [ActiveStep, setActiveStep] = useState(0);
  const [completeStep, setcompleteStep] = useState([]);
  const [publishing, setPublishing] = useState(false)
  const [previousLoading, setPreviousLoading] = useState(false)
  const [nextLoading, setNextloading] = useState(false)
  const navigate = useNavigate();
  const methods = useForm({
    resolver: yupResolver(JobSchema),
    "defaultValues": DefaultValues,
    mode: "onChange", // real-time validation
  });
  const { handleSubmit, clearErrors, reset, watch } = methods;
  const stepField = useMemo(() =>
    [["jobTitle", "jobCategory", "jobType", "location", "numberOpening"],
    ["description", "responsibilities", "requirements", "ExperienceLevel", "EducationRequirement", "skills"],
    ["MinimumSalary", "MaximumSalary", "currency", "perks", "workSchedule"],
    ["applyMethod", "applicationUrl", "contactEmail", "deadline", "visibility","isFeatured"],
    ], []
  );
  const nextStep = async () => {
    setNextloading(true)
    let currentFields = stepField[ActiveStep] || [];
    const valid = await methods.trigger(currentFields);
    // console.log("🔍 Validating:", currentFields, "Result:", valid);

    if (!valid) {
      // agar validation fail hui to loader band karo aur exit karo
      setNextloading(false);
      return;
    } // console.log("✅ Validation passed, going next");
    setcompleteStep((prev) =>
      prev.includes(ActiveStep) ? prev : [...prev, ActiveStep]);
    setTimeout(() => {
      setActiveStep((prev) => prev + 1);
      setNextloading(false)
    }, 600);
  };
  const BackStep = () => {
    if (ActiveStep > 0) {
      setPreviousLoading(true)
      setTimeout(() => {
        setActiveStep((prev) => prev - 1);
        setPreviousLoading(false);
      }, 400); // 400ms delay — spinner will show shortly
    }
  }

  const handleCancel = () => {
    Swal.fire({
      title: "Cancel Job Posting?",
      text: "Are you sure you want to cancel this job post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!"
    }).then((result) => {
      if (result.isConfirmed) {
        clearErrors();
        reset();
        toast("Job posting cancelled", { icon: "🚫" });

        setTimeout(() => navigate("/jobs"), 800);
      }
    });
  };
  const onError = (errors) => {
    console.log("Validation errors:", errors);
  };
  const onSubmit = async (data) => {
    console.log("Submitting job:", data); // debug line
    try {
      setPublishing(true);
      const jobData = {
        ...data,
        user_profilePhoto: user?.profile?.profilePhoto || "",   // store avatar
        user_name: user?.fullName || user?.email?.split("@")[0],
        companyName: user?.companyName, // store name fallback
        postedBy: user._id,

      };
      const res = await API.post("/v1/jobs/create", jobData)
      console.log(res, "res..........");
      if (res.data.success) {
        toast.success("🎉 Job successfully posted!");
        navigate("/myjobs");
      }
    } catch (error) {
      console.error("❌ Unexpected Error:", error);
      toast.error(error?.response?.data?.message, "error posting job");
    } finally {
      setPublishing(false);
    }
  };

  const step = [
    <JobStepOne onNext={nextStep} handleCancel={handleCancel} nextLoading={nextLoading} previousLoading={previousLoading} onBack={BackStep} showPrevious={false}></JobStepOne>,
    <JobStepTwo onNext={nextStep} handleCancel={handleCancel} nextLoading={nextLoading} previousLoading={previousLoading} onBack={BackStep} showPrevious={true}></JobStepTwo>,
    <JobStepThree onNext={nextStep} handleCancel={handleCancel} nextLoading={nextLoading} previousLoading={previousLoading} onBack={BackStep} showPrevious={true}></JobStepThree>,
    <JobStepFour onNext={nextStep} handleCancel={handleCancel} nextLoading={nextLoading} previousLoading={previousLoading} onBack={BackStep} showPrevious={true}></JobStepFour>,
    <JobStepFive publishing={publishing} handleCancel={handleCancel} nextLoading={nextLoading} previousLoading={previousLoading} onNext={nextStep} onBack={BackStep} showPrevious={true} handleSubmit={handleSubmit} onSubmit={onSubmit} isLastStep={true}></JobStepFive>
  ]
  return (
    <div className='min-h-full bg-gray-200'>
      <div className='bg-[#244034] h-[400px] p-5'>
        <Navbar></Navbar>
        <div className='text-white  pt-10'>
          <h1 className='text-center text-4xl sm:text-5xl md:text-7xl font-extrabold mb-7 mt-4'>Post a Job Opening</h1>
          <p className="text-white mb-6 text-center text-[14px] md:text-[20px]  font-medium mx-auto max-w-2xl">
            Fill out the form below to share your job opportunity with top talent on JobSpring.
            It only takes a few minutes!
          </p>
        </div>
        <FormProvider {...methods}>
          <div className='mt-20 px-10'>
            <div className="mb-5">
              {ActiveStep === 0 && (<Link
                to="/"
                className="flex items-center gap-2 text-white hover:text-amber-300"
              >
                <ArrowLeftCircle size={26} />
                <span className="text-xl">Back</span>
              </Link>
              )}
            </div>
            <div className=' bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-lg'>
              <CustomStepper activeStep={ActiveStep}></CustomStepper>
              <div className='mt-10 p-'>
                <form onSubmit={handleSubmit(onSubmit, onError)}>
                  {step[ActiveStep]}
                </form>
              </div>
            </div>
          </div>
        </FormProvider>
      </div>
    </div>
  )
}

export default PostJob;