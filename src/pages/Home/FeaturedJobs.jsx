import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
// import supaBase from "../../services/supabaseClient";
import BigJobLoader from "../../components/common/loader/BigJobLoader";
import { useAuth } from "../../components/Auth/AuthContext";
import API from "../../services/api/api";

const FeaturedJobs = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  // console.log(featuredJobs);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  // console.log(user,"user.........");
  
  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        setLoading(true);

        // Step 1: get jobs
        const res = await API.get(`/v1/jobs/get`);
        const data = res.data.job.filter((job) => job.isFeatured === true)
        setFeaturedJobs(data)

      } catch (error) {
      // console.error("Jobs fetch error:", error);        
      } finally{
        setLoading(false);
      }
    };


    fetchFeaturedJobs();
  }, []);

  return (
    <section className="relative py-24 bg-gradient-to-b from-[#f7fdfb] via-[#e9f8f1] to-[#ffffff] overflow-hidden">
      {/* Decorative Gradient Lights */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-[#b4f8c8]/40 to-[#8fe6b1]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-[#244034]/30 to-[#5bc98b]/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-extrabold text-center text-[#1a2e23] mb-12"
        >
          🌟 Featured <span className="text-[#2fa26a]">Job Openings</span>
        </motion.h2>

        {/* Loader */}
        {loading && featuredJobs.length === 0 ? (
          <BigJobLoader />
        ) : featuredJobs.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No featured jobs yet.
          </p>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.15 },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {featuredJobs.map((job) => (
              <motion.div
                key={job._id}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
                onClick={() => navigate(`/jobs/${job._id}`)}
                className="group relative bg-white/80 backdrop-blur-md rounded-b-2xl rounded-t-lg p-6 border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-[#2fa26a]/50 cursor-pointer"
              >
                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2fa26a] to-[#244034] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={`${job.postedBy.profile.profilePhoto}`}
                      alt="User Avatar"
                      className="w-14 h-14 rounded-full object-cover bg-[#2fa26a]/10"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                      }}
                    />

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#244034] transition-colors">
                        {job?.jobTitle}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {job?.postedBy?.companyName} • {job.location}
                      </p>
                    </div>
                  </div>
                  <span className="bg-[#e4f8ee] text-[#244034] text-xs px-3 py-1 rounded-full font-medium">
                    {job.jobType}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-5 line-clamp-2">
                  {job.description?.slice(0, 100) ||
                    "Join our team to work on cutting-edge projects and grow your skills in a collaborative environment."}
                </p>

                <div className="border-t border-gray-100 mb-5"></div>

                {/* Footer */}
                <div className="flex justify-between items-center">
                  <span className="text-[#244034] font-semibold text-base">
                    {job.MinimumSalary && job.MaximumSalary? `${job.MinimumSalary} - ${job.MaximumSalary} ${job.currency}`:"Negotiable"}
                  </span>
                  <button
                    className="relative bg-[#244034] text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-sm hover:shadow-lg overflow-hidden transition-all duration-300 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/jobs/${job._id}`);
                    }}
                  >
                    <Link to="/apply-form" className="relative z-10">
                      Apply Now
                    </Link>
                    <span className="absolute inset-0 bg-gradient-to-r from-[#2fa26a] to-[#244034] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedJobs;
