import { useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import { Link, useActionData, useNavigate } from "react-router-dom";
import images from "../../assets/images/images.png";
import toast, { Toaster } from "react-hot-toast";
import { loginSchema } from "../../utils/schemas/LoginSchema"
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
const Login = () => {
  const { signInUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const showToast = (message, type = "success") => {
    if (type === "error") {
      toast.error(message, { position: "top-center" });
    } else {
      toast.success(message, { position: "top-center" });
    }
  };
  const [searchParams] = useSearchParams();

useEffect(() => {
  if (searchParams.get("verified") === "true") {
    toast.success("Email verified successfully! Please login now. 🎉", {
      position: "top-center",
    });
  }
}, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      setErrors({})
      await loginSchema.validate({ email, password }, { abortEarly: false });
      const result = await signInUser({ email, password });
      console.log(result, "result");

      if (!result) return;
      // await signInUser({email, password});
      // showToast("Login successful!", "success");
      // setTimeout(() => {
      //   toast.dismiss()
      //   // navigate("/");
      // }, 1000);
    } catch (err) {
      if (err.name === "ValidationError") {
        const fieldErrors = {};
        err.inner.forEach((error) => {
          fieldErrors[error.path] = error.message
        });
        setErrors(fieldErrors);
        showToast("Please fix the highlighted errors", "error");
      } else {
        // showToast(err.message, "error");
      }
    } finally {
      setLoading(false)
    }
  };

  return (
    <>
      {/* <Toaster position="top-center" reverseOrder={false} /> */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1b2b26] via-[#244034] to-[#2e5b49] px-4">
        <style>{`
        @keyframes logoGlow {
          0%, 100% { box-shadow: 0 0 25px rgba(0,255,200,0.4); }
          50% { box-shadow: 0 0 45px rgba(0,255,200,0.8); }
        }
        @keyframes wCombo {
          0%, 100% { transform: translateY(0); text-shadow: 0 0 5px rgba(0,255,200,0.5); opacity: 0.9; }
          25% { transform: translateY(-3px); text-shadow: 0 0 10px rgba(0,255,200,0.7); }
          50% { transform: translateY(0); text-shadow: 0 0 20px rgba(0,255,200,1); }
          75% { transform: translateY(3px); text-shadow: 0 0 10px rgba(0,255,200,0.7); }
        }
      `}</style>

        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md text-white border border-white/20">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-25 h-25 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#98ffcc] to-white shadow-[0_0_30px_rgba(0,255,200,0.5)] animate-[logoGlow_3s_ease-in-out_infinite]">
              <span className="text-2xl font-bold animate-[wCombo_4s_ease-in-out_infinite] text-[#244034]">
                <img src={images} alt="Logo" className="" />
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-center mb-6 text-white/90">Login to Your Account</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              type="email"
              placeholder="Email"
              className="p-3 rounded-md bg-white/20 border border-white/30 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-[#98ffcc]"
            />
            {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
            <div className="relative">
              <input
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                }}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-3 pr-10 rounded-md bg-white/20 border border-white/30 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-[#98ffcc]"
              />
              {/* Eye toggle button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`mt-4 bg-gradient-to-r from-mint-300 to-white text-[#244034] font-semibold rounded-md p-3 hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2 cursor-pointer ${loading
                ? "opacity-60 cursor-not-allowed pointer-events-none"
                : ""
                }`}
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-[#244034] border-t-transparent rounded-full animate-spin"></div>
              )}
              {loading ? "loging..." : "Login"}

            </button>
          </form>

          {/* Create Account Link */}
          <p className="mt-4 text-center text-white/80">
            Don't have an account?{" "}
            <Link
              to="/Signup"
              className="text-[#98ffcc] font-semibold hover:underline"
            >
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
