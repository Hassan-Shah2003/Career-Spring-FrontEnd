import React from "react";
import { useAuth } from "../../components/Auth/AuthContext";
import SeekerProfile from "./SeekerProfile";
// import CompanyProfile from "./CompanyProfile";
import CompanyProfilePage from "./CompanyProfilePage";

const ProfilePage = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // 🔥 role normalize karo (VERY IMPORTANT)
  const role = user?.role

  // 🔥 condition
  if (role === "company") {
    return <CompanyProfilePage />;
  }

  return <SeekerProfile />;
};

export default ProfilePage;