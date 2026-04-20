import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import images from "../../../assets/images/images.png";
import { LoaderCircle, Menu, X } from 'lucide-react';
import { useAuth } from '../../Auth/AuthContext';
// import supaBase from '../../../services/supabaseClient';

const Navbar = ({ transparent }) => {
  const location = useLocation();
  const [open, setopen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user, signOutUser } = useAuth();
  // console.log(user,"user.............navbar");
  // console.log(user,".......user");
  
  const [postLoading, setPostLoading] = useState(false);
  const isAboutPage = location.pathname === "/about";
  const isContactPage = location.pathname === "/contactus";
  const [scrolled, setScrolled] = useState(false);
  const [openProfileDropdown, setOpenProfileDropdown] = useState(false)
  const role = user?.role;
  const navigate = useNavigate();

const handleLogout = async () => {
  try {
    await signOutUser(); // AuthProvider me already toast handle hota
    setShowLogoutModal(false);
    setopen(false);
    navigate("/login"); // redirect karna hai to yaha
  } catch (err) {
    console.error("Logout failed:", err.message);
    toast.error("Logout failed. Please try again.");
  }
};

  const handlePostJobClick = () => {
    setPostLoading(true);
      navigate("/post-job")
      setPostLoading(false);
  }

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Menu items based on role and login status
  const getMenuItems = () => {
  if (!user) {
    // Logged-out users: only public menu
    return [
      { name: "Home", path: "/" },
      { name: "Find Jobs", path: "/jobs" },
      { name: "About", path: "/about" },
      { name: "Contact", path: "/contactus" },
      { name: "Blogs", path: "/blogs" },
    ];
  }

  // Logged-in users
  if (role === "job Seeker") {
    return [
      { name: "Home", path: "/" },
      { name: "Find Jobs", path: "/jobs" },
      { name: "About", path: "/about" },
      { name: "Contact", path: "/contactus" },
      { name: "Blogs", path: "/blogs" },
      { name: "Applied Jobs", path: "/applied" }, // only seeker
    ];
  } else if (role === "company") {
    return [
      { name: "My Jobs", path: "/myjobs" },
      { name: "View Applications", path: "/viewapplications" },
    ];
  }

  return [];
};

  // Side menu items for mobile
  const getSideMenuItems = () => {
  if (!user) {
    return [
      { name: "Home", path: "/" },
      { name: "Find Jobs", path: "/jobs" },
      { name: "About", path: "/about" },
      { name: "Blogs", path: "/blogs" },
      { name: "Contact", path: "/contactus" },
      { name: "Login", path: "/login" }, // show login
    ];
  }

  if (role === "job Seeker") {
    return [
      { name: "Home", path: "/" },
      { name: "Find Jobs", path: "/jobs" },
      { name: "About", path: "/about" },
      { name: "Blogs", path: "/blogs" },
      { name: "Contact", path: "/contactus" },
      { name: "Applied Jobs", path: "/applied" },
    ];
  } else if (role === "company") {
    return [
      { name: "Post Job", path: "/post-job" },
      { name: "My Jobs", path: "/myjobs" },
      { name: "View Applications", path: "/viewapplications" },
    ];
  }

  return [];
};


  const menuItems = getMenuItems();
  const sideMenuItems = getSideMenuItems();

  return (
    <nav
      style={{
        backgroundColor:
          (isAboutPage || isContactPage || transparent) && !scrolled
            ? "transparent"
            : "#244034",
      }}
      className={`flex justify-between items-center h-20 fixed top-0 left-0 w-full px-4 z-50 transition-all duration-500 ${(isAboutPage || isContactPage || transparent) && !scrolled
        ? ""
        : ""
        }`}
    >
      {/* LEFT: Logo + Menu Icon (for mobile) */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setopen(!open)}
          className="md:hidden text-white focus:outline-none"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>

        <Link to="/">
          <img src={images} className="w-auto h-14 md:m-2" alt="Logo" />
        </Link>
      </div>

      {/* CENTER: Desktop Menu */}
      <div className="hidden md:flex items-center justify-center flex-1">
        <ul className="flex gap-2 lg:gap-7">
          {menuItems.map((item, i) => {
            const isBlogDetail = location.pathname.startsWith("/blog/");
            return (
              <li key={i}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `text-base font-bold rounded-2xl transition duration-300 p-3 cursor-pointer ${isActive || (isBlogDetail && item.path === "/blogs")
                      ? "bg-[#c5f542] text-black"
                      : "text-white hover:bg-[#c5f542] hover:text-black"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      {/* RIGHT: Profile avatar (always visible) */}
      <div className="flex items-center gap-3">
        {/* Post Job button - only for logged in companies */}
        {user && role === "company" && (
          <button
            onClick={handlePostJobClick}
            disabled={postLoading}
            className={`hidden md:flex text-base font-bold rounded-2xl transition duration-300 p-3 items-center justify-center gap-2 ${postLoading
              ? "bg-[#c5f542]/70 text-gray-700 cursor-wait"
              : "bg-[#c5f542] hover:text-white cursor-pointer"
              }`}
          >
            {postLoading ? (
              <>
                <LoaderCircle className="animate-spin" size={20} />
                <span>Loading...</span>
              </>
            ) : (
              "Post Job"
            )}
          </button>
        )}

        {user ? (
          <div className="relative">
            {/* Profile button */}
            <button
              className="profile-button cursor-pointer"
              onClick={() => setOpenProfileDropdown(!openProfileDropdown)}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#c5f542] flex items-center justify-center bg-blue-600 text-white font-bold uppercase">
                {user?.profile?.profilePhoto && user?.profile?.profilePhoto.startsWith("http") ? (
                  <img
                    src={`${user?.profile?.profilePhoto}`}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm">
                    {user?.fullName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "U"}
                  </span>
                )}
              </div>
            </button>

            {/* Dropdown + Overlay */}
            {openProfileDropdown && (
              <>
                {/* invisible overlay behind dropdown */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpenProfileDropdown(false)}
                />

                {/* dropdown itself */}
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-4 z-50">
                  <p className="font-semibold">{user?.fullName || user?.email}</p>
                  {/* <p className="text-sm text-gray-500">{user?.email}</p> */}
                  {/* <p className="text-xs text-gray-400 capitalize">{role}</p> */}
                  <Link
                    to="/profile"
                    className="block mt-2 px-3 py-2 text-[#244034] rounded-lg transition-all duration-300 hover:bg-[#c5f542] hover:text-black font-semibold"
                    onClick={() => setOpenProfileDropdown(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mt-2 cursor-pointer w-full bg-red-500 text-white rounded-lg py-1 hover:bg-red-600 transition duration-300"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          // Login button for logged out users
          <Link
            to="/login"
            className="text-base font-bold bg-[#c5f542] hover:text-white rounded-2xl transition duration-300 p-3"
          >
            Login
          </Link>
        )}
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {open && (
        <>
          {/* Overlay behind the mobile menu */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setopen(false)}
          />

          {/* Mobile menu */}
          <div className="absolute top-20 left-0 w-full bg-white shadow-md md:hidden z-50">
            <ul className="flex flex-col items-center space-y-4 py-4 text-gray-800 font-semibold">
              {sideMenuItems.map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.path}
                    className="text-base font-bold hover:bg-[#c5f542] rounded-2xl transition duration-300 p-3"
                    onClick={() => setopen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;