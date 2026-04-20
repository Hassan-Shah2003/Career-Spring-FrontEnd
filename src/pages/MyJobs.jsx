import React, { useEffect, useState } from 'react'
import Navbar from '../components/common/navbar/Navbar'
// import supaBase from '../services/supabaseClient'
import { useAuth } from '../components/Auth/AuthContext'
import { useNavigate } from 'react-router-dom'
import API from "../services/api/api"
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Building, 
  Calendar,
  FileText,
  Clock,
  User,
  Briefcase,
  GraduationCap,
  CheckCircle,
  Target,
  Users
} from 'lucide-react';

const MyJobs = () => {
  const { user } = useAuth();
  // console.log(user,"myjobuser..........");
  
  const [companyJobs, setCompanyJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState(null)
  // console.log(selectedJob,"selectedJob...........");
  
  const navigate = useNavigate();

  useEffect(() => {
  if (!user) return;

  const fetchCompanyJobs = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/v1/jobs/company/applicants`);
      const data = res?.data?.data;

      setCompanyJobs(data || []);
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false); // 👈 ALWAYS runs
    }
  };

  fetchCompanyJobs();
}, [user]);

  const toggleVisibility = async (jobId, value) => {
    try {
      await API.patch(`/v1/jobs/${jobId}/visibility`,{visibility:value})
      setCompanyJobs(prev =>
        prev.map(job =>
          job._id === jobId ? { ...job, visibility: value } : job
        )
      );
    } catch (error) {
    //  console.log(error,"visbility error.........");
      
    }
  };

  const parseArrayData = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  };

  return (
    <>
      {/* Header */}
      <div className='bg-[#244034] h-[400px] relative'>
        <Navbar />
        <section className='flex flex-col justify-center items-center h-full pt-16'>
          <h1 className="text-4xl sm:text-7xl font-extrabold mb-4 text-center text-white">
            My Jobs
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-6 mt-6 text-center">
            Manage all your job listings
          </p>
        </section>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
        </div>
      ) : companyJobs.length > 0 ? (
        <div className='max-w-6xl mx-auto overflow-x-auto mt-16 px-4'>
          {/* Jobs Table */}
          <table className="min-w-full table-fixed  border-collapse border-2 border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 border-b text-left font- hidden sm:table-cell">#</th>
                <th className="px-6 py-3 border-b text-left font- hidden sm:table-cell">Job Title</th>
                <th className="px-6 py-3 border-b text-left font- hidden sm:table-cell">Date</th>
                <th className="px-6 py-3 border-b text-left font- hidden sm:table-cell">Location</th>
                <th className="px-6 py-3 border-b text-left font- hidden sm:table-cell">Applications</th>
                <th className="px-6 py-3 border-b text-left font- hidden sm:table-cell">Visible</th>
              </tr>
            </thead>
            <tbody>
              {companyJobs.map((jobs, index) => (
                <tr key={jobs.job._id} className="hover:bg-gray-50 odd:bg-white even:bg-gray-50 cursor-pointer ">
                  <td className='px-3 py-2 border-b text-sm'>{index + 1}</td>
                  <td className="px-3 py-2 border-b text-sm">
                    <button
                      className="text-[#244034] font-semibold underline hover:text-[#c5f542]"
                      onClick={() => setSelectedJob(jobs.job)}
                    >
                      {jobs.job.jobTitle}
                    </button>
                  </td>
                  <td className="px-6 py-4 border-b text-sm ">{jobs.job?.createdAt ? new Date(jobs.job.createdAt).toLocaleDateString() : "N/A"}</td>
                  <td className="px-6 py-4 border-b text-sm">{jobs.job?.location || "N/A"}</td>
                  <td className="px-6 py-4 border-b text-sm">{jobs.applicants ?? 0}</td>
                  <td className="px-6 py-4 border-b text-sm">
                    <input 
                      type="checkbox"
                      className='cursor-pointer w-5 h-5 rounded'
                      checked={jobs.job.visibility === true}
                      onChange={(e) => toggleVisibility(jobs.job._id, e.target.checked)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal */}
          {selectedJob && (
            <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-start overflow-y-auto pt-24 px-4">
              <div className="bg-white w-full md:w-11/12 lg:w-4/5 rounded-2xl shadow-xl relative p-8">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedJob(null)}
                  className="absolute top-4 right-4 text-gray-600 text-xl font-bold hover:text-red-600 cursor-pointer"
                >
                  ×
                </button>

                {/* Job Header */}
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-gray-900">{selectedJob.jobTitle}</h2>
                  <p className="text-lg text-gray-700 mt-2"><Building className="inline mr-1" size={18} /> {selectedJob.companyName || "Private Organization"}</p>
                  <p className="text-lg text-gray-700"><MapPin className="inline mr-1" size={18} /> {selectedJob.location || "Remote"}</p>
                  <p className="text-lg text-gray-700"><Calendar className="inline mr-1" size={18} /> {new Date(selectedJob.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <section className="bg-gray-50 rounded-xl p-6 shadow-sm">
                      <h3 className="text-xl font-bold flex items-center gap-2 mb-3">
                        <FileText size={24} className="text-green-600" /> Job Description
                      </h3>
                      <p>{selectedJob?.description || "No description provided."}</p>
                    </section>

                    {/* Responsibilities */}
                    {selectedJob?.responsibilities?.length > 0 && (
                      <section className="bg-gray-50 rounded-xl p-6 shadow-sm">
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-3">
                          <Target size={24} className="text-blue-600" /> Responsibilities
                        </h3>
                        <ul className="list-disc ml-6 space-y-2">
                          {parseArrayData(selectedJob?.responsibilities).map((res, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle size={18} className="text-green-500 mt-1" /> {res}
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {/* Requirements */}
                    {selectedJob?.requirements.length > 0 && (
                      <section className="bg-gray-50 rounded-xl p-6 shadow-sm">
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-3">
                          <User size={24} className="text-purple-600" /> Requirements
                        </h3>
                        <ul className="list-disc ml-6 space-y-2">
                          {selectedJob?.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle size={18} className="text-green-500 mt-1" /> {req}
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                  </div>

                  {/* Right */}
                  <div className="space-y-6">
                    {/* Job Overview */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-3">
                      <h3 className="text-lg font-bold mb-2">Job Overview</h3>
                      <p><Briefcase className="inline mr-2" /> <strong>Type:</strong> {selectedJob?.jobType || "Full-Time"}</p>
                      <p><User className="inline mr-2" /> <strong>Experience:</strong> {selectedJob?.ExperienceLevel || "Not specified"}</p>
                      <p><GraduationCap className="inline mr-2" /> <strong>Education:</strong> {selectedJob?.EducationRequirement || "Not specified"}</p>
                      <p><Clock className="inline mr-2" /> <strong>Schedule:</strong> {selectedJob?.workSchedule || "Not specified"}</p>
                      {selectedJob?.numberOpening && <p><Users className="inline mr-2" /> <strong>Openings:</strong> {selectedJob?.numberOpening}</p>}
                      {selectedJob?.deadline && <p><Calendar className="inline mr-2" /> <strong>Deadline:</strong>{selectedJob?.deadline}</p>}
                    </div>

                    {/* Skills */}
                    {selectedJob?.skills?.length > 0 && (
                      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <h3 className="text-lg font-bold mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.skills.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Perks */}
                    {selectedJob?.perks?.length > 0 && (
                      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <h3 className="text-lg font-bold mb-2">Perks & Benefits</h3>
                        <ul className="list-disc ml-6 space-y-1">
                          {selectedJob.perks.map((perk, idx) => (
                            <li key={idx}>{perk}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative mb-8 w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-gray-400 text-4xl">💼</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-4 text-center">No Jobs Posted Yet</h3>
          <p className="text-gray-500 text-center max-w-md mb-6">
            You haven't created any jobs listings yet. Start posting jobs to attract talented candidates to your company.
          </p>
          <button
            onClick={() => navigate("/post-job")}
            className="px-6 py-3 bg-[#244034] text-white rounded-lg hover:bg-[#c5f542] hover:text-black font-bold cursor-pointer transition transform hover:scale-105"
          >
            Create Your First Job
          </button>
        </div>
      )}
    </>
  )
}

export default MyJobs
