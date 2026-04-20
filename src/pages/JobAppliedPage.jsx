import React, { useEffect, useState } from 'react'
import Navbar from '../components/common/navbar/Navbar'
// import supaBase from '../services/supabaseClient'
import { useAuth } from '../components/Auth/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import API from '../services/api/api';

const JobAppliedPage = () => {
  const { user } = useAuth();
  // console.log(user);
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  // console.log(applications, "applications,,,,,,,,,,,,");
  const navigate = useNavigate();
  useEffect(() => {
  const fetchApplications = async () => {
    if (!user) return;

    try {
      const res = await API.get(`/v1/jobs/applied`);
      // console.log(res,"res...........");
      setApplications(res.data.applications || []);
    }
     catch (err) {
      // console.log("Unexpected error:", err);
      setApplications([]);
    } finally {
      setLoading(false); // <- important
    }
  };

  fetchApplications();
}, [user]);

  // console.log(applications);

  return (
    <>
      <div className='bg-[#244034] h-[400px] relative'>
        <Navbar></Navbar>

        <section className='flex flex-col justify-center items-center h-full pt-16 '>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 text-center text-white">Applied Jobs</h1>
          <p className="text-lg sm:text-xl text-white/90 mb-6 mt-6">
            Track all the jobs you have applied for, see status updates, and stay organized.
          </p>
        </section>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
        </div>
      ) : applications.length > 0 ? (
        <div className='max-w-6xl mx-auto mt-16 px-4'>
          <table className="table-fixed w-full border-collapse border-2 border-gray-300">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b text-left text-sm font-black text-black">Company</th>
                <th className="px-6 py-3 border-b text-left text-sm font-black text-black">Title</th>
                <th className="px-6 py-3 border-b text-left text-sm font-black text-black">Location</th>
                <th className="px-6 py-3 border-b text-left text-sm font-black text-black">Date</th>
                <th className="px-6 py-3 border-b text-left text-sm font-black text-black">Status</th>
              </tr>
            </thead>

            <tbody>
  {applications.map((app) => (
    <tr key={app._id} className="hover:bg-gray-50">
      <td className="px-6 py-4 border-b">{app?.job?.postedBy?.companyName || "Private Organization"}</td>
      <td className="px-6 py-4 border-b">{app?.job?.jobTitle || "N/A"}</td>
      <td className="px-6 py-4 border-b">{app?.job?.location || "N/A"}</td>
      <td className="px-6 py-4 border-b">
        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A"}
      </td>
      <td className="border-b p-2">
        <span
          className={`px-4 py-2 rounded-full text-white text-md font-mono font-bold ${
            app.status === "pending"
              ? "bg-yellow-500"
              : app.status === "accepted"
              ? "bg-green-600"
              : "bg-red-600"
          }`}
        >
          {app?.status ? app?.status.charAt(0).toUpperCase() + app.status.slice(1) : "Pending"}
        </span>
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      ) : (
        // Empty State with Animation
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative mb-8">
            {/* Animated send icon */}
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center relative animate-pulse">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </div>

            {/* Animated question mark */}
            <div className="absolute -top-2 -right-2 bg-[#244034] rounded-full p-2 animate-bounce">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            {/* Floating elements */}
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#c5f542] rounded-full opacity-70 animate-ping"></div>
            <div className="absolute -top-4 -right-6 w-4 h-4 bg-[#244034] rounded-full opacity-50 animate-pulse delay-500"></div>
          </div>

          <h3 className="text-2xl font-bold text-gray-700 mb-4 text-center">
            No Applications Yet
          </h3>
          <p className="text-gray-500 text-center max-w-md mb-6">
            You haven't applied for any jobs yet. Start exploring opportunities and apply to find your perfect role.
          </p>

          {/* Browse Jobs Button */}
          <button
            onClick={() => navigate("/jobs")} // Adjust the route as per your app
            className="
              px-6 py-3 bg-[#244034] text-white rounded-lg 
              hover:bg-[#c5f542] hover:text-black 
              transform hover:scale-105 
              transition duration-300 ease-in-out 
              font-bold flex items-center cursor-pointer gap-2
              animate-pulse hover:animate-none
            "
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Browse Jobs
          </button>
        </div>
      )}
    </>
  )
}

export default JobAppliedPage