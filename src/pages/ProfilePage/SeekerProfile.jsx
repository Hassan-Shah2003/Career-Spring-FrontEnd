import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/Auth/AuthContext';
import {
  CameraIcon,
  MapPinIcon,
  BriefcaseIcon,
  XMarkIcon,
  PlusIcon,
  EnvelopeIcon,
  PhoneIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import API from '../../services/api/api';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

const SeekerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const { user } = useAuth();
  // console.log(user);

  const [userData, setUserData] = useState({
  });
  // console.log(userData, "userdata...........");

  const [formData, setFormData] = useState(userData);

  useEffect(() => {
    if (user) {
      setUserData(user)
      setFormData(user);
    }
  }, [user]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleProfileChnage = (e) => {
    const { name, value } = e.target;
    // console.log(name, "name......,", value, "valueeeeeeee");

    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [name]: value,
      }
    }))
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (!newSkill) return;

      // check if skill already exists
      if (formData.profile.skills.includes(newSkill)) {
        toast.error("Skill already added!"); // optional feedback
        setSkillInput(""); // clear input
        return;
      }

      // add skill if not exists
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          skills: [...prev.profile.skills, newSkill]
        }
      }));

      setSkillInput(""); // clear input
    }
  };
  const removeSkill = (indexToRemove) => {
    setFormData((prev) => {
      // pehle current skills ko safely le lo
      const currentSkills = prev.profile.skills || [];

      // naya array banalo, jis me wo index remove ho
      const updatedSkills = currentSkills.filter((_, i) => i !== indexToRemove);

      // return updated formData
      return {
        ...prev,
        profile: {
          ...prev.profile,
          skills: updatedSkills,
        },
      };
    });
  };
  const handleExperienceChange = (e, index) => {
    const { name, value } = e.target;

    const updated = [...formData.profile.experience];
    updated[index][name] = value;

    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        experience: updated
      }
    }));
  };
  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        experience: [
          ...prev.profile.experience,
          { position: '', company: '' }
        ]
      }
    }));
  };
  const removeExperience = (index) => {
    const updated = formData.profile.experience.filter((_, i) => i !== index);

    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        experience: updated
      }
    }));
  };
  const handleEducationChange = (e, index) => {
    const { name, value } = e.target;

    const updated = [...formData.profile.education]; // copy array

    updated[index][name] = value; // specific field update

    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        education: updated
      }
    }));
  };
  const removeEducation = (index) => {
    const updated = formData.profile.education.filter((_, i) => i !== index);

    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        education: updated
      }
    }));
  };
  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        education: [
          ...(prev.profile.education || []),
          {
            institute: '',
            degree: '',
            year: '',
            grade: '',
            description: ''
          }
        ]
      }
    }));
  };


  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        resume: file, // actual file
        resumeOrignalName: file.name // UI ke liye
      }
    }));
  };
  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      // setUserData(formData)
      const data = new FormData();
      const { resume, ...restProfile } = formData.profile;
      data.append("profile", JSON.stringify(restProfile));
      if (resume instanceof File) {
        data.append("resume", resume);
      }

      const res = await API.put(`/user/profile/update`, data);
      // console.log(res.data.user);
      // console.log(formData, "sending to backend...");
      setUserData(res.data.user)
      setIsEditing(false);
      setIsLoading(false);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000);
    } catch (error) {
      // console.log(error);
      toast.error("profile update failed")
    } finally {
      setIsLoading(false)
    }
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataPhoto = new FormData();
    formDataPhoto.append('profilePhoto', file);

    try {
      setUploadingPhoto(true);
      const res = await API.put('/user/profile/update', formDataPhoto);
      // console.log(res, "res...........");

      if (res.data.success) {
        setFormData(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            profilePhoto: res.data.user.profile.profilePhoto
          }
        }));
        toast.success('Company logo updated!');
      }
    } catch (error) {
      toast.error('Failed to upload logo');
    } finally {
      setUploadingPhoto(false);
    }
  };
  return (
    <div>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-purple-50 to-pink-100">
        <div className="fixed top-6 left-[200px] z-50 transition hover:scale-110">
          <button
            onClick={() => window.history.back()}
            className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-[#c5f542] transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
        </div>
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-4 right-4 z-50 animate-slide-down">
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
              <ShieldCheckIcon className="h-5 w-5" />
              <span>Profile updated successfully!</span>
            </div>
          </div>
        )}

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Profile Header with Glass Effect */}
          <div className="relative mb-8 group">
            {/* Background with gradient and pattern */}
            <div className="h-64 rounded-3xl bg-[#244034] overflow-hidden">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <div className="absolute inset-0 opacity-20"></div>
            </div>

            {/* Profile Info Card */}
            <div className="absolute -bottom-16 left-8 right-8">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">

                  {/* Left Section */}
                  <div className="flex items-center space-x-6">

                    {/* Profile Photo */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#244034] to-[#c5f542] rounded-2xl blur opacity-75 group-hover:opacity-100 
                      transition-opacity"></div>
                      <img
                        src={formData?.profile?.profilePhoto}
                        alt={formData?.fullName}
                        className="relative w-28 h-28 rounded-2xl border-4 border-white object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                      {isEditing && (
                        <label className="absolute -bottom-2 -right-2 bg-white rounded-full p-2.5 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 cursor-pointer">
                          <CameraIcon className="h-5 w-5 text-gray-600 hover:text-[#244034]" />
                          <input type="file" className="hidden" accept="image/*" onChange={handleProfilePhotoUpload} disabled={uploadingPhoto} />
                        </label>
                      )}
                      {uploadingPhoto && (
                        <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-2">
                      {isEditing ? (
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="text-3xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none px-2 py-1"
                        />
                      ) : (
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                          {userData.fullName}
                        </h1>
                      )}

                      <div className="flex flex-wrap items-center gap-4">

                        {/* Title */}
                        <span className="flex items-center text-gray-600 bg-white/50 px-3 py-1 rounded-full text-sm">
                          <BriefcaseIcon className="h-4 w-4 mr-1 text-blue-600" />
                          {isEditing ? (
                            <input
                              type="text"
                              name="title"
                              placeholder='e.g. MERN Stack Developer'
                              value={formData.profile.title}
                              onChange={handleProfileChnage}
                              className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 text-sm"
                            />
                          ) : (
                            <span>{userData?.profile?.title}</span>
                          )}
                        </span>

                        {/* Location */}
                        <span className="flex items-center text-gray-600 bg-white/50 px-3 py-1 rounded-full text-sm">
                          <MapPinIcon className="h-4 w-4 mr-1 text-purple-600" />
                          {isEditing ? (
                            <input
                              type="text"
                              name="location"
                              value={formData?.location}
                              onChange={handleChange}
                              className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 text-sm"
                            />
                          ) : (
                            <span>{userData?.location}</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-4 lg:mt-0 flex items-center space-x-3">
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-3 bg-[#244034] text-white cursor-pointer rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 hover:bg-[#c5f542] hover:text-black"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <>
                        <button onClick={handleCancel} className="px-6 py-3 bg-gray-200 cursor-pointer text-gray-700 rounded-xl transition-all duration-300 hover:bg-red-600 hover:text-white">
                          Cancel
                        </button>
                        <button onClick={handleSave}
                         disabled={isLoading}
                         className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-pointer rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
                          Save Changes
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Tagline */}
                <div className="mt-6 pt-6 border-t border-gray-200/50">
                  {isEditing ? (
                    <input
                      type="text"
                      name="tagline"
                      placeholder='e.g. Passionate about building scalable web apps'
                      value={formData?.profile?.tagline}
                      onChange={handleProfileChnage}
                      className="w-full p-2 border rounded-lg"
                    />
                  ) : (
                    <p className="italic text-gray-700">"{userData?.profile?.tagline}"</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer for header */}
        <div className="h-32"></div>

        {/* Tabs with Glass Effect */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-2 mb-8 border border-white/20">
          <nav className="flex space-x-2">
            {['profile', 'experience', 'education'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm capitalize transition-all duration-300 ${activeTab === tab
                  ? 'bg-[#244034] text-white shadow-lg'
                  : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                  }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <>
                {/* About Section with Glass Effect */}
                <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold bg-[#244034] bg-clip-text text-transparent">
                      About Me
                    </h2>
                    <div className="h-1 w-20 bg-[#244034] rounded-full"></div>
                  </div>
                  {isEditing ? (
                    <textarea
                      name="about"
                      value={formData.about}
                      onChange={handleChange}
                      rows="5"
                      className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#244034] transition-all"
                      maxLength="500"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed text-lg">{userData.about}</p>
                  )}
                </div>

                {/* Skills Section with Tags */}
                <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold bg-[#244034] bg-clip-text text-transparent">
                      Skills & Expertise
                    </h2>
                    <div className="h-1 w-20 bg-[#244034] rounded-full"></div>
                  </div>

                  {isEditing ? (
                    <>
                      {/* Existing skills as tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData?.profile?.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="flex items-center px-3 py-1 bg-[#244034] text-white rounded-full text-sm"
                          >
                            {skill}
                            <button
                              onClick={() => removeSkill(index)}
                              className="ml-2 text-white font-bold hover:text-red-400"
                            >
                              x
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Input field for new skills */}
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type and press Enter to add a skill"
                        className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#244034] transition-all"
                      />

                      {/* Optional: Save button */}
                      <button
                        onClick={handleSave}
                        className="mt-3 px-4 py-2 bg-[#244034] text-white rounded-xl hover:bg-[#1b3023] transition-colors"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {userData?.profile?.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="group relative px-4 py-2 bg-[#244034] text-white rounded-xl text-sm font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-default"
                        >
                          {skill}
                          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity"></span>
                        </span>
                      ))}

                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-300 transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                {formData.profile.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="group bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-300 relative"
                  >
                    {isEditing && (
                      <button
                        onClick={() => removeExperience(index)}
                        className="absolute top-4 right-4 p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#244034] rounded-xl flex items-center justify-center text-white font-bold text-xl">
                        {index + 1}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                          <div>
                            {isEditing ? (
                              <>
                                <input
                                  type="text"
                                  name='position'
                                  value={exp.position}

                                  onChange={(e) => handleExperienceChange(e, index)}
                                  className="text-xl font-bold bg-white/50 border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-bg-[#244034] w-full"
                                  placeholder="e.g. Frontend Developer / Software Engineer"
                                />
                                <input
                                  type="text"
                                  name='company'
                                  value={exp.company}
                                  onChange={(e) => handleExperienceChange(e, index)}
                                  className="mt-2 text-gray-600 bg-white/50 border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-bg-[#244034] w-full"
                                  placeholder="e.g. Google, Systems Ltd, Freelance"
                                />
                              </>
                            ) : (
                              <>
                                <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                                <p className="text-gray-600">{exp.company}</p>
                              </>
                            )}
                          </div>

                          {isEditing ? (
                            <input
                              type="text"
                              name='period'
                              value={exp.period}
                              onChange={(e) => handleExperienceChange(e, index)}
                              className="px-4 py-2 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244034]"
                              placeholder="e.g. Jan 2022 - Dec 2023 or Present"
                            />
                          ) : (
                            <span className="px-4 py-2 bg-blue-100 text-[#244034] rounded-lg text-sm font-medium">
                              {exp.period}
                            </span>
                          )}
                        </div>

                        {isEditing ? (
                          <textarea
                            name='description'
                            value={exp.description}
                            onChange={(e) => handleExperienceChange(e, index)}
                            rows="3"
                            className="w-full mt-4 px-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#244034]"
                            placeholder="Describe your role, responsibilities, and technologies used (e.g. built responsive web apps using React, improved performance by 30%)"
                          />
                        ) : (
                          <p className="text-gray-700 mt-4">{exp.description}</p>
                        )}

                        {/* Achievements */}
                        {exp.achievements && exp.achievements.length > 0 && !isEditing && (
                          <div className="mt-4 space-y-2">
                            <h4 className="font-semibold text-gray-900 flex items-center">
                              <StarIconSolid className="h-4 w-4 text-yellow-500 mr-2" />
                              Key Achievements
                            </h4>
                            <ul className="space-y-2">
                              {exp.achievements.map((achievement, i) => (
                                <li key={i} className="flex items-start text-gray-600">
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2"></span>
                                  {achievement}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isEditing && (
                  <button
                    onClick={addExperience}
                    className="w-full py-6 border-3 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-[#244034] hover:text-[#244034] hover:bg-blue-50/50 transition-all duration-300 flex items-center justify-center space-x-2 group"
                  >
                    <PlusIcon className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
                    <span className="font-medium">Add Experience</span>
                  </button>
                )}
              </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                {formData.profile.education.map((edu, index) => (
                  <div
                    key={index}
                    className="group bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-300 relative"
                  >
                    {isEditing && (
                      <button
                        onClick={() => removeEducation(index)}
                        className="absolute top-4 right-4 p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#244034] rounded-xl flex items-center justify-center text-white font-bold text-xl">
                        {index + 1}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                          <div>
                            {isEditing ? (
                              <>
                                <input
                                  type="text"
                                  name='institute'
                                  value={edu.institute}
                                  onChange={(e) => handleEducationChange(e, index)}
                                  className="text-xl font-bold bg-white/50 border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#244034] w-full"
                                  placeholder="e.g. Federal Urdu University, Karachi"
                                />
                                <input
                                  type="text"
                                  name='degree'
                                  value={edu.degree}
                                  onChange={(e) => handleEducationChange(e, index)}
                                  className="mt-2 text-gray-600 bg-white/50 border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#244034] w-full"
                                  placeholder="e.g. BS Computer Science"
                                />
                              </>
                            ) : (
                              <>
                                <h3 className="text-xl font-bold text-gray-900">{edu.institute}</h3>
                                <p className="text-gray-600">{edu.degree}</p>
                              </>
                            )}
                          </div>

                          {isEditing ? (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                name='year'
                                value={edu.year}
                                onChange={(e) => handleEducationChange(e, index)}
                                className="px-4 py-2 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244034]"
                                placeholder="e.g. 2021 - 2025 or 2025 (Expected)"
                              />
                              <input
                                type="text"
                                name='grade'
                                value={edu.grade}
                                onChange={(e) => handleEducationChange(e, index)}
                                className="px-4 py-2 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244034]"
                                placeholder="e.g. CGPA 3.5 / 4.0 or A Grade"
                              />
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <span className="px-4 py-2 bg-[#244034] text-white rounded-lg text-sm font-medium">
                                {edu.year}
                              </span>
                              {edu.grade && (
                                <span className="px-4 py-2 bg-[#c5f542] text-black rounded-lg text-sm font-medium">
                                  {edu.grade}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {isEditing ? (
                          <textarea
                            name='description'
                            value={edu.description}
                            onChange={(e) => handleEducationChange(e, index)}
                            rows="3"
                            className="w-full mt-4 px-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#244034]"
                            placeholder="Optional: Mention major subjects, projects, or achievements (e.g. Final Year Project on Web Development)"
                          />
                        ) : (
                          <p className="text-gray-700 mt-4">{edu.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isEditing && (
                  <button
                    onClick={addEducation}
                    className="w-full py-6 border-3 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-[#244034] hover:text-[#244034] hover:bg-green-50/50 transition-all duration-300 flex items-center justify-center space-x-2 group"
                  >
                    <PlusIcon className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
                    <span className="font-medium">Add Education</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-xl font-bold bg-[#244034] bg-clip-text text-transparent mb-6">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <EnvelopeIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Email</p>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        // disabled
                        value={formData.email}
                        onChange={handleChange}
                        className="text-sm bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#244034] w-full"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">{userData.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <PhoneIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Phone</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="text-sm bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#244034] w-full"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">{userData.phoneNumber}</p>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors">

                  <div className="flex items-center justify-between">

                    {/* Left Side */}
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                        <DocumentTextIcon className="h-5 w-5 text-pink-600" />
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Resume</p>

                        {formData?.profile?.resume ? (
                          <a
                            href={formData.profile.resume} // the Cloudinary URL
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-900 underline hover:text-blue-600"
                          >
                            {formData?.profile?.resumeOrignalName || 'View Resume'}
                          </a>
                        ) : (
                          <p className="text-sm text-gray-900">No resume uploaded</p>
                        )}
                      </div>
                    </div>

                    {/* Right Side (Only in Edit Mode) */}
                    {isEditing && (
                      <>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeUpload}
                          className="hidden"
                          id="resumeUpload"
                        />

                        <label
                          htmlFor="resumeUpload"
                          className="px-3 py-1 bg-[#244034] text-white rounded-md text-sm cursor-pointer hover:bg-[#1b3023] transition"
                        >
                          Upload
                        </label>
                      </>
                    )}

                  </div>
                </div>
              </div>
            </div>

            {/* Personal Info Card */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-xl font-bold bg-[#244034] bg-clip-text text-transparent mb-6">
                Personal Details
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                  <span className="text-gray-600">Age</span>
                  {isEditing ? (
                    <input
                      type="number"
                      name="age"
                      value={formData.profile.age || ''}
                      onChange={handleProfileChnage}
                      className="text-right bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#244034] w-20"
                    />
                  ) : (
                    <span className="font-semibold text-gray-900">{userData?.profile?.age || 'Not specified'}</span>
                  )}
                </div>

                <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                  <span className="text-gray-600">Role</span>
                  <span className="font-semibold text-gray-900 capitalize">{userData.role}</span>

                </div>

                {formData.role === 'company' && (
                  <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                    <span className="text-gray-600">Company Name</span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="text-right bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#244034]"
                      />
                    ) : (
                      <span className="font-semibold text-gray-900">{userData.companyName || 'Not specified'}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>
        {`
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }

  .animate-blob {
    animation: blob 7s infinite;
  }

  .animation-delay-2000 {
    animation-delay: 2s;
  }

  .animation-delay-4000 {
    animation-delay: 4s;
  }

  @keyframes slide-down {
    0% { transform: translateY(-100%); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }

  .animate-slide-down {
    animation: slide-down 0.3s ease-out;
  }
  `}
      </style>
    </div>
  );
};

export default SeekerProfile;