import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Beranda from "./features/public/Beranda";
import Lowongan from "./features/user/Lowongan";
import DetailLowongan from "./features/user/DetailLowongan";
import Status from "./features/user/Status";
import Pengumuman from "./features/public/Pengumuman";
import Arsip from "./features/user/Arsip"; // 🚀 Sudah terimpor aman di sini bro
import UserProfile from "./features/user/Profile";
import AdminLayout from "./features/admin/AdminLayout";
import Dashboard from "./features/admin/Dashboard";
import JobsManage from "./features/admin/JobsManage";
import UsersManage from "./features/admin/UsersManage";
import ApplicationsList from "./features/admin/ApplicationsList";
import AdminApplicantDetail from "./features/admin/ApplicantDetail";
import AdminProfile from "./features/admin/Profile";
import PenyeleksiLayout from "./features/penyeleksi/PenyeleksiLayout";
import PenyeleksiDashboard from "./features/penyeleksi/Dashboard";
import AssignedJobs from "./features/penyeleksi/AssignedJobs";
import PenyeleksiApplicantDetail from "./features/penyeleksi/ApplicantDetail";
import ScrollToTop from "./components/layout/ScrollToTop";
import ToTheTop from "./components/layout/ToTheTop";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <ToTheTop />

      <Routes>
        <Route path="/" element={<Navigate to="/beranda" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
          path="/detail-lowongan/:id"
          element={
            <>
              <Navbar />
              <DetailLowongan />
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
        <Route
          path="/profil"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <>
                <Navbar />
                <UserProfile />
                <Footer />
              </>
            </ProtectedRoute>
          }
        />

        {/* ADMIN LAYOUT */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="lowongan" element={<JobsManage />} />
          <Route path="users" element={<UsersManage />} />
          <Route path="applications" element={<ApplicationsList />} />
          <Route
            path="applications/:jobId"
            element={<AdminApplicantDetail />}
          />
          <Route path="profil" element={<AdminProfile />} />
        </Route>

        {/* PENYELEKSI LAYOUT */}
        <Route
          path="/penyeleksi"
          element={
            <ProtectedRoute allowedRoles={["penyeleksi"]}>
              <PenyeleksiLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PenyeleksiDashboard />} />
          <Route path="jobs" element={<AssignedJobs />} />
          <Route path="jobs/:jobId" element={<PenyeleksiApplicantDetail />} />
          <Route path="profil" element={<AdminProfile />} />
        </Route>

        {/* FALLBACK ROUTE */}
        <Route path="*" element={<Navigate to="/beranda" replace />} />
      </Routes>
    </div>
  );
}

export default App;