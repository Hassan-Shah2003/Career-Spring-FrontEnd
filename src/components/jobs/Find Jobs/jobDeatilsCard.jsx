import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Bookmark,
  Slash,
  Link,
  Briefcase,
  Wallet,
  MapPin,
  Grid2x2,
  FileSpreadsheet,
  CreditCard,
  UserStar,
  GraduationCap,
  Settings,
  CircleSlash2,
  Check,
  TextQuote,
  Scroll,
  BubblesIcon,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faGraduationCap, faListCheck, faStar } from "@fortawesome/free-solid-svg-icons";
import ProTip from "../../common/tipsform/ProTips";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
// import supaBase from "../../../services/supabaseClient";
import API from "../../../services/api/api";

const JobDetailsCard = ({ job }) => {
  // console.log(job);
  // const {user}=useAuth()
  const [loading, setLoading] = useState(false);
  const [fetching, setIsFetching] = useState(true);
  const [isApplied, setIsApplied] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  // console.log(user);

  // const currencySymbols = {
  //   PKR: "Rs",
  //   USD: "$",
  //   AED: "د.إ", // Dirham
  //   EUR: "€",
  //   GBP: "£",
  //   INR: "₹",
  // };

  const handleApplyClick = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    // Navigate directly to ApplyForm page for this job
    // setLoading(true)
      navigate(`/apply-form/${job._id}`, { state: { job } });
      setLoading(false);
  };

  // async function hasUserApplied(jobId, userId) {
  //   try {

  //     const { data, error } = await supaBase
  //       .from("applications")
  //       .select("id")
  //       .eq("job_id", jobId)
  //       .eq("user_id", userId)   // ✅ correct column
  //       .maybeSingle();
  //     console.log(data);

  //     if (error && error.code !== "PGRST116") {
  //       // ❗ Supabase returns PGRST116 on maybeSingle() when no match
  //       console.error("Application check error:", error);
  //       return false;
  //     }

  //     return !!data; // true if exists, false if not
  //   } catch (error) {
  //     console.log(error);

  //   } finally {
  //     setIsFetching(false)
  //   }
  // }

  useEffect(() => {
    
    const checkApplied = async () => {
      try {
        if (!user?._id || !job?._id) return;
      const res = await API.get(`/v1/jobs/${job._id}/checkapplication`)
        // console.log(res.data.applied,"res..............");
        
      setIsApplied(res.data.applied);  // if you want to store it in state
      } catch (error) {
        // console.log(error);
      }finally {
        setIsFetching(false)
      }
    };

    checkApplied();
  }, [user?._id, job?._id]);
  useEffect(() => {
  if (!user) {
    setIsFetching(false);
  }
}, [user]);
  return (
    <div className=" bg-white border border-gray-400 rounded-xl shadow-sm  hover:shadow-gray-500">

      <div className="p-5 sm:p-5 md:p-6">
        <h2 className="text-2xl font-bold text-gray-900">{job.jobTitle}</h2>

        <div className="mt-2 text-gray-600">
          <a
            href="#"
            className="text-blue-600 hover:underline font-medium flex items-center gap-1"
          >
            {job?.postedBy?.companyName}
          </a>
          <p className="flex gap-1 mb-4"><MapPin></MapPin>{job.location}</p>
          <span className="bg-gray-100 p-2 rounded-xl">{job.currency} {job.MinimumSalary} - {job.currency} {job.MaximumSalary} </span>
        </div>

        <div className="flex gap-3 mt-8">
          {fetching ?
            <div className="animate-pulse bg-gray-300 rounded-md w-36 h-8"></div>
            : <button disabled={isApplied || loading} className={`bg-[#244034] text-white px-4 py-2 sm:px-5 sm:py-3 rounded-md font-bold transition-all duration-300 ${isApplied||loading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "hover:bg-[#d2f34c] cursor-pointer hover:text-black"
              } `} onClick={handleApplyClick}>
              {loading ? "Applying..." : isApplied ? "Applied" : "Apply Now"}
            </button>
          }


          {/* <button className="bg-[#244034] text-white px-4 py-2  rounded-md font-bold hover:bg-[#d2f34c] transition-all duration-300 hover:text-black" onClick={() => toast("Job saved to bookmarks! 📘")}>
            <Bookmark className="w-7 h-5 text-white group-hover:text-black" />
          </button> */}
          {/* <button className="bg-[#244034] text-white px-4 py-2  rounded-md font-bold hover:bg-[#d2f34c] transition-all duration-300 hover:text-black" onClick={() => toast.error("Job ignored")}>
            <CircleSlash2 className="w-7 h-5 text-white group-hover:text-black" />
          </button> */}
          {/* <button className="bg-[#244034] text-white px-4 py-2 rounded-md font-bold hover:bg-[#d2f34c] transition-all duration-300 hover:text-black" onClick={() => toast.success("Job link copied to clipboard! 🔗")}>
            <Link className="w-7 h-5  text-white group-hover:text-black" />
          </button> */}
        </div>
      </div>

      <hr />

      <div className="p-5 h-[calc(100vh-300px)] overflow-y-auto pr-2">
        <h3 className="text-lg font-semibold text-gray-900">Job details</h3>

        <div className="mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3 mt-4">
              <Wallet className="w-5 h-5 text-gray-600" />
              <p className="text-gray-800 font-medium">Pay</p>
            </div>
            <div className="mb-4">
              <p className="bg-gray-100 text-gray-700 font-bold text-md px-2  py-2 ml-6 rounded w-max hover:bg-gray-200">
                {job.currency}  {job.MinimumSalary} - {job.currency} {job.MaximumSalary}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-gray-600" />
                <p className="text-gray-800 font-medium">Job type</p>
              </div>
              <div className="pt-2">
                <p className="bg-[#e4f7e6] hover:bg-gray-200 w-35 text-green-900 text-md px-2 py-1 rounded font-medium ml-7 text-center flex gap-2"><Check className="w-5" />
                  {job.jobType}
                </p>
              </div>
            </div>
          </div>
        </div>

        <hr />

        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900">Location</h3>
          <div className="flex items-center mt-2 text-gray-700">
            <MapPin className="w-5 h-5" />
            <p className="font-semibold text-md p-3">{job.location}</p>
          </div>
        </div>

        <hr />

        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900">Category</h3>
          <div className="flex items-center mt-2 text-gray-700">
            <Grid2x2 className="w-5 h-5" />
            <p className="font-semibold text-md p-3">{job.jobCategory}</p>
          </div>
        </div>

        <hr />

        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900">
            Experience-Level
          </h3>
          <div className="flex items-center mt-2 text-gray-700">
            <UserStar className="w-5 h-5" />
            <p className="font-semibold text-md p-3">{job.ExperienceLevel}</p>
          </div>
        </div>

        <hr />

        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900">
            Education-Level
          </h3>
          <div className="flex items-center gap-2 mt-2 text-gray-700">
            <GraduationCap className="w-5 h-5" />
            <p className="font-semibold text-md p-3">{job.EducationRequirement}</p>
          </div>
        </div>

        <hr />

        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
          <div className="flex flex-wrap  items-center gap-2 sm:gap-3 text-gray-700 h-auto">
            <Settings className="w-5 h-5" />
            {(() => {
              const skills = Array.isArray(job.skills) ? job.skills : JSON.parse(job.skills || "[]");
              return skills.map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center whitespace-nowrap text-md font-mono px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-200 transform hover:scale-110 transition-transform"
                  title={skill}
                  x                >
                  {skill}
                </span>

              ));
            })()}
          </div>
        </div>

        <hr />
        <div className="p-5 border-b">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-1.5"><Scroll />Full job description</h3>
          <div className="flex items-center gap-2 mt-2 text-gray-700">
            <p className="font-semibold text-md p-3 ml-4">{job.description}</p>
          </div>
        </div>
        {/* <hr></hr> */}

        <div className="p-5 border-b">

          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <TextQuote className="mr-2 w-5 h-5" />Responsibilities
          </h3>
          <div className="flex items-center gap-2 mt-2 text-gray-700">

            {/* <p className="font-lightbold text-md p-3">{job.responsibilities}</p>
             */}
            <ul>
              {job.responsibilities.map((response, index) => (
                <li key={index} className="flex">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mr-2 mt-2.5"
                  /><p className="text-[12px] md:text-[14px] lg:text-[16px] xl:text-lg font-medium leading-10">{response}</p></li>
              ))}
            </ul>
          </div>
        </div>

        {/* <hr /> */}

        <div className="p-5 border-b mb-10">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center"> <FontAwesomeIcon icon={faGraduationCap} className="mr-2 mt-1" />Requirements</h3>
          <div className="flex items-center gap-2 mt-2 text-gray-700">
            <ul>

              {/* {job.requirements} */}

              {job.requirements.map((require, index) => (
                <li key={index} className="flex">
                  <FontAwesomeIcon
                    icon={faStar}
                    className="text-yellow-500 mr-2 mt-2.5"
                  /><p className="text-[12px] md:text-[14px] lg:text-[16px] xl:text-lg font-medium leading-10">{require}</p></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6 mb-4 p-4 sm:p-5 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 shadow-sm">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
            Why Join Us?
          </h3>
          <p className="text-sm sm:text-md text-gray-700 leading-relaxed font-medium">
            At <span className="font-semibold text-emerald-700">{job.company}</span>,
            we believe in innovation, teamwork, and continuous growth.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-emerald-200 pt-3 gap-3">
            <p className="text-sm sm:text-md text-gray-600 italic text-center sm:text-left">
              “Your next career move could start right here — apply today!”
            </p>
            <button disabled={isApplied || loading} className={`bg-[#244034] text-white px-4 py-2 sm:px-5 sm:py-3 rounded-md font-bold transition-all duration-300 cursor-pointer ${isApplied||loading
              ? "bg-gray-400 cursor-not-allowed"
              : "hover:bg-[#d2f34c] hover:text-black"
              }`} onClick={handleApplyClick}>
              {loading ? "Applying..." : isApplied ? "Applied" : "Apply Now"}
            </button>
          </div>
        </div>
        <ProTip title={"Pro Tip"} message={"Tailor your resume according to this job’s required skills to improve your selection chances."}></ProTip>

        {/* <hr /> */}

        {showLoginModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-11/12 sm:w-96 text-center relative animate-fadeIn">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Login Required</h2>
              <p className="text-gray-600 mb-6">
                Please login to apply for this job.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    navigate("/login");
                  }}
                  className="bg-[#244034] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#d2f34c] hover:text-black cursor-pointer transition-all duration-300"
                >
                  Go to Login
                </button>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-400 transition-all duration-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailsCard;