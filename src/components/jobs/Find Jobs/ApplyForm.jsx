import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// import supaBase from '../../../services/supabaseClient';
import toast from 'react-hot-toast';
import { MoveLeftIcon } from 'lucide-react';
import API from '../../../services/api/api';

const ApplyForm = () => {
  const { jobId } = useParams();
  // console.log(jobId, "jobId..............");

  const navigate = useNavigate();
  // const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [fileError, setFileError] = useState("");
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    letter: '',
    resumeurl: null,
  });
  const [errors, setErrors] = useState({});

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const { data, error } = await supaBase.auth.getUser();
  //     if (!error) setUser(data.user);
  //   }
  //   fetchUser();
  // }, [])

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const newValue = files ? files[0] : value;

    // setFormData({
    //   ...formData,
    //   [e.target.name]: e.target.value
    // });

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : newValue,
    }));

    // ✅ Agar user ne valid value daal di to error hata do
    setErrors((prev) => ({
      ...prev,
      [name]: "", // clear that field's error
    }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev)=>({
      ...prev,
      resume:file,
    }))
    setErrors((prev)=>({
      ...prev,
      resume:""
    }))
  }
  // const handleFileChange = (e) => {
  //   if (!file) return;
  //   const allowedTypes = [
  //     "application/pdf",
  //     "application/msword",
  //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  //   ];
  //   const allowedExtensions = /\.(pdf|doc|docx)$/i;

  //   if (!allowedTypes.includes(file.type) || !allowedExtensions.test(file.name)) {
  //     toast.error("Only PDF or Word (.pdf, .doc, .docx) files are allowed.  ");
  //     setFormData((prev) => ({ ...prev, resume: null }));
  //     e.target.value = "";   // reset input
  //     return;               // ❌ STOP AAGE NAHI BARTI
  //   }
  //   const maxSize = 5 * 1024 * 1024;
  //   if (file.size > maxSize) {
  //     toast.error("File size exceeds 5MB limit. Please upload a smaller file.");
  //     e.target.value = "";
  //     return;
  //   }
  //   setErrors((prev) => ({
  //     ...prev,
  //     resume: null,
  //   }));
  //   setFormData({
  //     ...formData,
  //     resume: file
  //   });
  // };
  // const handleFileUpload = async (file) => {
  //   if (!file) return null;
  //   const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  //   const filePath = `resumes/${Date.now()}_${safeFileName}`;

  //   // const filePath = `resumes/${Date.now()}${file.name}`
  //   const { data, error } = await supaBase.storage.from("resumes").upload(filePath, file);
  //   if (error) {
  //     console.error("Upload error:", error);
  //     toast.error('Resume upload failed: ' + error.message);
  //     return null;
  //   }
  //   const { data: publicUrlData } = supaBase.storage.from("resumes").getPublicUrl(filePath);
  //   // console.log("✅ File uploaded! URL:", publicUrlData.publicUrl);
  //   return publicUrlData.publicUrl;
  // }
  // const { fullName, email, phone, coverLetter } = formData;
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^[0-9+\-\s]{7,15}$/.test(formData.phone))
      newErrors.phone = "Enter a valid phone number.";
    if (!formData.letter.trim())
      newErrors.letter = "letter is required.";
    else if (formData.letter.length < 50)
      newErrors.coverLetter = "letter must be at least 50 characters.";
    if (!formData.resume) newErrors.resume = "Please upload your resume.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }
    setLoading(true);
    const form = new FormData();

    form.append("jobId", jobId);
    form.append("fullName", formData.fullName);
    form.append("email", formData.email);
    form.append("phone", formData.phone);
    form.append("letter", formData.letter);
    form.append("resume", formData.resume);

    try {
      await API.post(`/v1/jobs/${jobId}/apply`, form);
      toast.success("Application submitted!");
      navigate("/jobs"); // Redirect to jobs page or success page

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");

      //  toast.success("Application submitted!");

    } finally {
      setLoading(false);
    }
  }
  return (
    <>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4">
        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
          <Link to={"/jobs"} className='flex items-center mr-0 gap-2'>
            <MoveLeftIcon></MoveLeftIcon>
            <span>Back</span>
          </Link>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Apply for Position
            </h1>
            <p className="text-gray-600">
              {jobId ? `Job ID: ${jobId}` : 'Complete your application below'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                // required
                value={formData.fullName}
                onChange={handleChange}
                className={`border-2 border-gray-400 w-full p-4 mt-2 rounded-lg focus:ring-1 focus:outline-none focus:border-[#132e13] ${errors.fullName
                  ? "border-red-500" : "border-gray-300"
                  } `}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                // required
                value={formData.email}
                onChange={handleChange}
                className={`border-2 border-gray-400 w-full p-4 mt-2 rounded-lg focus:ring-1 focus:outline-none focus:border-[#132e13] ${errors.email
                  ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`border-2 border-gray-400 w-full p-4 mt-2 rounded-lg focus:ring-1 focus:outline-none focus:border-[#132e13] ${errors.phone
                  ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Cover Letter Field */}
            <div>
              <label htmlFor="coverLetter" className="block text-sm font-semibold text-gray-700 mb-2">
                Cover Letter *
              </label>
              <textarea
                id="letter"
                name="letter"
                // required
                rows="5"
                value={formData.letter}
                onChange={handleChange}
                className={`border-2 border-gray-400 w-full p-4 mt-2 rounded-lg focus:ring-1 focus:outline-none focus:border-[#132e13] ${errors.letter
                  ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Write a short cover letter about your experience and why you're a great fit..."
              />
              {errors.letter && (
                <p className="text-red-500 text-sm mt-1">{errors.letter}</p>
              )}
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Minimum 50 characters</span>
                <span>{formData.letter.length}/2000</span>
              </div>
            </div>
            <div>
              <label
                htmlFor="resume"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Upload Resume (PDF only) *
              </label>
              <input
                type="file"
                id="resume"
                name="resume"
                accept=".pdf,.doc,.docx"
                // required
                onChange={handleFileChange}
                className={`border-2 border-gray-400 w-full p-4 mt-2 rounded-lg focus:ring-1 focus:outline-none focus:border-[#132e13] ${errors.resume
                  ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.resume && (
                <p className="text-red-500 text-sm mt-1">{errors.resume}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-4 text-white font-bold rounded-lg transition-all  duration-300 transform hover:scale-[1.02] shadow-lg ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 cursor-pointer to-emerald-500 hover:from-green-700 hover:to-emerald-600"
                }`}
            >
              Submit Application
            </button>
          </form>

          {/* Progress Indicator */}

          {/* Footer Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Your information is secure and will never be shared with third parties.
            </p>
          </div>
        </div>
      </div>
    </>
  );

};

export default ApplyForm;