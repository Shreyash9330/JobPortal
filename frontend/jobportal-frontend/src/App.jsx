import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RegisterChoice from "./pages/auth/RegisterChoice";
import JobSeekerRegister from "./pages/auth/JobSeekerRegister";
import EmployerRegister from "./pages/auth/EmployerRegister";

import Home from "./pages/Home";
import JobList from "./pages/jobseeker/Joblist";
import MyApplications from "./pages/jobseeker/MyApplications";
import JobSeekerDashboard from "./pages/jobseeker/JobSeekerDashboard";

import AddJob from "./pages/employer/AddJob";
import EditJob from "./pages/employer/EditJob";
import MyJobs from "./pages/employer/MyJobs";
import ViewJob from "./pages/employer/ViewJob";
import EmployerApplications from "./pages/employer/EmployerApplications";
import CompanyProfile from "./pages/employer/CompanyProfile";
import EditCompanyProfile from "./pages/employer/EditCompanyProfile";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import ViewApplications from "./pages/employer/ViewApplications";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminApplications from "./pages/admin/AdminApplications";

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}

        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/register-choice" element={<RegisterChoice />} />

        <Route path="/register/jobseeker" element={<JobSeekerRegister />} />

        <Route path="/register/employer" element={<EmployerRegister />} />

        <Route
          path="/jobs"
          element={
            <PublicLayout>
              <JobList />
            </PublicLayout>
          }
        />

        {/* ================= JOB SEEKER ROUTES ================= */}

        <Route
          path="/jobseeker"
          element={
            <ProtectedRoute role="JOBSEEKER">
              <JobSeekerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute role="JOBSEEKER">
              <MyApplications />
            </ProtectedRoute>
          }
        />

        {/* ================= EMPLOYER ROUTES ================= */}

        <Route
          path="/employer/dashboard"
          element={
            <ProtectedRoute role="EMPLOYER">
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/add-job"
          element={
            <ProtectedRoute role={["EMPLOYER", "ADMIN"]}>
              <AddJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/my-jobs"
          element={
            <ProtectedRoute role="EMPLOYER">
              <MyJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/applications"
          element={
            <ProtectedRoute role="EMPLOYER">
              <EmployerApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/profile"
          element={
            <ProtectedRoute role="EMPLOYER">
              <CompanyProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/edit-profile"
          element={
            <ProtectedRoute role="EMPLOYER">
              <EditCompanyProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/edit-job/:id"
          element={
            <ProtectedRoute role="EMPLOYER">
              <EditJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/view-job/:id"
          element={
            <ProtectedRoute role="EMPLOYER">
              <ViewJob />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ROUTES ================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/applications"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminApplications />
            </ProtectedRoute>
          }
        />

        {/* ================= LEGACY / SHARED ROUTES ================= */}

        <Route
          path="/add-job"
          element={
            <ProtectedRoute role="EMPLOYER">
              <AddJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view-applications"
          element={
            <ProtectedRoute role={["EMPLOYER", "ADMIN"]}>
              <ViewApplications />
            </ProtectedRoute>
          }
        />

        {/* ================= FALLBACK ================= */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
