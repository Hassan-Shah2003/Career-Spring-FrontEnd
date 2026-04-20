// src/components/Logout.jsx
// import { useAuth } from "../context/AuthContext";
// import toast,{Toaster} from "react-hot-toast";
import { useAuth } from "./AuthContext";

const Logout = () => {
  const { user, signOutUser } = useAuth();
// const showToast = (message, type = "success") => {
//     if (type === "error") {
//       toast.error(message, { position: "top-center" });
//     } else {
//       toast.success(message, { position: "top-center" });
//     }
//   };
  const handleLogout = async () => {
    try {
      await signOutUser();
      // showToast("Logged out successfully!",);
    } catch (err) {
      alert(err.message);
    }
  };

  if (!user) return null; // show nothing if not logged in

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
    >
      Logout
    </button>
  );
};

export default Logout;
