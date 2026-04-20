import { Toaster } from "react-hot-toast";
import BlogsDetailedPage from "./pages/Blogs/BlogsDetailedPage";
import PostJob from './components/jobs/postjob/PostJob';
import Blogs from "./pages/Blogs/Blogs";
import FindJobsPage from './components/jobs/Find Jobs/JobsFindPage';
import SignupForm from './components/Auth/SignupForm';
import Home from "./pages/Home/Home";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import LogOut from "./components/Auth/LogOut";
import { useAuth } from "./components/Auth/AuthContext";
import About from "./pages/About/About";
import ContactUs from "./pages/Contact/ContactUs";
import ApplyForm from "./components/jobs/Find Jobs/ApplyForm";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import EmailConfirmationPage from "../src/components/Auth/EmailConfirmationPage";
import BigJobLoader from "./components/common/loader/BigJobLoader";
import JobAppliedPage from "./pages/JobAppliedPage";
import MyJobs from "./pages/MyJobs";
import ViewApplications from "./pages/ViewApplications";
// import MyJobDetailedPage from "./pages/MyJobDetailedPage/MyJobDetailedPage";
// General Private Route
// const { user } = useAuth();
// console.log(user);

const PrivateRoute = ({ user, loading, allowedRoles = [], children }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BigJobLoader />
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // redirect based on role
    return <Navigate to={user?.role === 'company' ? "/myjobs" : "/"} replace />;
  }

  return children;
};

// Route restricted to seekers only, redirects companies
const SeekerRoute = ({ user, loading, children }) => {
  return (
    <PrivateRoute user={user} loading={loading} allowedRoles={['job Seeker']}>
      {children}
    </PrivateRoute>
  );
};
const CompanyRoute = ({ user, loading, children }) => {
  return (
    <PrivateRoute user={user} loading={loading} allowedRoles={['company']}>
      {children}
    </PrivateRoute>
  );
};
const PublicRoute = ({ user, loading, children }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BigJobLoader />
      </div>
    );
  }
  // If company tries to access public pages → redirect /myjobs
  if (user && user?.role === "company") {
    return <Navigate to="/myjobs" replace />;
  }
  return children;
};

const App = () => {
  const { user, loading } = useAuth();
  // console.log(user, "user,,,,,,,,,,,,,,,,,,,");


  return (
    <>
      <Routes>
        {/* PUBLIC PAGES (Home/About/Blogs/Contact/Find Jobs) */}
        <Route path="/" element={<PublicRoute user={user} loading={loading}><Home /></PublicRoute>} />
        <Route path="/about" element={<PublicRoute user={user} loading={loading}><About /></PublicRoute>} />
        <Route path="/contactus" element={<PublicRoute user={user} loading={loading}><ContactUs /></PublicRoute>} />
        <Route path="/blogs" element={<PublicRoute user={user} loading={loading}><Blogs /></PublicRoute>} />
        <Route path="/blog/:id" element={<PublicRoute user={user} loading={loading}><BlogsDetailedPage /></PublicRoute>} />
        <Route path="/jobs" element={<PublicRoute user={user} loading={loading}><FindJobsPage /></PublicRoute>} />
        <Route path="/jobs/:id" element={<PublicRoute user={user} loading={loading}><FindJobsPage /></PublicRoute>} />

        {/* SEEKER-ONLY PAGES */}
        <Route path="/apply-form/:jobId" element={<SeekerRoute user={user} loading={loading}><ApplyForm /></SeekerRoute>} />
        <Route path="/applied" element={<SeekerRoute user={user} loading={loading}><JobAppliedPage /></SeekerRoute>} />

        {/* COMPANY-ONLY PAGES */}
        <Route path="/post-job" element={<CompanyRoute user={user} loading={loading}><PostJob /></CompanyRoute>} />
        <Route path="/myjobs" element={<CompanyRoute user={user} loading={loading}><MyJobs /></CompanyRoute>} />
        <Route path="/viewapplications" element={<CompanyRoute user={user} loading={loading}><ViewApplications /></CompanyRoute>} />
        {/* <Route path="/myjobdetail/:id" element={<CompanyRoute user={user} loading={loading}><MyJobDetailedPage /></CompanyRoute>} /> */}

        {/* PROFILE & LOGOUT */}
        <Route path="/profile" element={<PrivateRoute user={user} loading={loading}><ProfilePage /></PrivateRoute>} />
        <Route path="/logout" element={
          <PrivateRoute user={user} loading={loading}>
            <LogOut />
          </PrivateRoute>
        } />

        {/* AUTH */}
        <Route path="/login" element={user && user.emailVerified ? <Navigate to={user.role === 'company' ? "/myjobs" : "/"} replace /> : <Login />} />
        <Route path="/signup" element={
          user
            ? user.emailVerified
              ? <Navigate to={user.role === 'company' ? "/myjobs" : "/"} replace />
              : <Navigate to="/confirm-email" replace />
            : <SignupForm />
        } />
        <Route path="/confirm-email" element={<EmailConfirmationPage />} />
        <Route
          path="*"
          element={
            user
              ? <Navigate to={user.role === "company" ? "/myjobs" : "/"} replace />
              : <Navigate to="/" replace />
          }
        />
      </Routes>


      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default App;
