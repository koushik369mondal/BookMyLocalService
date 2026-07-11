import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import VerifyOtp from "../pages/Auth/VerifyOtp";
import Register from "../pages/Auth/Register";
import Services from "../pages/Services/Services";
import ServiceDetails from "../pages/Services/ServiceDetails";
import Booking from "../pages/Booking/Booking";
import Checkout from "../pages/Booking/Checkout";
import BookingSuccess from "../pages/Booking/BookingSuccess";
import BookingHistory from "../pages/Booking/BookingHistory";
import Profile from "../pages/Profile/Profile";
import EditProfile from "../pages/Profile/EditProfile";
import CustomerDashboard from "../pages/Dashboard/CustomerDashboard";
import ProviderDashboard from "../pages/Dashboard/ProviderDashboard";
import Availability from "../pages/Dashboard/Availability";
import Earnings from "../pages/Dashboard/Earnings";
import Reviews from "../pages/Dashboard/Reviews";
import Subscription from "../pages/Dashboard/Subscription";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import ManageUsers from "../pages/Dashboard/ManageUsers";
import ManageProviders from "../pages/Dashboard/ManageProviders";
import Payments from "../pages/Dashboard/Payments";
import Reports from "../pages/Dashboard/Reports";
import Analytics from "../pages/Dashboard/Analytics";
import Categories from "../pages/Categories/Categories";
import NotFound from "../pages/NotFound/NotFound";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/register" element={<Register />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetails />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/booking/success" element={<BookingSuccess />} />
            <Route path="/bookings" element={<BookingHistory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/provider/dashboard" element={<ProviderDashboard />} />
            <Route path="/provider/availability" element={<Availability />} />
            <Route path="/provider/earnings" element={<Earnings />} />
            <Route path="/provider/reviews" element={<Reviews />} />
            <Route path="/provider/subscription" element={<Subscription />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/providers" element={<ManageProviders />} />
            <Route path="/admin/payments" element={<Payments />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}