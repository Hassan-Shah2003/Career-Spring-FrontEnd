import { useContext, createContext, useState, useEffect } from "react";
// import supaBase from "../../services/supabaseClient";
import toast from "react-hot-toast";
import API from "../../services/api/api";
import { useNavigate } from "react-router-dom";

const authContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const showToast = (message, type = "success") => {
    if (type === "error") {
      toast.error(message, { position: "top-center" });
    } else {
      toast.success(message, { position: "top-center" });
    }
  };
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res?.data?.data)
      } catch (error) {
        setUser(null)
      }
    }
    getUser();
  }, [])
  // Sign up new user
  const SignUpUser = async (formData) => {
    try {
      const res = await API.post("/auth/register", formData);
      return res.data;

    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      throw error;
    }
  };

  // // Sign in existing user
  const signInUser = async ({ email, password }) => {
    try {

      const res=await API.post("/auth/login", { email, password }); 
        const { user, token } = res.data;
        localStorage.setItem("token", token);
      setUser(user)
      toast.success("login successfully");
      if(user?.role==="company"){
        navigate("/myjobs")  
      } else {
        navigate("/")
      }
      if (user) {
        localStorage.setItem("user", user);
      }
      return res.data
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "login Failed")
      throw error;
    }
  };

  // // Sign out user
  const signOutUser = async () => {
    try {
      await API.post("/auth/logout", {}, { withCredentials: true })
      setUser(null);
      showToast("Logout successful!");
      navigate("/")
    } catch (error) {
      showToast("Logout failed. Please try again.", "error");
      // console.log(error);
    }
  };

  const resendEmailVerification = async (email) => {
  try {
    const res = await API.post("/auth/resend-verification", { email });
    return res.data.success;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to resend email");
    return false;
  }
};


  return (
    <authContext.Provider value={{
      user,
      // loading,
      resendEmailVerification,
      SignUpUser,
      signInUser,
      signOutUser,
      // setUser
    }}>
      {children}
    </authContext.Provider>
  );
};

// Custom hook for consuming auth context
export const useAuth = () => useContext(authContext);