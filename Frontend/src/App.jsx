import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public
import HomePage from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./pages/Service";
import ServiceDetails from "./pages/ServiceDetails";

// Customer
import Booking from "./pages/Booking";
import BookingSummary from "./pages/BookingSummary";
import BookingSuccess from "./pages/BookingSuccess";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminServices from "./pages/admin/AdminServices";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminWorkingHours from "./pages/admin/AdminWorkingHours";


// Guards
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

// Not Found
import NotFoundPage from "./pages/NotFoundPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetails />} />

        {/* ================= CUSTOMER ================= */}
        <Route element={<ProtectedRoute />}>
          <Route path="/booking" element={<Booking />} />
          <Route  path="/booking/payment/:appointmentId" element={<BookingPayment />} />
          <Route path="/booking/summary" element={<BookingSummary />} />
          <Route path="/booking/success" element={<BookingSuccess />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* ================= ADMIN ================= */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/staff" element={<AdminStaff />} />
          <Route path="/admin/working-hours" element={<AdminWorkingHours />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
