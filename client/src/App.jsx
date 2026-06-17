import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AirportTransfersPage from "./pages/AirportTransfersPage.jsx";
import BookNowPage from "./pages/BookNowPage.jsx";
import BookingConfirmationPage from "./pages/BookingConfirmationPage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import CarsPage from "./pages/CarsPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import DriverLoginPage from "./pages/DriverLoginPage.jsx";
import FindRidesPage from "./pages/FindRidesPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ListVehiclePage from "./pages/ListVehiclePage.jsx";
import PopularRoutesPage from "./pages/PopularRoutesPage.jsx";
import PricingPage from "./pages/PricingPage.jsx";
import RideDetailsPage from "./pages/RideDetailsPage.jsx";
import SelfDrivePage from "./pages/SelfDrivePage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import TempleTripsPage from "./pages/TempleTripsPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/book-now" element={<BookNowPage />} />
        <Route path="/find-rides" element={<FindRidesPage />} />
        <Route path="/cars" element={<CarsPage />} />
        <Route path="/cars-with-driver" element={<CarsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/booking-confirmation/:id" element={<BookingConfirmationPage />} />
        <Route path="/rides/:id" element={<RideDetailsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/self-drive" element={<SelfDrivePage />} />
        <Route path="/temple-trips" element={<TempleTripsPage />} />
        <Route path="/airport-transfers" element={<AirportTransfersPage />} />
        <Route path="/popular-routes" element={<PopularRoutesPage />} />
        <Route path="/list-your-vehicle" element={<ListVehiclePage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/driver/login" element={<DriverLoginPage />} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agent/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
