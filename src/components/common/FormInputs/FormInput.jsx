import { Controller, useFormContext } from "react-hook-form";

const FormInput = ({ name, label, type = "text", as = "input", options = [], placeholder }) => {
  const { register, watch, touchedFields, dirtyFields, control, formState: { errors } } = useFormContext();
  const value = watch(name);
  const showError = Boolean(errors?.[name]);
  // ✅ Handle Textarea fields
  if (as === "textarea") {
    const isArrayField = name === "responsibilities" || name === "requirements" || name === "qualification";


    return (
      <div className="mb-5">
        <div className="mb-2">
          <label className="font-bold">
            {label} <span className="ml-1 text-red-600">*</span>
          </label>
        </div>
        <Controller
          name={name}
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <textarea
              onBlur={onBlur}
              value={
                isArrayField
                  ? Array.isArray(value)
                    ? value.join("\n")
                    : ""
                  : value || ""
              }
              onChange={(e) => {
                if (isArrayField) {
                  const lines = e.target.value
                    .split("\n")                // har line tod do
                    .map(line => line.trim())   // har line ke aage-piche space hata do
                    .filter(line => line !== ""); // blank lines hata do

                  onChange(lines); // array form me update karo
                } else {
                  onChange(e.target.value); // normal input me simple string
                }
              }}
              rows={4}
              placeholder={placeholder}
              className={`w-full px-4 py-2.5 border-3 rounded-lg 
    focus:ring-1 focus:ring-[#244034] focus:border-[#244034] 
    ${showError ? "border-red-500" : "border-gray-300"}`}
            />
          )}
        />
        <div className="">
          {errors[name]?.message && (
            <p className="text-red-600 text-sm mt-2 font-bold text-md">{errors[name]?.message}</p>
          )}
          {Array.isArray(errors[name]) &&
            errors[name].map(
              (err, i) =>
                err?.message && (
                  <p key={i} className="text-red-600 text-sm font-bold text-md">
                    {err.message}
                  </p>
                )
            )}
        </div>
      </div>
    );
  }

  // ✅ Handle Select Fields
  if (as === "select") {
    return (
      <div className="mb-2">
        <label className="font-bold">
          {label} <span className="ml-1 text-red-600">*</span>
        </label>
        <select
          {...register(name)}
          className={`border-2 border-gray-400 w-full p-4 mt-2 rounded-lg focus:ring-1 focus:outline-none focus:border-[#132e13] ${showError ? "border-red-500" : "border-gray-300"}`}
        >
          <option value="">Select {label}</option>
          {options.map((opt,index) => {
            if (typeof opt === "object") {
              return (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              );
            }

            return (
              <option key={index} value={opt}>
                {opt}
              </option>
            );
          })}
        </select>
        <div>
          {showError && (
            <p className="text-red-600 text-sm mt-3 font-bold text-md">{errors[name]?.message}</p>
          )}
        </div>
      </div>
    );
  }

  // ✅ Handle normal input
  return (
    <div className="mb-2">
      <label className="font-bold">
        {label} <span className="ml-1 text-red-600">*</span>
      </label>
      <input
        {...register(name, type === "number" ? { valueAsNumber: true } : {})}
        type={type}
        placeholder={placeholder}
        className={`border-2 border-gray-400 w-full p-4 mt-2 rounded-lg focus:ring-1 focus:outline-none focus:border-[#132e13] ${showError ? "border-red-500" : "border-gray-300"}`}
      />
      <div className="">
        {showError && (
          <p className="text-red-600 text-sm mt-3 font-bold text-md">{errors[name]?.message}</p>
        )}
      </div>
    </div>
  );
};

export default FormInput;
