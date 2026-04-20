import React from 'react'
import ProTip from '../../common/tipsform/ProTips'
import FormFooter from '../../common/FormFooter/FormFooter'
import { useFormContext } from 'react-hook-form';
import FormInput from '../../common/FormInputs/FormInput';
import CheckBoxInput from '../../common/FormInputs/CheckBoxInput';

const JobStepThree = ({ onNext, handleCancel, onBack, previousLoading, nextLoading }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { getValues } = useFormContext();
      console.log(getValues);
  return (
    <div>
      <h1 className="text-xl font-bold mb-5">Salary & Benefits</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mb-5'>
        <FormInput
          name="MinimumSalary"
          label="Minimum Salary"
          type="number"
          placeholder="e.g.,60000"
        />
        <FormInput
          name="MaximumSalary"
          label="Maximum Salary"
          type="number"
          placeholder="e.g.,90000"
        />
        <FormInput
          name="currency"
          label="Currency"
          as="select"
          options={[
            "PKR",
            "USD",
            "EUR",
            "GBP",
            "AED",
            "INR",
          ]}
        />
      </div>
      <div>
        <CheckBoxInput></CheckBoxInput>
        <FormInput
          name="workSchedule"
          label="Work Schedule"
          as="select"
          options={[
            // "Select schedule",
            "Day shift",
            "Night shift",
            "Flexible",
            "Shift work",
            "Remote",
            "Hybrid",
          ]}
        />

      </div>
      <div className='mt-10'>
        <FormFooter type="button" nextLoading={nextLoading} previousLoading={previousLoading} handleCancel={handleCancel} onNext={onNext} onBack={onBack} showPrevious={true}></FormFooter>
      </div>
    </div>
  )
}

export default JobStepThree