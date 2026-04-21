import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/Auth/AuthContext';
import {
  PencilIcon,
  CameraIcon,
  MapPinIcon,
  BriefcaseIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  ChartBarIcon,
  SparklesIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  ClockIcon,
  DocumentTextIcon,
  LinkIcon,
  ChevronRightIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import API from '../../services/api/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Backpack } from 'lucide-react';

const CompanyProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const { user } = useAuth();
  // console.log(user);

  const [userData, setUserData] = useState({
  });
  // console.log(userData, "userdata.......");

  const [formData, setFormData] = useState(userData);
  // console.log(formData, "formdata");

  // const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    if (user) {
      setUserData(user)
      setFormData(user);
    }
  }, [user]);

  const handleInputChange = (e, section = "main", field = null) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      // MAIN LEVEL FIELDS (companyName, email, phoneNumber, location etc.)
      if (section === "main") {
        return {
          ...prev,
          [name]: value,
        };
      }
      if (section === "profile") {
        return {
          ...prev,
          profile: {
            ...prev.profile,
            [name]: value,
          },
        };
      }
      // COMPANY PROFILE FIELDS (industry, mission, vision, companySize etc.)
      if (section === "companyProfile") {
        return {
          ...prev,
          companyProfile: {
            ...prev.companyProfile,
            [name]: value,
          },
        };
      }

      // SOCIAL LINKS (inside companyProfile)
      if (section === "social") {
        return {
          ...prev,
          companyProfile: {
            ...prev.companyProfile,
            socialLinks: {
              ...prev.companyProfile.socialLinks,
              [field]: value,
            },
          },
        };
      }

      return prev;
    });
  };
  const handleSave = async () => {
    try {
      setIsLoading(true);

      const data = new FormData();

      // 🔹 Destructure data
      const { companyProfile, ...mainFields } = formData;

      // 🔹 Separate file if any (e.g. logo/resume)
      const { profilePhoto, ...restCompanyProfile } = companyProfile;

      // ✅ Main fields send karo (companyName, email etc.)
      data.append("main", JSON.stringify(mainFields));

      // ✅ Company Profile send karo
      data.append("companyProfile", JSON.stringify(restCompanyProfile));

      // ✅ File (agar hai)
      if (profilePhoto instanceof File) {
        data.append("profilePhoto", profilePhoto);
      }

      // 🔥 API call
      const res = await API.put(`/user/profile/update`, data);

      // console.log(res.data.user);
      // console.log(formData, "sending to backend...");

      setUserData(res.data.user);
      setIsEditing(false);
      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);

    } catch (error) {
      // console.log(error);
      toast.error("Profile update failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  const fetchProfile = async () => {
    try {
      const res = await API.get(`/user/profile`);
      const data = res.data.data;
      setUserData(prev => ({
        ...prev,
        ...data,
        profile: {
          ...prev.profile,
          ...data.profile,
          socialLinks: {
            ...prev.profile?.socialLinks,
            ...data.profile?.socialLinks
          }
        }
      }));
    } catch (error) {
      console.error(error);
      toast.error('Failed to load profile');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center space-x-2">
            <ShieldCheckIcon className="h-5 w-5" />
            <span className="font-medium">Company profile updated successfully!</span>
          </div>
        </div>
      )}

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80  rounded-full "></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 "></div>
        <div className="absolute top-40 left-40 w-80 h-80 "></div>
      </div>

      <div className="relative max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Company Header */}
        <div className="relative mb-8 group">
          {/* Cover Photo */}
          <div className="h-64 rounded-3xl bg-[#244034] overflow-hidden relative">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="absolute inset-0"></div>
            <div className="absolute bottom-4 right-4">
              {/* {isEditing && (
                <button className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg text-white hover:bg-white/30 transition-all">
                  Change Cover
                </button>
              )} */}
            </div>
          </div>

          {/* Company Info Card */}
          <div className="absolute -bottom-20 left-8 right-8">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-gray-200">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                {/* Left Section */}
                <div className="flex items-center space-x-6">
                  {/* Company Logo */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#244034] to-[#c5f542] rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                    <img
                      src={formData?.profile?.profilePhoto || 'https://via.placeholder.com/112x112?text=Company'}
                      alt={formData.companyName}
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

                  {/* Company Info */}
                  <div className="space-y-2">
                    {isEditing ? (
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange(e, 'main')}
                        className="text-3xl font-bold bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:border-[#244034] transition-colors"
                        placeholder="Company Name"
                      />
                    ) : (
                      <h1 className="text-3xl font-bold text-gray-900">{userData?.companyName || 'Company Name'}</h1>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                      {formData?.companyProfile?.industry && (
                        <span className="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
                          <BuildingOfficeIcon className="h-4 w-4 mr-1 text-blue-600" />
                          <span>{formData?.companyProfile?.industry}</span>
                        </span>
                      )}

                      <span className="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
                        <MapPinIcon className="h-4 w-4 mr-1 text-green-600" />
                        {isEditing ? (
                          <input
                            type="text"
                            name="location"
                            value={formData?.location}
                            onChange={(e) => handleInputChange(e, 'main')}
                            className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#244034] text-sm"
                            placeholder="Headquarters"
                          />
                        ) : (
                          <span>{userData?.location || 'Add location'}</span>
                        )}
                      </span>

                      {formData?.companyProfile?.foundedYear && (
                        <span className="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
                          <CalendarIcon className="h-4 w-4 mr-1 text-purple-600" />
                          <span>Founded {formData.companyProfile?.foundedYear}</span>
                        </span>
                      )}

                      {formData?.companyProfile?.companySize && (
                        <span className="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
                          <UserGroupIcon className="h-4 w-4 mr-1 text-yellow-500" />
                          <span>{formData?.companyProfile?.companySize} employees</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center space-x-3">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-3 bg-[#244034] text-white cursor-pointer rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 hover:bg-[#c5f542] hover:text-black"
                    >
                      <PencilIcon className="h-5 w-5" />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleCancel}
                        className="px-6 py-3 bg-gray-200 cursor-pointer text-gray-700 rounded-xl transition-all duration-300 hover:bg-red-600 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-pointer rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheckIcon className="h-5 w-5" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Tagline/Mission */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="relative">
                  <SparklesIcon className="absolute -left-2 -top-2 h-6 w-6 text-blue-600" />
                  {isEditing ? (
                    <textarea
                      name="tagline"
                      value={formData?.profile?.tagline}
                      onChange={(e) => handleInputChange(e, 'profile')}
                      rows="2"
                      className="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244034]"
                      placeholder="Company tagline or brief description..."
                    />
                  ) : (
                    <p className="text-gray-600 pl-8 break-words">{userData?.profile?.tagline || 'Add your company description'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="h-28"></div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Company */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">About the Company</h2>
                <div className="h-1 w-20 bg-[#244034] rounded-full"></div>
              </div>
              {isEditing ? (
                <textarea
                  name="about"
                  value={formData?.about}
                  onChange={(e) => handleInputChange(e, 'main')}
                  rows="6"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#244034] transition-all"
                  maxLength="1000"
                  placeholder="Tell us about your company history, values, and what makes you unique..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed text-lg break-words">
                  {userData?.about || 'No company description added yet. Click edit to tell candidates about your company!'}
                </p>
              )}
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mission */}
              <div className="bg-white rounded-2xl shadow-lg p-8  max-w-full border border-gray-200 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <BriefcaseIcon className="h-5 w-5 text-blue-600" />
                  </span>
                  Our Mission
                </h3>
                {isEditing ? (
                  <textarea
                    name="mission"
                    value={formData?.companyProfile?.mission}
                    onChange={(e) => handleInputChange(e, 'companyProfile')}
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#244034]"
                    placeholder="What is your company's mission?"
                  />
                ) : (
                  <p className="text-gray-600 break-words">{formData?.companyProfile?.mission || 'No mission statement added yet'}</p>
                )}
              </div>

              {/* Vision */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <GlobeAltIcon className="h-5 w-5 text-purple-600" />
                  </span>
                  Our Vision
                </h3>
                {isEditing ? (
                  <textarea
                    name="vision"
                    value={formData?.companyProfile?.vision}
                    onChange={(e) => handleInputChange(e, 'companyProfile')}
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#244034]"
                    placeholder="What is your company's vision for the future?"
                  />
                ) : (
                  <p className="text-gray-600 break-words">{formData?.companyProfile?.vision || 'No vision statement added yet'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>

              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <EnvelopeIcon className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Email</p>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData?.email}
                        onChange={(e) => handleInputChange(e, 'main')}
                        className="text-sm bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#244034] w-full"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">{userData?.email || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <PhoneIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Phone</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData?.phoneNumber}
                        onChange={(e) => handleInputChange(e, 'main')}
                        className="text-sm bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#244034] w-full"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">{userData?.phoneNumber || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <GlobeAltIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Website</p>
                    {isEditing ? (
                      <input
                        type="url"
                        name="website"
                        value={formData?.companyProfile?.website}
                        onChange={(e) => handleInputChange(e, 'companyProfile')}
                        className="text-sm bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#244034] w-full"
                        placeholder="https://company.com"
                      />
                    ) : (
                      formData?.companyProfile?.website ? (
                        <a href={formData?.companyProfile?.website} target="_blank" rel="noopener noreferrer" className="text-sm text-[#244034] hover:underline">
                          {formData?.companyProfile?.website}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-500">Not provided</p>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Company Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Company Details</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Founded Year</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="foundedYear"
                      value={formData?.companyProfile?.foundedYear}
                      onChange={(e) => handleInputChange(e, 'companyProfile')}
                      className="text-right bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#244034] w-24"
                      placeholder="e.g., 2020"
                    />
                  ) : (
                    <span className="font-semibold text-gray-900">{formData?.companyProfile?.foundedYear || 'Not specified'}</span>
                  )}
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Company Size</span>
                  {isEditing ? (
                    <select
                      name="companySize"
                      value={formData?.companyProfile?.companySize}
                      onChange={(e) => handleInputChange(e, 'companyProfile')}
                      className="text-right bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#244034]"
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  ) : (
                    <span className="font-semibold text-gray-900">{formData?.companyProfile?.companySize || 'Not specified'}</span>
                  )}
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Industry</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="industry"
                      value={formData?.companyProfile?.industry}
                      onChange={(e) => handleInputChange(e, 'companyProfile')}
                      className="text-right bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#244034] w-32"
                      placeholder="e.g., Technology"
                    />
                  ) : (
                    <span className="font-semibold text-gray-900">{formData?.companyProfile?.industry || 'Not specified'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Social Media</h3>

              <div className="space-y-3">
                <div>
                  <label className="text-md text-black font-black">LinkedIn</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData?.companyProfile?.socialLinks?.linkedin || ''}
                      onChange={(e) => handleInputChange(e, 'social', 'linkedin')}
                      className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244034]"
                      placeholder="LinkedIn URL"
                    />
                  ) : (
                    formData?.companyProfile?.socialLinks?.linkedin && (
                      <a href={formData?.companyProfile?.socialLinks?.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 hover:underline text-sm block mt-1 transition">
                        {formData?.companyProfile?.socialLinks?.linkedin}
                      </a>
                    )
                  )}
                </div>

                <div>
                  <label className="text-md text-black font-black">Twitter/X</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData?.companyProfile?.socialLinks?.twitter || ''}
                      onChange={(e) => handleInputChange(e, 'social', 'twitter')}
                      className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244034]"
                      placeholder="Twitter URL"
                    />
                  ) : (
                    formData?.companyProfile?.socialLinks?.twitter && (
                      <a href={formData?.companyProfile?.socialLinks?.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 hover:underline text-sm block mt-1 transition">
                        {formData?.companyProfile?.socialLinks?.twitter}
                      </a>
                    )
                  )}
                </div>

                <div>
                  <label className="text-md font-black text-black">Facebook</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData?.companyProfile?.socialLinks?.facebook || ''}
                      onChange={(e) => handleInputChange(e, 'social', 'facebook')}
                      className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244034]"
                      placeholder="Facebook URL"
                    />
                  ) : (
                    formData?.companyProfile?.socialLinks?.facebook && (
                      <a href={formData?.companyProfile?.socialLinks?.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 hover:underline text-sm block mt-1 transition">
                        {formData?.companyProfile?.socialLinks?.facebook}
                      </a>
                    )
                  )}
                </div>
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

export default CompanyProfilePage;