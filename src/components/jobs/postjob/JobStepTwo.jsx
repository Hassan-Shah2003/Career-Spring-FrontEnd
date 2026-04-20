import React from "react";
import { useFormContext } from "react-hook-form";
import FormInput from "../../common/FormInputs/FormInput";
import ProTip from "../../common/tipsform/ProTips";
import FormFooter from "../../common/FormFooter/FormFooter";
import SkillsInput from "../../common/FormInputs/SkillsInput";

const JobStepTwo = ({ onNext, onBack, handleCancel, showPrevious, previousLoading, nextLoading }) => {

  console.log("jobstep2");
  const { getValues } = useFormContext();
  console.log(getValues);
  return (
    <div>
      <h1 className="text-xl font-bold">Job Details</h1>

      <div className="mt-5 grid grid-cols-1 gap-6">
        <FormInput
          name="description"
          label="Job Description"
          as="textarea"
          placeholder="Describe the role, company culture, and projects..."
        />

        <FormInput
          name="responsibilities"
          label="Responsibilities"
          as="textarea"
          placeholder={"List key responsibilities (one per line)"}
        />

        <FormInput
          name="requirements"
          label="Requirements / Qualifications"
          as="textarea"
          placeholder={"List requirements (one per line)"}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormInput
          name="ExperienceLevel"
          label="Experience Level"
          as="select"
          options={[
            "Intern",
            "Entry-Level (0-1 years)",
            "Junior (1-3 years)",
            "Mid-Level (3-5 years)",
            "Senior (5-10 years)",
            "Lead / Manager (10+ years)",
          ]}
        />

        <FormInput
          name="EducationRequirement"
          label="Education Requirement (optional)"
          as="select"
          options={[
            "High School / Secondary",
            "Diploma / Associate Degree",
            "Bachelor’s Degree",
            "Master’s Degree",
            "PhD / Doctorate",
            "Certification / Professional Training",
            "Any",
          ]}
        />
      </div>
      <SkillsInput
        name="skills"
        label="Skills"
        as="skills"
        placeholder={"Add A skills..."}
      >
      </SkillsInput>
      <div className="mt-10">
        <ProTip
          title="Pro Tip"
          message="Be specific with your job title to attract the right candidates."
        />
      </div>
      <div className="mt-10">
        <FormFooter type="button" nextLoading={nextLoading} previousLoading={previousLoading} handleCancel={handleCancel} onNext={onNext} onBack={onBack} showPrevious={true} />
      </div>
    </div>
  );
};

export default JobStepTwo;
