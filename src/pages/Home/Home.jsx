import { motion } from "framer-motion";
import React, { useState, useEffect } from 'react';
import Navbar from "../../components/common/navbar/Navbar"
import SearchBar from "../../components/jobs/SearchBar/searchBar"
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch, FaMapMarkerAlt, FaBriefcase,
  FaUser, FaBuilding, FaArrowRight,
  FaFacebook, FaTwitter, FaLinkedin, FaInstagram,
  FaCheckCircle, FaUpload, FaFileAlt
} from 'react-icons/fa';
// import supaBase from '../../services/supabaseClient';
import {
  Building2, Paintbrush, Wrench, Settings, Plug, Laptop,
  Globe, BarChart3, Brain, Shield, Headphones, Briefcase,
  ClipboardCheck, Users, Package, Megaphone, Type, FileText,
  Coins, BookOpen, Hospital, Video, Camera, Film, Truck,
  Car, Scale, Gavel, Calendar, Utensils, Lock, Droplet, Newspaper,
  Cloud,
  Cpu
} from "lucide-react";
import BigJobLoader from '../../components/common/loader/BigJobLoader';
import FeaturedJobs from '../Home/FeaturedJobs';
import Footer from "../../components/common/Footer/Footer";
import API from "../../services/api/api";


const JobPortal = () => {
  // const [activeTab, setActiveTab] = useState('employee');
  const [categories, setCategories] = useState([]);
  // console.log(categories,"categories..........................");
  
  const [visibleCount, setVisibleCount] = useState(8)
  const [loading, setLoading] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigate = useNavigate();
  const getIconForCategory = (category) => {
    const map = {
      // 🏗️ Design & Architecture
      // Design & Architecture
      "Architecture": <Building2 className="w-8 h-8 text-[#244034]" />,
      "Urban Planning": <Building2 className="w-8 h-8 text-[#244034]" />,
      "Interior Design": <Paintbrush className="w-8 h-8 text-[#244034]" />,
      "Landscape Architecture": <Building2 className="w-8 h-8 text-[#244034]" />,
      "Construction Management": <Wrench className="w-8 h-8 text-[#244034]" />,
      "Civil Engineering": <Settings className="w-8 h-8 text-[#244034]" />,
      "Mechanical Design": <Wrench className="w-8 h-8 text-[#244034]" />,
      "Electrical Design": <Plug className="w-8 h-8 text-[#244034]" />,

      // Technology & IT
      "Software Development": <Laptop className="w-8 h-8 text-[#244034]" />,
      "Web Development": <Globe className="w-8 h-8 text-[#244034]" />,
      "Mobile App Development": <Globe className="w-8 h-8 text-[#244034]" />,
      "UI/UX Design": <Paintbrush className="w-8 h-8 text-[#244034]" />,
      "Data Science": <BarChart3 className="w-8 h-8 text-[#244034]" />,
      "Artificial Intelligence": <Brain className="w-8 h-8 text-[#244034]" />,
      "Cyber Security": <Shield className="w-8 h-8 text-[#244034]" />,
      "Database": <Settings className="w-8 h-8 text-[#244034]" />,
      "Cloud": <Cloud className="w-8 h-8 text-[#244034]" />,
      "DevOps": <Cpu className="w-8 h-8 text-[#244034]" />,
      "IT Support": <Headphones className="w-8 h-8 text-[#244034]" />,

      // Business
      "Business Development": <Briefcase className="w-8 h-8 text-[#244034]" />,
      "Project Management": <ClipboardCheck className="w-8 h-8 text-[#244034]" />,
      "Human Resources": <Users className="w-8 h-8 text-[#244034]" />,
      "Procurement": <Package className="w-8 h-8 text-[#244034]" />,
      "Administration": <Settings className="w-8 h-8 text-[#244034]" />,
      "Operations": <Settings className="w-8 h-8 text-[#244034]" />,
      "Customer Relationship": <Users className="w-8 h-8 text-[#244034]" />,

      // Marketing & Sales
      "Marketing": <Megaphone className="w-8 h-8 text-[#244034]" />,
      "Sales": <BarChart3 className="w-8 h-8 text-[#244034]" />,
      "Brand": <Megaphone className="w-8 h-8 text-[#244034]" />,
      "Content": <Type className="w-8 h-8 text-[#244034]" />,

      // Finance
      "Accounting": <Coins className="w-8 h-8 text-[#244034]" />,
      "Finance": <Coins className="w-8 h-8 text-[#244034]" />,
      "Auditing": <FileText className="w-8 h-8 text-[#244034]" />,
      "Taxation": <FileText className="w-8 h-8 text-[#244034]" />,
      "Investment": <Coins className="w-8 h-8 text-[#244034]" />,
      "Insurance": <Shield className="w-8 h-8 text-[#244034]" />,

      // Education
      "Teacher": <BookOpen className="w-8 h-8 text-[#244034]" />,
      "Lecturer": <BookOpen className="w-8 h-8 text-[#244034]" />,
      "Trainer": <BookOpen className="w-8 h-8 text-[#244034]" />,
      "Education": <BookOpen className="w-8 h-8 text-[#244034]" />,

      // Healthcare
      "Doctor": <Hospital className="w-8 h-8 text-[#244034]" />,
      "Nurse": <Hospital className="w-8 h-8 text-[#244034]" />,
      "Pharmacist": <Hospital className="w-8 h-8 text-[#244034]" />,
      "Healthcare": <Hospital className="w-8 h-8 text-[#244034]" />,

      // Creative
      "Graphic": <Paintbrush className="w-8 h-8 text-[#244034]" />,
      "Video": <Video className="w-8 h-8 text-[#244034]" />,
      "Photography": <Camera className="w-8 h-8 text-[#244034]" />,
      "Animation": <Film className="w-8 h-8 text-[#244034]" />,
      "Journalism": <Newspaper className="w-8 h-8 text-[#244034]" />,

      // Engineering
      "Engineer": <Settings className="w-8 h-8 text-[#244034]" />,
      "Technician": <Wrench className="w-8 h-8 text-[#244034]" />,

      // Logistics
      "Supply": <Truck className="w-8 h-8 text-[#244034]" />,
      "Transport": <Truck className="w-8 h-8 text-[#244034]" />,
      "Warehouse": <Package className="w-8 h-8 text-[#244034]" />,

      // Legal
      "Lawyer": <Scale className="w-8 h-8 text-[#244034]" />,
      "Compliance": <Gavel className="w-8 h-8 text-[#244034]" />,
      "Contract": <FileText className="w-8 h-8 text-[#244034]" />,

      // Hospitality
      "Hotel": <Calendar className="w-8 h-8 text-[#244034]" />,
      "Event": <Calendar className="w-8 h-8 text-[#244034]" />,
      "Chef": <Utensils className="w-8 h-8 text-[#244034]" />,
      "Travel": <Globe className="w-8 h-8 text-[#244034]" />,

      // Others
      "Customer": <Headphones className="w-8 h-8 text-[#244034]" />,
      "Security": <Lock className="w-8 h-8 text-[#244034]" />,
      "Driver": <Car className="w-8 h-8 text-[#244034]" />,
      "Electrician": <Plug className="w-8 h-8 text-[#244034]" />,
      "Mechanic": <Wrench className="w-8 h-8 text-[#244034]" />,

    };
    const foundKey = Object.keys(map).find(key =>
      category.toLowerCase().includes(key.toLowerCase())
    );

    return map[foundKey] || <Briefcase className="w-8 h-8 text-[#244034]" />;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const res = await API.get("/v1/jobs/get")
      const data = res.data.job.map((job)=>job.jobCategory);
      
      // console.log(data)
      // if (error) {
      //   // console.error("Error fetching categories:", error);
      //   setLoading(false);
      //   return;
      // }
      const categoryCount = data.reduce((acc, category) => {
        if (category) {
          acc[category] = (acc[category] || 0) + 1;
        }
        return acc;
      }, {})
      // console.log(categoryCount,"category const...........");
      
      const formattedCategories = Object.entries(categoryCount).map(([name, jobs]) => ({
        name,
        jobs,
        icon: getIconForCategory(name),
      }));
      formattedCategories.sort((a, b) => b.jobs - a.jobs)
      setCategories(formattedCategories);
      setLoading(false)
    }
    fetchCategories();
  }, [])
  const handleSeeMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 8)
      setLoadingMore(false)
    }, 100);
  }
  const handleCategoryClick = (categoryName) => {
    if (loadingCategory) return;
    setLoadingCategory(categoryName); // loading state set karo
    navigate(`jobs?category=${encodeURIComponent(categoryName)}`)


  }

  // Top companies
  const topCompanies = [
    { name: 'Google', logo: 'G' },
    { name: 'Microsoft', logo: 'M' },
    { name: 'Apple', logo: 'A' },
    { name: 'Amazon', logo: 'A' },
    { name: 'Meta', logo: 'M' },
    { name: 'Netflix', logo: 'N' }
  ];

  // How it works steps
  const howItWorks = [
    {
      step: 1,
      title: 'Create Account',
      description: 'Sign up and create your profile',
      icon: FaUser
    },
    {
      step: 2,
      title: 'Upload Resume',
      description: 'Add your resume and portfolio',
      icon: FaUpload
    },
    {
      step: 3,
      title: 'Search Jobs',
      description: 'Find jobs that match your skills',
      icon: FaSearch
    },
    {
      step: 4,
      title: 'Apply',
      description: 'Apply to your desired positions',
      icon: FaFileAlt
    }
  ];



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="bg-[#244034] p-5">
        <Navbar></Navbar>
      </header>

      {/* Hero Section */}
      <div className="text-center">

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-lg">
          <SearchBar></SearchBar>
        </div>
      </div>

      {/* Job Categories Section */}
      <section className="relative py-24 bg-gradient-to-b from-[#f7fdfb] via-[#e9f8f1] to-white overflow-hidden">

        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-gradient-to-br from-[#b4f8c8]/40 to-[#8fe6b1]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#244034]/30 to-[#5bc98b]/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          {/* Title */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-14 text-[#1a2e23] tracking-tight">
            Explore <span className="text-[#2fa26a]">Job Categories</span>
          </h2>

          {loading ? (
            <BigJobLoader />
          ) : (
            <>
              {/* Categories Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                {categories.slice(0, visibleCount).map((category, index) => (
                  <div
                    key={index}
                    onClick={() => handleCategoryClick(category.name)}
                    className={`relative group bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-[#2fa26a]/50 cursor-pointer overflow-hidden ${loadingCategory
                      ? "opacity-60 cursor-not-allowed pointer-events-none"
                      : ""
                      }`}
                  >
                    {/* Glow Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2fa26a]/10 to-[#244034]/10 opacity-0 group-hover:opacity-80 blur-2xl transition-opacity duration-500"></div>

                    {/* Content */}
                    <div className="relative z-10 p-8 flex flex-col items-center text-center">
                      <div className="text-4xl mb-4 text-[#2fa26a] group-hover:scale-125 transition-transform duration-300">
                        {category.icon}
                      </div>
                      <h3 className="font-semibold text-lg text-gray-800 mb-1 group-hover:text-[#244034] transition-colors duration-300">
                        {category.name}
                      </h3>

                      {loadingCategory === category.name ? (
                        <p className="text-[#244034] font-medium animate-pulse flex items-center gap-2">
                          <span className="w-3 h-3 border-2 border-[#244034] border-t-transparent rounded-full animate-spin"></span>
                          Loading...
                        </p>
                      ) : (
                        <p className="text-gray-600 text-sm group-hover:text-[#2fa26a] transition-colors duration-300">
                          {category.jobs} jobs available
                        </p>
                      )}
                    </div>

                    {/* Bottom Accent Line */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#2fa26a] to-[#244034] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 rounded-b-2xl"></div>
                  </div>
                ))}
              </div>

              {/* See More Button */}
              {visibleCount < categories.length && (
                <div className="text-center mt-16">
                  <button
                    onClick={handleSeeMore}
                    disabled={loadingMore}
                    className={`relative px-10 py-3.5 rounded-full font-semibold text-sm tracking-wide overflow-hidden transition-all duration-500 
                ${loadingMore
                        ? "bg-[#244034] text-white opacity-70 cursor-not-allowed"
                        : "bg-[#244034] text-white hover:text-black hover:shadow-lg"
                      }`}
                  >
                    <span className="relative z-10">
                      {loadingMore ? "Loading..." : "See More"}
                    </span>
                    {!loadingMore && (
                      <span className="absolute inset-0 bg-gradient-to-r from-[#2fa26a] to-[#c5f542] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        {/* Featured Jobs */}
        <div className="mt-20">
          <FeaturedJobs />
        </div>

        {/* How It Works */}
        <section className="relative py-20">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-10 left-1/3 w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#244034] rounded-full blur-3xl opacity-20 animate-pulse"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-[#244034] mb-4 tracking-tight">
                🚀 How It <span className="text-green-600">Works</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
                Follow these simple steps to land your dream job or find the perfect candidate.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {howItWorks.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={index}
                    className="group relative bg-white/70 backdrop-blur-md border border-white/40 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-green-400 cursor-pointer"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-400/20 to-[#244034]/20 opacity-0 group-hover:opacity-80 blur-xl transition-all duration-500"></div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-[#244034] rounded-2xl flex items-center justify-center text-white text-3xl mb-5 shadow-md group-hover:scale-110 transition-transform duration-300">
                        <IconComponent />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 group-hover:text-[#244034] transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Top Companies */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                Top <span className="text-[#244034]">Companies</span>
              </h2>
              <p className="text-gray-600 text-lg">
                Discover and connect with leading organizations around the world
              </p>
              <div className="mt-4 w-24 h-1 bg-[#244034] mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {topCompanies.map((company, index) => (
                <motion.div
                  key={index}
                  className="group bg-white/70 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl hover:border-[#244034]/20 transition-all duration-500 flex flex-col items-center justify-center p-6 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#244034] to-[#4a6f5b] flex items-center justify-center mb-3 text-white text-2xl font-bold shadow-md group-hover:shadow-[#244034]/50 transition-all">
                    {company.logo}
                  </div>
                  <span className="text-gray-800 font-semibold text-sm md:text-base group-hover:text-[#244034] transition-colors">
                    {company.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </section>

      {/* Statistics Section */}
      {/* <section className="py-16 bg-[#244034] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <Footer></Footer>
    </div>
  );
};

export default JobPortal;