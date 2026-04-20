import React from "react";
import { useFormContext } from "react-hook-form";
import FormInput from "../../common/FormInputs/FormInput";
import ProTip from "../../common/tipsform/ProTips";
import FormFooter from "../../common/FormFooter/FormFooter";
import CategoryOptions from "../../common/CategoryOptions/CategoryOptions";

const JobStepOne = ({ onNext, handleCancel, onBack, nextLoading }) => {
    // const { getValues } = useFormContext();
    // console.log(getValues,"getvalues...........");
    
  return (
    <div>
      <h1 className="text-xl font-bold">Basic Job Information</h1>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2  gap-6">
        <FormInput
          name="jobTitle"
          label="Job Title"
          placeholder="Enter job title"
        />

        <FormInput
          name="jobCategory"
          label="Job Category"
          as="select"
          options={CategoryOptions}
        />

        <FormInput
          name="jobType"
          label="Job Type"
          as="select"
          options={[
            "Full-Time",
            "Part-Time",
            "Contract",
            "Internship",
            "Remote",
            "Freelance",
          ]}
        />

        <FormInput
          name="location"
          label="Location"
          placeholder="e.g., New York, USA or Remote"
        />

        <FormInput
          name="numberOpening"
          label="Number of Openings"
          type="number"
          placeholder="0"
        />

        <div className="mt-8">
          <ProTip
            title="Pro Tip"
            message="Be specific with your job title to attract the right candidates."
          />
        </div>
      </div>
      <div className="mt-10">
        <FormFooter type="button" nextLoading={nextLoading} onNext={onNext} onBack={onBack} showPrevious={false} handleCancel={handleCancel} />
      </div>
    </div>

  );
};

export default JobStepOne;
