import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AdminLayout from "./features/admin/layout/AdminLayout";
import Beranda from "./features/home/pages/Beranda";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Lowongan from "./features/jobs/pages/Lowongan";
import Status from "./features/applications/pages/Status";
import Pengumuman from "./features/announcements/pages/Pengumuman";
import Arsip from "./features/archives/pages/Arsip";
import Dashboard from "./features/admin/dashboard/pages/Dashboard";
import JobsManagement from "./features/admin/jobs/pages/JobsManagement";
import UsersManagement from "./features/admin/users/pages/UsersManagement";
import ApplicationList from "./features/admin/applications/pages/ApplicationList";
import ApplicantDetail from "./features/admin/applications/pages/ApplicantDetail";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Routes>
        {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/beranda" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public Routes dengan Navbar + Footer */}
        <Route
          path="/beranda"
          element={
            <>
              <Navbar />
              <Beranda />
              <Footer />
            </>
          }
        />
        <Route
          path="/lowongan"
          element={
            <>
              <Navbar />
              <Lowongan />
              <Footer />
            </>
          }
        />
        <Route
          path="/status"
          element={
            <>
              <Navbar />
              <Status />
              <Footer />
            </>
          }
        />
        <Route
          path="/pengumuman"
          element={
            <>
              <Navbar />
              <Pengumuman />
              <Footer />
            </>
          }
        />
        <Route
          path="/arsip"
          element={
            <>
              <Navbar />
              <Arsip />
              <Footer />
            </>
          }
        />

        {/* Admin Routes dengan AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="lowongan" element={<JobsManagement />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="applications" element={<ApplicationList />} />
          <Route path="applications/:jobId" element={<ApplicantDetail />} />
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<Navigate to="/beranda" replace />} />
      </Routes>
    </div>
  );
}

export default App;
