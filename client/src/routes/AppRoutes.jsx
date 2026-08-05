import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Services from "../pages/Services/Services";
import ServiceDetails from "../pages/Services/ServiceDetails";
import AppLoader from "../components/ui/AppLoader";

// Lazy loaded pages
const CompleteProfile = lazy(() => import("../pages/Auth/CompleteProfile"));
const Categories = lazy(() => import("../pages/Categories/Categories"));
const About = lazy(() => import("../pages/About/About"));
const Contact = lazy(() => import("../pages/Contact/Contact"));
const ProviderProfile = lazy(() => import("../pages/Provider/ProviderProfile"));
const Booking = lazy(() => import("../pages/Booking/Booking"));
const Checkout = lazy(() => import("../pages/Booking/Checkout"));
const BookingSuccess = lazy(() => import("../pages/Booking/BookingSuccess"));
const BookingHistory = lazy(() => import("../pages/Booking/BookingHistory"));
const Profile = lazy(() => import("../pages/Profile/Profile"));
const EditProfile = lazy(() => import("../pages/Profile/EditProfile"));
const Favorites = lazy(() => import("../pages/Profile/Favorites"));
const Notifications = lazy(() => import("../pages/Profile/Notifications"));
const PaymentMethods = lazy(() => import("../pages/Profile/PaymentMethods"));
const CustomerDashboard = lazy(() => import("../pages/Dashboard/CustomerDashboard"));
const ProviderDashboard = lazy(() => import("../pages/Dashboard/ProviderDashboard"));
const ProviderServices = lazy(() => import("../pages/Dashboard/ProviderServices"));
const ProviderJobs = lazy(() => import("../pages/Dashboard/ProviderJobs"));
const Availability = lazy(() => import("../pages/Dashboard/Availability"));
const Earnings = lazy(() => import("../pages/Dashboard/Earnings"));
const Reviews = lazy(() => import("../pages/Dashboard/Reviews"));
const Subscription = lazy(() => import("../pages/Dashboard/Subscription"));
const ProviderSettings = lazy(() => import("../pages/Dashboard/ProviderSettings"));
const AdminDashboard = lazy(() => import("../pages/Dashboard/AdminDashboard"));
const ManageUsers = lazy(() => import("../pages/Dashboard/ManageUsers"));
const ManageProviders = lazy(() => import("../pages/Dashboard/ManageProviders"));
const AdminBookings = lazy(() => import("../pages/Dashboard/AdminBookings"));
const Payments = lazy(() => import("../pages/Dashboard/Payments"));
const Reports = lazy(() => import("../pages/Dashboard/Reports"));
const Analytics = lazy(() => import("../pages/Dashboard/Analytics"));
const AdminServices = lazy(() => import("../pages/Dashboard/AdminServices"));
const ManageCoupons = lazy(() => import("../pages/Dashboard/ManageCoupons"));
const AdminSettings = lazy(() => import("../pages/Dashboard/AdminSettings"));
import NotFound from "../pages/NotFound/NotFound";

export default function AppRoutes() {
  return (
    <Suspense fallback={<AppLoader />}>
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
    </Suspense>
  );
}