import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../../services/api/api";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { ArrowLeftCircle } from 'lucide-react';

const EmailConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resendEmailVerification } = useAuth();
  const [resendLoading, setResendLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const locationState = location?.state;
  const userEmail = locationState?.email;

  const handleResendEmail = async () => {
    if (!userEmail) {
      toast.error("No email found to resend verification");
      return;
    }

    setResendLoading(true);
    try {
      const success = await resendEmailVerification(userEmail);
      if (success) {
        toast.success("Verification email resent!");
      } else {
        toast.error("Failed to resend email!");
      }
    } catch (error) {
      toast.error("Failed to resend email!");
    } finally {
      setResendLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/signup", { replace: true });
  };

useEffect(() => {
  const token = searchParams.get("token");
  
  if (token) {
    // Backend ko call karo verify karne ke liye
    API.get(`/auth/confirm-email?token=${token}`)
      .then(() => {
        // toast.success("Email verified! Please login. 🎉");
        setTimeout(() => {
          navigate("/login?verified=true", { replace: true });
        }, 1500);
      })
      .catch(() => {
        toast.error("Invalid or expired link!");
      });
  }
}, []);
  return (
    <>
      <div
        className="absolute top-4 left-4 cursor-pointer text-[#244034] hover:scale-110 transition"
        onClick={handleBack}
      >
        <ArrowLeftCircle size={32} />
      </div>
      <div className="min-h-screen bg-gradient-to-br from-[#244034]/10 to-[#244034]/5 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-[#244034] p-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Confirm Your Email</h1>
            <p className="text-white/80 mt-2">We've sent a confirmation link to your email</p>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-[#244034]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-[#244034]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Check Your Inbox</h2>
              <p className="text-gray-600 mt-2">
                We've sent a confirmation email to <span className='font-black'>{userEmail || "your email"}</span>
              </p>
            </div>

            <div className="bg-[#244034]/5 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700 text-center">
                Click the confirmation link in the email to verify your account and complete your registration.
              </p>
            </div>

            <div className="space-y-4">
              <button 
                className={`w-full items-center flex justify-center gap-2 bg-[#244034] hover:bg-[#1a3328] text-white font-medium py-3 px-4 rounded-lg transition duration-200 ${
                  resendLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                }`} 
                disabled={resendLoading}
                onClick={handleResendEmail}
              >
                {resendLoading ? "Resending..." : "Resend Confirmation Email"}
                {resendLoading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Didn't receive the email? Check your spam folder or
                <span className="text-[#244034] font-medium ml-1">contact support</span>.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 py-4 px-6 text-center">
            <p className="text-xs text-gray-500">
              © 2024 Career Spring. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailConfirmationPage;