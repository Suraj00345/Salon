import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public
import HomePage from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./pages/Service";
import ServiceDetails from "./pages/ServiceDetails";
import Staff from "./pages/Staff";

// Customer
import Booking from "./pages/Booking";
import BookingSummary from "./pages/BookingSummary";
import BookingSuccess from "./pages/BookingSuccess";
import BookingPayment from "./pages/BookingPayment";
import AppointmentDetails from "./components/appointments/AppointmentDetails";
import RescheduleAppointment from "./components/appointments/RescheduleAppointment";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Review from "./pages/Review";
import ApplyProfessional from "./pages/ApplyProfessional";
import StaffDashboard from "./pages/StaffDashboard"

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminServices from "./pages/admin/AdminServices";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminWorkingHours from "./pages/admin/AdminWorkingHours";
import AdminStaffApplications from "./pages/admin/AdminStaffApplications";

// Guards
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import StaffRoute from "./routes/StaffRoute";

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
        <Route path="/staff" element={<Staff/>}/>

        {/* ================= CUSTOMER ================= */}
        <Route element={<ProtectedRoute />}>
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking/summary" element={<BookingSummary />} />
          <Route path="/booking/payment/:appointmentId" element={<BookingPayment />}/>
          <Route path="/booking/success" element={<BookingSuccess />} />
          <Route path="/bookings/:id" element={<AppointmentDetails />} />
          <Route path="/booking/:id/reschedule"  element={<RescheduleAppointment />}/>
          <Route path="/appointments/:id/review" element={<Review />} />
          <Route path="/apply-professional" element={<ApplyProfessional />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* ================= STAFF ================= */}
        <Route element={<StaffRoute />}>
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
        </Route>

        {/* ================= ADMIN ================= */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/staff" element={<AdminStaff />} />
          <Route path="/admin/staff/applications" element={<AdminStaffApplications/>}/>
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
