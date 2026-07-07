import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Services from "../pages/Services/Services";
import ServiceDetails from "../pages/Services/ServiceDetails";
import Booking from "../pages/Booking/Booking";
import Checkout from "../pages/Booking/Checkout";
import Profile from "../pages/Profile/Profile";
import CustomerDashboard from "../pages/Dashboard/CustomerDashboard";
import ProviderDashboard from "../pages/Dashboard/ProviderDashboard";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import NotFound from "../pages/NotFound/NotFound";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetails />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/provider/dashboard" element={<ProviderDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}