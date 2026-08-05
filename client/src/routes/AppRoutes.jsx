import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import CompleteProfile from "../pages/Auth/CompleteProfile";
import Register from "../pages/Auth/Register";
import Services from "../pages/Services/Services";
import ServiceDetails from "../pages/Services/ServiceDetails";
import Booking from "../pages/Booking/Booking";
import Checkout from "../pages/Booking/Checkout";
import BookingSuccess from "../pages/Booking/BookingSuccess";
import BookingHistory from "../pages/Booking/BookingHistory";
import Profile from "../pages/Profile/Profile";
import EditProfile from "../pages/Profile/EditProfile";
import Favorites from "../pages/Profile/Favorites";
import Notifications from "../pages/Profile/Notifications";
import PaymentMethods from "../pages/Profile/PaymentMethods";
import CustomerDashboard from "../pages/Dashboard/CustomerDashboard";
import ProviderDashboard from "../pages/Dashboard/ProviderDashboard";
import ProviderServices from "../pages/Dashboard/ProviderServices";
import ProviderJobs from "../pages/Dashboard/ProviderJobs";
import Availability from "../pages/Dashboard/Availability";
import Earnings from "../pages/Dashboard/Earnings";
import Reviews from "../pages/Dashboard/Reviews";
import Subscription from "../pages/Dashboard/Subscription";
import ProviderSettings from "../pages/Dashboard/ProviderSettings";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import ManageUsers from "../pages/Dashboard/ManageUsers";
import ManageProviders from "../pages/Dashboard/ManageProviders";
import AdminBookings from "../pages/Dashboard/AdminBookings";
import Payments from "../pages/Dashboard/Payments";
import Reports from "../pages/Dashboard/Reports";
import Analytics from "../pages/Dashboard/Analytics";
import AdminServices from "../pages/Dashboard/AdminServices";
import ManageCoupons from "../pages/Dashboard/ManageCoupons";
import AdminSettings from "../pages/Dashboard/AdminSettings";
import Categories from "../pages/Categories/Categories";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import ProviderProfile from "../pages/Provider/ProviderProfile";
import NotFound from "../pages/NotFound/NotFound";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/register" element={<Register />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetails />} />
            <Route path="/providers/:providerId" element={<ProviderProfile />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/booking/success" element={<BookingSuccess />} />
            <Route path="/bookings" element={<BookingHistory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/payment-methods" element={<PaymentMethods />} />
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/provider/dashboard" element={<ProviderDashboard />} />
            <Route path="/provider/services" element={<ProviderServices />} />
            <Route path="/provider/jobs" element={<ProviderJobs />} />
            <Route path="/provider/availability" element={<Availability />} />
            <Route path="/provider/earnings" element={<Earnings />} />
            <Route path="/provider/reviews" element={<Reviews />} />
            <Route path="/provider/subscription" element={<Subscription />} />
            <Route path="/provider/settings" element={<ProviderSettings />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/providers" element={<ManageProviders />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/payments" element={<Payments />} />
            <Route path="/admin/coupons" element={<ManageCoupons />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/services" element={<AdminServices />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}