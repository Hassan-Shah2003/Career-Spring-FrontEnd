import React from "react";
import { Eye, Rocket } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faCheckCircle,
  faCircleCheck,
  faClock,
  faCog,
  faEye,
  faGift,
  faGraduationCap,
  faListCheck,
  faLocationDot,
  faMoneyBillWave,
  faScrewdriverWrench,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import FormFooter from "../../common/FormFooter/FormFooter";
import { useFormContext } from "react-hook-form";
import { useAuth } from "../../Auth/AuthContext";

const JobStepFive = ({ onNext, onBack,handleCancel,previousLoading, publishing }) => {
  const { getValues } = useFormContext();
  const { user } = useAuth();
  // console.log(user?.companyName);
  
  const formData = getValues();
  console.log(formData);
  

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <FontAwesomeIcon icon={faEye} size="xl" />
        <h1 className="text-2xl sm:text-3xl font-extrabold">
          Preview & Publish Your Job
        </h1>
      </div>

      {/* Ready Box */}
      <div className="bg-gradient-to-r from-green-100 to-gray-100 border border-green-300 rounded-xl p-5 shadow-md mt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          {/* Left Section */}
          <div className="flex items-start gap-4">
            <FontAwesomeIcon
              icon={faCircleCheck}
              size="xl"
              className="text-green-600 mt-1"
            />
            <div>
              <h1 className="font-bold text-2xl text-gray-800">
                Ready to Publish!
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                Review your job listing before making it live.
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="text-right w-full sm:w-auto">
            <p className="inline-flex items-center justify-center bg-[#284A3A] text-white px-5 py-2.5 rounded-full shadow-md text-base sm:text-lg font-semibold">
              <span className="mr-1">{formData.currency}</span>
              <span>{formData.MinimumSalary}</span>
              <span className="mx-1">-</span>
              <span className="mr-1">{formData.currency}</span>
              <span>{formData.MaximumSalary}</span>
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              per month
            </p>
          </div>
        </div>
      </div>


      {/* Preview Section */}
      <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-3 gap-8 mt-8 mb-10">
        {/* LEFT SIDE — Job Preview */}
        <div className="md:col-span-2 space-y-8">
          {/* Company / Job Info */}
          <div className="border-2 p-6 border-gray-200 rounded-lg hover:border-l-[#284A3A] hover:border-l-5 w-full flex flex-col items-start shadow-lg transition-transform duration-300 hover:scale-[1.02]">
            {/* Logo and Info */}
            <div className="flex flex-wrap items-start justify-between gap-4 w-full">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#284A3A] to-[#367353] rounded-2xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon
                  icon={faBuilding}
                  size="2xl"
                  style={{ color: "white" }}
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <h1 className="text-xl sm:text-2xl font-extrabold mb-2">
                  {user?.companyName || user?.fullName}
                </h1>
                <h3 className="text-lg text-gray-900">{formData.title}</h3>
                <div className="flex flex-wrap gap-2 mt-2 text-gray-700 text-sm sm:text-base">
                  <FontAwesomeIcon icon={faLocationDot} />
                  <span>{formData.location}</span>
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faClock} className="text-gray-400" />
                    <span>{formData.jobType}</span>
                  </div>
                </div>
              </div>
              {/* 
              <div className="min-w-[150px] text-right">
                <p className="font-extrabold text-lg sm:text-xl inline-flex items-center border border-[#d1e0d9] bg-gradient-to-br from-[#244034] to-[#2a4b3c] text-white px-4 py-2 rounded-full shadow-md">
                  <span>{formData.currency}</span>
                  <span>{formData.minSalary}-</span>
                  <span>{formData.currency}</span>
                  <span>{formData.maxSalary}</span>
                </p>
                <p className="text-gray-600 text-sm">per month</p>
              </div> */}
            </div>

            <div className="mt-5">
              <h2 className="text-lg font-black mb-2">Job Description</h2>
              <p className="text-gray-600 text-sm sm:text-base">
                {formData.description}
              </p>
            </div>
          </div>

          {/* Responsibilities */}
          <div className="border-2 p-6 border-gray-200 rounded-lg hover:border-l-[#284A3A] hover:border-l-5 shadow-lg transition-transform duration-300 hover:scale-[1.02]">
            <div className="flex items-center gap-2 mb-3">
              <FontAwesomeIcon icon={faListCheck} />
              <h2 className="text-lg font-black">Key Responsibilities</h2>
            </div>
            <ul className="text-gray-700 space-y-2 text-sm sm:text-base">
              {formData.responsibilities?.length ? (
                formData.responsibilities.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mr-2 mt-1"
                    />
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <p className="italic text-gray-500">No responsibilities added</p>
              )}
            </ul>
          </div>

          {/* Requirements */}
          <div className="border-2 p-6 border-gray-200 rounded-lg hover:border-l-[#284A3A] hover:border-l-5 shadow-lg transition-transform duration-300 hover:scale-[1.02]">
            <div className="flex items-center gap-2 mb-3">
              <FontAwesomeIcon icon={faGraduationCap} />
              <h2 className="text-lg font-black">Requirements & Qualifications</h2>
            </div>
            <ul className="text-gray-700 space-y-2 text-sm sm:text-base">
              {formData.qualification?.length ? (
                (formData?.qualification || []).map((req, index) => (
                  <li key={index} className="flex items-start">
                    <FontAwesomeIcon
                      icon={faStar}
                      className="text-yellow-500 mr-2 mt-1"
                    />
                    <span>{req}</span>
                  </li>
                ))
              ) : (
                <p className="italic text-gray-500">No requirements added</p>
              )}
            </ul>
          </div>

          {/* Skills */}
          <div className="border-2 p-6 border-gray-200 rounded-lg hover:border-l-[#284A3A] hover:border-l-5 shadow-lg transition-transform duration-300 hover:scale-[1.02]">
            <div className="flex items-center gap-2 mb-3">
              <FontAwesomeIcon icon={faScrewdriverWrench} />
              <h2 className="font-semibold text-lg">Skills & Technologies</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {formData.skills?.length ? (
                formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex justify-center items-center border border-[#d1e0d9] bg-gradient-to-br from-[#244034] to-[#2a4b3c] text-white px-3 py-2 rounded-full text-sm font-medium shadow-md hover:bg-green-700 hover:scale-105 transition-transform"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="italic text-gray-500">No skills added</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — Additional Info */}
        <div className="space-y-8">
          {/* Benefits */}
          {/* RIGHT SIDE — Additional Info */}
          <div className="space-y-8">
            {/* Benefits */}
            <div className="border-2 p-6 border-gray-200 rounded-lg shadow-lg hover:scale-[1.02] transition-transform w-full">
              <div className="flex items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faGift} />
                <h2 className="text-xl font-bold">Benefits & Perks</h2>
              </div>

              <div className="flex flex-wrap">
                {formData.perks?.length ? (
                  formData.perks.map((perk, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center border border-[#d1e0d9] bg-gradient-to-br from-[#244034] to-[#2a4b3c] text-white px-3 py-2 rounded-full m-1 text-sm font-medium shadow-md hover:bg-green-700 hover:scale-105 transition-transform"
                    >
                      {perk}
                    </span>
                  ))
                ) : (
                  <p className="italic text-gray-500">No perks added</p>
                )}
              </div>

              {/* 💬 Salary Negotiable */}
              {formData.negotiable && (
                <div className="mt-4 flex items-center gap-2 bg-green-50 border border-green-300 text-green-700 px-3 py-2 rounded-lg shadow-sm">
                  <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-600" />
                  <span className="font-semibold">Salary is negotiable</span>
                </div>
              )}
            </div>
          </div>


          {/* Application Settings */}
          <div className="border-2 p-6 border-gray-200 rounded-lg shadow-lg hover:scale-[1.02] transition-transform">
            <div className="flex items-center gap-2 mb-4">
              <FontAwesomeIcon icon={faCog} />
              <h2 className="text-lg font-black">Application Settings</h2>
            </div>
            {[
              ["Apply Method", formData.applyMethod],
              ["Contact Email", formData.contactEmail],
              ["Visibility", formData.visibility],
              ["Deadline", formData.deadline],
            ].map(([label, value], i) => (
              <div key={i} className="flex justify-between text-sm sm:text-base mb-3">
                <p>{label}:</p>
                <h2 className="font-semibold text-gray-800">{value}</h2>
              </div>
            ))}
          </div>

          {/* Publish Box */}
          <div className="border-2 p-6 rounded-3xl bg-[#284A3A] text-white shadow-lg hover:scale-[1.02] transition-transform">
            <h3 className="text-lg font-black mb-2">You’re Almost There 🚀</h3>
            <p className="text-sm font-medium">
              Just review your details once — your listing is about to reach thousands of job seekers!
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✅</span>
                <span>Job details completed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✅</span>
                <span>Requirements added</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✅</span>
                <span>Application info verified</span>
              </div>
            </div>

            <div className="mt-6 p-3 bg-green-700 rounded-xl text-center font-semibold">
              🎉 Great! You’re all set to publish your job post.
            </div>
          </div>

        </div>
      </div>

      {/* Footer Buttons */}
      <div className="mt-6">
        <FormFooter
          onNext={onNext}
          onBack={onBack}
          showPrevious={true}
          isLastStep={true}
          handleCancel={handleCancel}
          previousLoading={previousLoading}
          publishing={publishing}
          // handleSubmit={handleSubmit}
          // onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default JobStepFive;
