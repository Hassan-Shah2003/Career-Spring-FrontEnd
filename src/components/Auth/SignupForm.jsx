import React, { useState } from "react";
import images from "../../assets/images/images.png";
import SignupSchema from "../../services/utils/schemas/SignUpSchema";
import { useAuth } from "./AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const SignupForm = () => {
    const { SignUpUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        role: "",
        companyName: "",
        phoneNumber: "",
        location: "",
        about: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const validateField = async (name, value) => {
        try {
            const currentFormData = { ...formData, [name]: value };
            await SignupSchema.validateAt(name, currentFormData);
            setErrors(prev => ({ ...prev, [name]: undefined }));
        } catch (err) {
            setErrors(prev => ({ ...prev, [name]: err.message }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            setErrors({});
            await SignupSchema.validate(formData, { abortEarly: false });
            const res = await SignUpUser(formData);

            if (res?.success) {
                toast.success("Signup successful! Please verify your email.");
                setFormData({
                    fullName: "",
                    email: "",
                    password: "",
                    role: "",
                    companyName: "",
                    phoneNumber: "",
                    location: "",
                    about: "",
                });
                navigate("/confirm-email", { state: {email:formData.email} });
            } else {
                if (res?.message?.includes("registered")) {
                    toast.error("This email is already registered. Please log in instead.");
                } else {
                    toast.error( res.message || "signup failed");
                }
            }
        } catch (validationError) {
            if (validationError.inner) {
                const formErrors = {};
                validationError.inner.forEach(err => {
                    formErrors[err.path] = err.message;
                });
                setErrors(formErrors);
                toast.error("Please fix the form errors");
            } else {
                toast.error(validationError.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#244034] via-[#2f5c4b] to-[#1b2d26] px-4">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md text-white relative border border-white/20">
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="w-25 h-25 bg-gradient-to-br from-mint-300 to-white rounded-full flex items-center justify-center animate-pulse shadow-lg">
                            <img src={images} alt="Logo" />
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <input
                            name="fullName"
                            placeholder="Full Name"
                            onChange={handleChange}
                            value={formData.fullName}
                            className="p-3 rounded-md bg-white/20 border border-white/30 placeholder-white text-white focus:outline-none focus:ring-2 w-full focus:ring-mint-300"
                        />
                        {errors.fullName && <p className="text-red-500 text-sm mt-2">{errors.fullName}</p>}
                    </div>

                    <div className="mb-2">
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="p-3 rounded-md bg-white/20 border border-white/30 placeholder-white text-white focus:outline-none focus:ring-2 w-full focus:ring-mint-300"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
                    </div>

                    <div className="mb-4 relative w-full">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            onChange={handleChange}
                            value={formData.password}
                            placeholder="Password"
                            className="p-3 pr-10 rounded-md bg-white/20 border border-white/30 placeholder-white text-white focus:outline-none focus:ring-2 w-full focus:ring-mint-300"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                        {errors.password && <p className="text-red-500 mt-2 text-sm">{errors.password}</p>}
                    </div>

                    <div className="mb-2">
                        <select
                            name="role"
                            onChange={handleChange}
                            value={formData.role}
                            className="p-3 rounded-md bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-mint-300 w-full"
                        >
                            <option value="" className="text-gray-900">Select A Role</option>
                            <option value="job Seeker" className="text-gray-900">Job Seeker</option>
                            <option value="company" className="text-gray-900">Company / Recruiter</option>
                        </select>
                        {errors.role && <p className="text-red-500 text-sm mt-2">{errors.role}</p>}
                    </div>

                    <div className="mb-2">
                        {formData.role === "company" && (
                            <input
                                name="companyName"
                                onChange={handleChange}
                                value={formData.companyName}
                                placeholder="Company Name"
                                className="p-3 rounded-md bg-white/20 border border-white/30 placeholder-white text-white focus:outline-none focus:ring-2 w-full focus:ring-mint-300"
                            />
                        )}
                        {errors.companyName && <p className="text-red-500 mt-2 text-sm">{errors.companyName}</p>}
                    </div>

                    <div className="mb-2">
                        <input
                            name="phoneNumber"
                            onChange={handleChange}
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            className="p-3 rounded-md bg-white/20 border border-white/30 placeholder-white text-white focus:outline-none focus:ring-2 w-full focus:ring-mint-300"
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-2">{errors.phone}</p>}
                    </div>

                    <div className="mb-2">
                        <input
                            name="location"
                            onChange={handleChange}
                            value={formData.location}
                            placeholder="City / Location"
                            className="p-3 rounded-md bg-white/20 border border-white/30 placeholder-white text-white focus:outline-none focus:ring-2 w-full focus:ring-mint-300"
                        />
                        {errors.location && <p className="text-red-500 text-sm mt-2">{errors.location}</p>}
                    </div>

                    <div className="mb-2">
                        <textarea
                            name="about"
                            onChange={handleChange}
                            value={formData.about}
                            placeholder="About yourself / company"
                            className="p-3 w-full rounded-md bg-white/20 border border-white/30 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-mint-300"
                        />
                        {errors.about && <p className="text-red-500 text-sm mt-2">{errors.about}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 bg-gradient-to-r from-mint-300 to-white text-[#244034] font-semibold rounded-md p-3 hover:scale-105 transition-transform shadow-lg flex cursor-pointer items-center justify-center gap-2"
                    >
                        {loading && (
                            <div className="w-4 h-4 border-2 border-[#244034] border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>

                    <div className="text-center pt-2">
                        <Link to={"/login"} className="text-[#98ffcc] font-semibold hover:underline">
                            Already Have Account?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupForm;