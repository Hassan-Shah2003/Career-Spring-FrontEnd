import Radioinput from '../../common/FormInputs/Radioinput'
import FormInput from '../../common/FormInputs/FormInput'
import FormFooter from '../../common/FormFooter/FormFooter'
import { useFormContext } from "react-hook-form";
const JobStepFour = ({ onNext, onBack,previousLoading,nextLoading,handleCancel }) => {
    const { register, watch, formState: { errors } } = useFormContext()
  const { getValues } = useFormContext();
      console.log(getValues);  
  return (
    <div>
      <div>
        <h1 className='font-bold text-2xl mb-5'>Application Settings</h1>
      </div>

      <div>
        <Radioinput name="applyMethod"
          label="Apply Method"
          radioOptions={[
            { value: "platform", label: "Apply via platform" },
            { value: "external", label: "External application link", disabled: true }
          ]}>
        </Radioinput>

        <FormInput
          name="contactEmail"
          label="Contact Email"
          type="email"
          placeholder="enter a email..."
        />
        <FormInput
          name="deadline"
          label="Application Deadline (optional)"
          type="date"
        />
        <FormInput
          name="visibility"
          label="Job Visibility"
          as="select"
          options={[
            {label:"Public - Listed on job board",value:true},
            {label:"Only Invited Candidates",value:false},
          ]}
        />
       <div className="flex items-center gap-2 mt-4"> 
        <input
        type="checkbox"
        id="isFeatured"
        name='isFeatured'
        {...register("isFeatured")}
        className="w-4 h-4 text-[#244034] border-gray-300 rounded focus:ring-[#244034]  "/>
      <label htmlFor="isFeatured" className="text-gray-700 font-medium">
        Mark as Featured Job
      </label>
      </div>

    </div>

      <div className='mt-10'>
        <FormFooter type="button" nextLoading={nextLoading} previousLoading={previousLoading} handleCancel={handleCancel} onNext={onNext} onBack={onBack} showPrevious={true}></FormFooter>
      </div>
    </div>
  )
}

export default JobStepFour