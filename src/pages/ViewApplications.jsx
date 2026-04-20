import React, { useEffect, useState } from 'react'
import Navbar from '../components/common/navbar/Navbar'
// import supaBase from '../services/supabaseClient'
import { useAuth } from '../components/Auth/AuthContext'
import DropdownMenuDialog from '../components/DropDowMenu/DropdownMenuDialog'
import { FileDown } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import API from '../services/api/api'

const ViewApplications = () => {
  const { user } = useAuth()
  const [jobApplications, setJobApplications] = useState([])
  // console.log(jobApplications,"jobApplications");
  
  const [loading, setLoading] = useState(false)

  // Fetch all job applications
  const fetchJobApplications = async () => {
    try {
      setLoading(true)
      const res = await API.get(`/v1/jobs/company/allapplications`)
      // console.log(res?.data?.applications, "res....................");
      setLoading(false)
      setJobApplications(res?.data?.applications || [])
    } catch (error) {
      // console.log(error, "error");
    }
  }

  useEffect(() => {
    if (user) fetchJobApplications()
  }, [user])

  // Update application status
  const updateStatus = async (id, newStatus) => {
    const toastId = toast.loading('Updating status...')
    try {
    const res = await API.patch(`/v1/jobs/application/${id}/status`, { status: newStatus })
    // console.log(res, "res.........");

    setJobApplications(prev =>
      prev.map(app =>
        app._id === id ? { ...app, status: newStatus } : app
      )
    )
    toast.success("Status updated")
  } catch (error) {
    // console.log(error)
    toast.error("Failed to update status")
  }
  toast.dismiss(toastId)
}

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className='bg-[#244034] h-[400px] relative'>
        <Navbar />
        <section className='flex flex-col justify-center items-center h-full pt-16'>
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-white text-center">
            Job Applications
          </h1>
          <p className="mb-6 text-gray-200 text-center text-lg max-w-2xl">
            Here you can view all applications submitted by job seekers for your posted jobs.
          </p>
        </section>
      </div>

      <div className='max-w-6xl mx-auto mt-16 px-4 overflow-x-auto'>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
          </div>
        ) : jobApplications.length > 0 ? (
          <table className="min-w-full table-fixed border-collapse border-2 border-gray-300">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b text-left text-sm font-black text-black">Name</th>
                <th className="px-6 py-3 border-b text-left text-sm font-black text-black">Job Title</th>
                <th className="px-6 py-3 border-b text-left text-sm font-black text-black">Location</th>
                <th className="px-6 py-3 border-b text-left text-sm font-black text-black">Resume</th>
                <th className="px-6 py-3 border-b text-left text-sm font-black text-black">Status</th>
                <th className="px-6 py-3 border-b text-left text-sm font-black text-black">Action</th>
              </tr>
            </thead>

            <tbody>
              {jobApplications.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{app?.job?.postedBy?.fullName || "Private Organization"}</td>
                  <td className="px-6 py-4 border-b">{app?.job?.jobTitle || "N/A"}</td>
                  <td className="px-6 py-4 border-b">{app?.job?.location || "N/A"}</td>

                  {/* Resume */}
                  <td className="px-6 py-4 border-b">
                    {app?.resume?.url ? (
                      <a
                        href={app.resume.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          inline-flex items-center gap-2 px-3 py-1 
                          bg-[#244034] text-white rounded 
                          hover:bg-[#c5f542] hover:text-black 
                          transform hover:scale-110 
                          transition duration-300 ease-in-out 
                          font-bold
                        "
                      >
                        <FileDown className="w-5 h-5" />
                        Download
                      </a>
                    ) : (
                      <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded">No Resume</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 border-b">
                    <span
                      className={`
                        px-2 py-1 rounded-full text-white bg-amber-500 text-sm
                        ${app.status === "accepted" ? "bg-green-500" : ""}
                        ${app.status === "rejected" ? "bg-red-500" : ""}
                      `}
                    >
                      {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : "Pending"}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="border-b p-2">
                    <DropdownMenuDialog appId={app._id} updateStatus={updateStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // Empty state with animation
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-8">
              {/* Animated document icon */}
              <div className="w-32 h-40 bg-gray-200 rounded-lg flex items-center justify-center relative animate-pulse">
                <div className="w-24 h-32 bg-white rounded-md border-2 border-dashed border-gray-400 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>

                {/* Animated search icon */}
                <div className="absolute -top-4 -right-4 bg-[#244034] rounded-full p-3 animate-bounce">
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -bottom-2 -left-4 w-8 h-8 bg-[#c5f542] rounded-full opacity-70 animate-ping"></div>
              <div className="absolute -top-2 -right-6 w-6 h-6 bg-[#244034] rounded-full opacity-50 animate-pulse delay-700"></div>
            </div>

            <h3 className="text-2xl font-bold text-gray-700 mb-4 text-center">
              No Applications Yet
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              You haven't received any job applications yet. Check back later or promote your job listings to attract more candidates.
            </p>

            {/* Animated refresh button */}
            <button
              onClick={fetchJobApplications}
              className="
                px-6 py-3 bg-[#244034] cursor-pointer text-white rounded-lg 
                hover:bg-[#c5f542] hover:text-black 
                transform hover:scale-105 
                transition duration-300 ease-in-out 
                font-bold flex items-center gap-2
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default ViewApplications
