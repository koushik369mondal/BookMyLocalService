import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2, 
  Camera, 
  Bell, 
  Globe, 
  Heart, 
  Calendar, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3,
  Moon,
  Sparkles,
  Award,
  Star,
  Check,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

// Schema for updating user details
const profileSchema = z.object({
  fullName: z.string().min(2, { message: "Full Name must be at least 2 characters" }),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Please enter a valid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }).regex(/^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, {
    message: "Please enter a valid 10-digit phone number"
  }),
  address: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  zipCode: z.string().optional().or(z.literal("")).refine(val => !val || /^\d{6}$/.test(val), {
    message: "PIN code must be 6 digits"
  })
});

// Schema for changing password
const passwordSchema = z.object({
  currentPassword: z.string().min(6, { message: "Current Password must be at least 6 characters" }),
  newPassword: z.string().min(6, { message: "New Password must be at least 6 characters" }),
  confirmPassword: z.string().min(1, { message: "Please confirm your new password" })
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match",
  path: ["confirmPassword"]
});

// Mock Recent Bookings list
const recentBookings = [
  { id: "BMLS-28491", providerName: "Sarah Jenkins", serviceName: "Deep Home Cleaning Service", date: "2026-07-15", time: "09:30 AM", price: 55.00, status: "upcoming" },
  { id: "BMLS-19402", providerName: "David Miller", serviceName: "Expert Plumbing & Leak Repair", date: "2026-07-03", time: "02:00 PM", price: 75.00, status: "completed" }
];

// Helper to calculate profile completion dynamically using actual database values
const getProfileCompletion = (user) => {
  if (!user) return { percent: 0, missing: [] };
  const fields = [
    { key: "avatar", label: "Profile Photo" },
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "zipCode", label: "ZIP Code" }
  ];
  const filled = fields.filter(f => user[f.key] && user[f.key].trim?.() !== "");
  const missing = fields.filter(f => !user[f.key] || user[f.key].trim?.() === "");
  const percent = Math.round((filled.length / fields.length) * 100);
  return { percent, missing };
};

export default function Profile() {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout, reloadUser } = useAuth();
  const fileInputRef = useRef(null);
  const location = useLocation();

  // Active section tab state
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && ["details", "addresses", "settings", "security", "bookings"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);

  // Settings states (local preferences)
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(true);
  const [promoEmails, setPromoEmails] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [appLanguage, setAppLanguage] = useState("en");

  // Submission messages
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Saved Addresses (local state)
  const [addresses, setAddresses] = useState([]);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState("Home");
  const [newAddressStreet, setNewAddressStreet] = useState("");
  const [newAddressCity, setNewAddressCity] = useState("");
  const [newAddressState, setNewAddressState] = useState("");
  const [newAddressZip, setNewAddressZip] = useState("");

  // Zod forms binding
  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfileForm,
    formState: { errors: profileErrors }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: ""
    }
  });

  const {
    register: regPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors }
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  // Populate form with real user data when user loads
  useEffect(() => {
    if (user) {
      resetProfileForm({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || ""
      });
    }
  }, [user, resetProfileForm]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Save profile to backend
  const onProfileSave = async (data) => {
    setIsSavingDetails(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await authService.updateProfile({
        fullName: data.fullName,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode
      });
      await reloadUser();
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err.message || "Failed to update profile");
      setTimeout(() => setErrorMsg(""), 4000);
    } finally {
      setIsSavingDetails(false);
    }
  };

  // Change password via backend
  const onPasswordChange = async (data) => {
    setIsChangingPass(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      setSuccessMsg("Password changed successfully!");
      resetPasswordForm();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err.message || "Failed to change password");
      setTimeout(() => setErrorMsg(""), 4000);
    } finally {
      setIsChangingPass(false);
    }
  };

  // Profile Picture Upload trigger
  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle image upload to backend (which uploads to Cloudinary)
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("File size exceeds 5MB limit.");
      return;
    }

    // Validate type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg("Invalid file type. Only JPG, JPEG, PNG, and WebP are allowed.");
      return;
    }

    setIsUploadingPhoto(true);
    setSuccessMsg("");
    setErrorMsg("");

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await authService.uploadAvatar(formData);
      if (res.success) {
        setSuccessMsg("Profile picture updated successfully!");
        await reloadUser();
      } else {
        setErrorMsg(res.message || "Failed to upload profile picture.");
      }
    } catch (err) {
      console.error("Avatar upload failed:", err);
      setErrorMsg(err.message || "Failed to upload profile picture.");
    } finally {
      setIsUploadingPhoto(false);
      setTimeout(() => {
        setSuccessMsg("");
        setErrorMsg("");
      }, 3000);
    }
  };

  // Saved addresses actions (local only)
  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddressStreet || !newAddressCity || !newAddressState || !newAddressZip) return;
    if (!/^\d{6}$/.test(newAddressZip)) return;
    const newAddr = {
      id: Date.now(),
      label: newAddressLabel,
      street: newAddressStreet,
      city: newAddressCity,
      state: newAddressState,
      zipCode: newAddressZip
    };
    setAddresses([...addresses, newAddr]);
    setIsAddAddressOpen(false);
    setNewAddressStreet("");
    setNewAddressCity("");
    setNewAddressState("");
    setNewAddressZip("");
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Show loading while auth is resolving
  if (authLoading || !user) {
    return (
      <DashboardLayout>
        <div className="min-h-[50vh] flex items-center justify-center bg-[#FAF6F0]">
          <Loader2 className="h-8 w-8 animate-spin text-[#1F1D1A]" />
        </div>
      </DashboardLayout>
    );
  }

  const { percent: completionPercent, missing: missingFields } = getProfileCompletion(user);
  const initials = user.fullName ? user.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "?";

  return (
    <DashboardLayout>
      <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans">
        
        {/* Hidden File Picker Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/png, image/jpeg, image/jpg, image/webp" 
          onChange={handleFileChange} 
          className="hidden" 
        />

        {/* BANNER HEADER */}
        <section className="bg-[#8C4B3E] text-white py-8 border-b border-violet-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Account Settings</h1>
            <p className="text-[#7A7266] text-xs mt-1">Configure your contact details, password, and preferences</p>
          </div>
        </section>

        {/* CONTAINER */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* COMPLETE YOUR PROFILE BANNER */}
          {completionPercent < 100 && (
            <Card className="border border-[#C9A46A]/40 bg-amber-50/80 rounded-2xl p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-amber-100 text-[#8C4B3E] rounded-lg shrink-0 mt-0.5">
                    <AlertCircle className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#1F1D1A]">Complete Your Profile</h3>
                    <p className="text-[11px] text-[#7A7266] mt-0.5">
                      Fill in missing fields: {missingFields.map(f => f.label).join(", ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-xs font-black text-amber-700">{completionPercent}%</span>
                  <Progress value={completionPercent} className="w-24 h-1.5 rounded-full bg-amber-200 [&>div]:bg-[#8C4B3E]" />
                </div>
              </div>
            </Card>
          )}

          <div>
            
            {successMsg && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl">
                <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl">
                <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* PANEL 1: ACCOUNT DETAILS */}
            {activeTab === "details" && (
              <Card className="border border-[#5A5146]/20 rounded-2xl bg-white p-6">
              <CardHeader className="p-0 pb-4 border-b border-[#5A5146]/15 flex flex-row items-center gap-2.5">
                <div className="p-2 bg-[#F0E7D5] text-[#1F1D1A] rounded-xl">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-extrabold text-[#1F1D1A]">Personal Information</CardTitle>
                  <CardDescription className="text-xs">Manage your account profile details and photo</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="p-0 pt-5">
                
                {/* INTEGRATED AVATAR UPLOAD SECTION */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pb-5 mb-5 border-b border-[#5A5146]/15">
                  <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
                    <Avatar className="w-16 h-16 border-2 border-[#5A5146]/20 rounded-full overflow-hidden shrink-0">
                      {user.avatar ? (
                        <AvatarImage src={user.avatar} className="object-cover w-full h-full" />
                      ) : null}
                      <AvatarFallback className="text-lg font-bold bg-[#F0E7D5] text-[#1F1D1A]">{initials}</AvatarFallback>
                    </Avatar>
                    
                    <button 
                      type="button"
                      disabled={isUploadingPhoto}
                      className="absolute inset-0 bg-[#8C4B3E]/60 text-white rounded-full flex flex-col items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                    >
                      {isUploadingPhoto ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="text-xs font-bold text-[#1F1D1A]">{user.fullName}</h4>
                    <p className="text-[11px] text-[#7A7266]">{user.role} Account • {user.email}</p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="xs" 
                      onClick={handlePhotoClick}
                      disabled={isUploadingPhoto}
                      className="rounded-lg border-[#5A5146]/20 text-[10px] font-semibold h-7 px-2.5 mt-1"
                    >
                      {isUploadingPhoto ? "Uploading..." : "Change Photo"}
                    </Button>
                  </div>
                </div>
                    <form onSubmit={handleProfileSubmit(onProfileSave)} className="space-y-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <Label htmlFor="fullName" className="text-xs font-bold text-[#8C4B3E]">Full Name</Label>
                        <Input
                          id="fullName"
                          placeholder="Enter your full name"
                          className="h-10 border-[#5A5146]/20 focus:ring-2 focus:ring-violet-950 rounded-xl text-xs bg-white"
                          disabled={isSavingDetails}
                          {...regProfile("fullName")}
                        />
                        {profileErrors.fullName && <p className="text-[10px] text-rose-600 font-bold mt-1">{profileErrors.fullName.message}</p>}
                      </div>

                      {/* Email / Phone grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="email" className="text-xs font-bold text-[#8C4B3E]">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            className="h-10 border-[#5A5146]/20 focus:ring-2 focus:ring-violet-950 rounded-xl text-xs bg-[#FAF6F0] cursor-not-allowed"
                            disabled
                            {...regProfile("email")}
                          />
                          <p className="text-[9px] text-[#7A7266] font-medium">Email cannot be changed</p>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="phone" className="text-xs font-bold text-[#8C4B3E]">Phone Number</Label>
                          <Input
                            id="phone"
                            placeholder="Enter your phone number"
                            className="h-10 border-[#5A5146]/20 focus:ring-2 focus:ring-violet-950 rounded-xl text-xs bg-white"
                            disabled={isSavingDetails}
                            {...regProfile("phone")}
                          />
                          {profileErrors.phone && <p className="text-[10px] text-rose-600 font-bold mt-1">{profileErrors.phone.message}</p>}
                        </div>
                      </div>

                      {/* Address */}
                      <div className="space-y-1.5">
                        <Label htmlFor="address" className="text-xs font-bold text-[#8C4B3E]">Primary Street Address</Label>
                        <Input
                          id="address"
                          placeholder="e.g. 789 Pine Street, Apt 1C"
                          className="h-10 border-[#5A5146]/20 focus:ring-2 focus:ring-violet-950 rounded-xl text-xs bg-white"
                          disabled={isSavingDetails}
                          {...regProfile("address")}
                        />
                      </div>

                      {/* City State Zip */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="city" className="text-xs font-bold text-[#8C4B3E]">City</Label>
                          <Input
                            id="city"
                            placeholder="e.g. Brooklyn"
                            className="h-10 border-[#5A5146]/20 focus:ring-2 focus:ring-violet-950 rounded-xl text-xs bg-white"
                            disabled={isSavingDetails}
                            {...regProfile("city")}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="state" className="text-xs font-bold text-[#8C4B3E]">State</Label>
                          <Input
                            id="state"
                            placeholder="e.g. NY"
                            className="h-10 border-[#5A5146]/20 focus:ring-2 focus:ring-violet-950 rounded-xl text-xs bg-white"
                            disabled={isSavingDetails}
                            {...regProfile("state")}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="zipCode" className="text-xs font-bold text-[#8C4B3E]">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            placeholder="e.g. 400001"
                            maxLength={6}
                            className="h-10 border-[#5A5146]/20 focus:ring-2 focus:ring-violet-950 rounded-xl text-xs bg-white"
                            disabled={isSavingDetails}
                            {...regProfile("zipCode")}
                          />
                          {profileErrors.zipCode && <p className="text-[10px] text-rose-600 font-bold mt-1">{profileErrors.zipCode.message}</p>}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-50 flex justify-end">
                        <Button
                          type="submit"
                          disabled={isSavingDetails}
                          className="bg-[#8C4B3E] hover:bg-[#7C8A6B] text-white font-bold text-xs h-10 px-6 rounded-xl shadow-xs flex items-center justify-center gap-1.5"
                        >
                          {isSavingDetails ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin text-white" />
                              Saving...
                            </>
                          ) : (
                            <>
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>

                    </form>
                  </CardContent>
                </Card>
              )}

              {/* PANEL 2: SAVED LOCATIONS */}
              {activeTab === "addresses" && (
                <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-6 animate-fade-in">
                  <CardHeader className="p-0 pb-4 border-b border-stone-50 flex flex-row items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-[#8C4B3E]/5 text-[#1F1D1A] rounded-xl">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-extrabold text-[#1F1D1A]">Saved Locations</CardTitle>
                        <CardDescription className="text-xs">Manage locations for quick booking dispatch</CardDescription>
                      </div>
                    </div>

                    <Button 
                      onClick={() => setIsAddAddressOpen(true)}
                      size="sm"
                      className="bg-[#8C4B3E] hover:bg-black text-white rounded-xl h-9.5 text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" /> Add Address
                    </Button>
                  </CardHeader>

                  <CardContent className="p-0 pt-6">
                    {addresses.length === 0 ? (
                      <div className="text-center py-12">
                        <MapPin className="h-10 w-10 text-stone-200 mx-auto mb-3" />
                        <p className="text-sm font-bold text-[#7A7266]">No saved addresses yet</p>
                        <p className="text-xs text-[#7A7266] mt-1">Add your first address for faster booking</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map(addr => (
                          <div key={addr.id} className="border border-[#5A5146]/20 p-4.5 rounded-2xl bg-white relative flex flex-col justify-between hover:border-stone-300 transition-colors shadow-2xs">
                            <div>
                              <span className="inline-flex items-center text-[10px] font-bold text-[#1F1D1A] bg-[#8C4B3E]/5 border border-violet-950/10 rounded-lg py-0.5 px-2 mb-2">
                                {addr.label}
                              </span>
                              <span className="block text-xs font-bold text-[#1F1D1A]">{addr.street}</span>
                              <span className="block text-[11px] text-[#7A7266] mt-0.5">{addr.city}, {addr.state} {addr.zipCode}</span>
                            </div>

                            <div className="border-t border-stone-50 pt-3 mt-4.5 flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" /> Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* PANEL 3: PREFERENCES & TOGGLES */}
              {activeTab === "settings" && (
                <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-6 animate-fade-in">
                  <CardHeader className="p-0 pb-4 border-b border-stone-50 flex flex-row items-center gap-2.5">
                    <div className="p-2 bg-[#8C4B3E]/5 text-[#1F1D1A] rounded-xl">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-extrabold text-[#1F1D1A]">Preferences & Settings</CardTitle>
                      <CardDescription className="text-xs">Adjust notification preferences, theme rules, and languages</CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 pt-5 space-y-6">
                    
                    {/* Notifications Block */}
                    <div className="space-y-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#7A7266] block">Notification Preferences</span>
                      
                      <div className="flex items-center justify-between border border-[#5A5146]/15 p-3 rounded-2xl bg-white shadow-2xs">
                        <div>
                          <span className="text-xs font-bold text-[#1F1D1A] block">Email Alerts</span>
                          <span className="text-[10px] text-[#7A7266]">Receive receipt invoices and booking logs via email</span>
                        </div>
                        <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
                      </div>

                      <div className="flex items-center justify-between border border-[#5A5146]/15 p-3 rounded-2xl bg-white shadow-2xs">
                        <div>
                          <span className="text-xs font-bold text-[#1F1D1A] block">SMS Updates</span>
                          <span className="text-[10px] text-[#7A7266]">Receive dispatcher arrival alerts on your mobile phone</span>
                        </div>
                        <Switch checked={smsNotifs} onCheckedChange={setSmsNotifs} />
                      </div>

                      <div className="flex items-center justify-between border border-[#5A5146]/15 p-3 rounded-2xl bg-white shadow-2xs">
                        <div>
                          <span className="text-xs font-bold text-[#1F1D1A] block">Promotional Newsletters</span>
                          <span className="text-[10px] text-[#7A7266]">Receive local coupon discount newsletters</span>
                        </div>
                        <Switch checked={promoEmails} onCheckedChange={setPromoEmails} />
                      </div>
                    </div>

                    {/* Dark Mode toggle */}
                    <div className="space-y-4 border-t border-[#5A5146]/15 pt-5">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#7A7266] block">Visual Themes</span>
                      <div className="flex items-center justify-between border border-[#5A5146]/15 p-3 rounded-2xl bg-white shadow-2xs">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-[#F0E7D5] text-[#5A5146] rounded-lg">
                            <Moon className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#1F1D1A] block">System Dark Mode</span>
                            <span className="text-[10px] text-[#7A7266]">Enable high-contrast night styling</span>
                          </div>
                        </div>
                        <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                      </div>
                    </div>

                    {/* Languages select */}
                    <div className="space-y-3.5 border-t border-[#5A5146]/15 pt-5">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#7A7266] block">Regional Options</span>
                      
                      <div className="flex items-center justify-between flex-wrap gap-4 border border-[#5A5146]/15 p-3.5 rounded-2xl bg-white shadow-2xs">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-[#F0E7D5] text-[#5A5146] rounded-lg">
                            <Globe className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#1F1D1A] block">Default Language</span>
                            <span className="text-[10px] text-[#7A7266]">Configure localized text templates</span>
                          </div>
                        </div>

                        <div className="relative w-[150px]">
                          <select
                            value={appLanguage}
                            onChange={(e) => setAppLanguage(e.target.value)}
                            className="w-full h-9 pl-3 pr-8 border border-[#5A5146]/20 focus:outline-none focus:ring-2 focus:ring-violet-950 rounded-xl bg-white text-xs font-semibold text-[#8C4B3E] cursor-pointer appearance-none shadow-2xs"
                          >
                            <option value="en">English (US)</option>
                            <option value="es">Español (ES)</option>
                            <option value="fr">Français (FR)</option>
                            <option value="de">Deutsch (DE)</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#7A7266]">
                            <ChevronDown className="h-4 w-4 opacity-60" />
                          </div>
                        </div>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              )}

              {/* PANEL 4: SECURITY & PASSWORD */}
              {activeTab === "security" && (
                <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-6 animate-fade-in">
                  <CardHeader className="p-0 pb-4 border-b border-stone-50 flex flex-row items-center gap-2.5">
                    <div className="p-2 bg-[#8C4B3E]/5 text-[#1F1D1A] rounded-xl">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-extrabold text-[#1F1D1A]">Security & Password</CardTitle>
                      <CardDescription className="text-xs">Update your credentials password to secure access</CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 pt-5">
                    <form onSubmit={handlePasswordSubmit(onPasswordChange)} className="space-y-4">
                      {/* Current Pass */}
                      <div className="space-y-1.5">
                        <Label htmlFor="currentPassword" className="text-xs font-bold text-[#8C4B3E]">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          placeholder="••••••••"
                          className="h-10 border-[#5A5146]/20 focus:ring-2 focus:ring-violet-950 rounded-xl text-xs bg-white"
                          disabled={isChangingPass}
                          {...regPassword("currentPassword")}
                        />
                        {passwordErrors.currentPassword && <p className="text-[10px] text-rose-600 font-bold mt-1">{passwordErrors.currentPassword.message}</p>}
                      </div>

                      {/* New Pass */}
                      <div className="space-y-1.5">
                        <Label htmlFor="newPassword" className="text-xs font-bold text-[#8C4B3E]">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Min 6 characters"
                          className="h-10 border-[#5A5146]/20 focus:ring-2 focus:ring-violet-950 rounded-xl text-xs bg-white"
                          disabled={isChangingPass}
                          {...regPassword("newPassword")}
                        />
                        {passwordErrors.newPassword && <p className="text-[10px] text-rose-600 font-bold mt-1">{passwordErrors.newPassword.message}</p>}
                      </div>

                      {/* Confirm New Pass */}
                      <div className="space-y-1.5">
                        <Label htmlFor="confirmPassword" className="text-xs font-bold text-[#8C4B3E]">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm new password"
                          className="h-10 border-[#5A5146]/20 focus:ring-2 focus:ring-violet-950 rounded-xl text-xs bg-white"
                          disabled={isChangingPass}
                          {...regPassword("confirmPassword")}
                        />
                        {passwordErrors.confirmPassword && <p className="text-[10px] text-rose-600 font-bold mt-1">{passwordErrors.confirmPassword.message}</p>}
                      </div>

                      <div className="pt-2 border-t border-stone-50 flex justify-end">
                        <Button
                          type="submit"
                          disabled={isChangingPass}
                          className="bg-[#8C4B3E] hover:bg-[#7C8A6B] text-white font-bold text-xs h-10 px-6 rounded-xl shadow-xs flex items-center justify-center gap-1.5"
                        >
                          {isChangingPass ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin text-white" />
                              Changing password...
                            </>
                          ) : (
                            <>
                              Update Password
                            </>
                          )}
                        </Button>
                      </div>

                    </form>
                  </CardContent>
                </Card>
              )}

              {/* PANEL 5: RECENT BOOKINGS PREVIEW */}
              {activeTab === "bookings" && (
                <Card className="border border-[#5A5146]/15 shadow-2xs rounded-2xl bg-white p-6 animate-fade-in">
                  <CardHeader className="p-0 pb-4 border-b border-stone-50 flex flex-row items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-[#8C4B3E]/5 text-[#1F1D1A] rounded-xl">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-extrabold text-[#1F1D1A]">Recent Appointments</CardTitle>
                        <CardDescription className="text-xs">Summary log of booking history requests</CardDescription>
                      </div>
                    </div>
                    
                    <Link to="/bookings">
                      <Button variant="outline" size="sm" className="rounded-xl border-[#5A5146]/20 hover:bg-[#FAF6F0] h-9.5 text-xs font-bold">
                        View Full History
                      </Button>
                    </Link>
                  </CardHeader>

                  <CardContent className="p-0 pt-6 space-y-4">
                    {recentBookings.map(b => (
                      <div key={b.id} className="border border-[#5A5146]/20 p-4 rounded-xl flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4 bg-white hover:border-[#5A5146]/20 transition-colors shadow-2xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-[#7A7266]">#{b.id}</span>
                            <Badge variant={b.status === "upcoming" ? "default" : "success"} className="rounded-lg text-[9px] font-bold px-2 py-0">
                              {b.status.toUpperCase()}
                            </Badge>
                          </div>
                          <h4 className="font-extrabold text-[#1F1D1A] text-sm mt-1">{b.serviceName}</h4>
                          <span className="block text-[11px] text-[#7A7266] font-semibold">{b.providerName} • {b.date} at {b.time}</span>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0 border-t border-stone-50 sm:border-0 pt-2 sm:pt-0 shrink-0">
                          <span className="text-sm font-black text-[#1F1D1A]">${b.price.toFixed(2)}</span>
                          <Link to="/bookings">
                            <Button size="xs" variant="outline" className="h-8 text-[10px] font-bold border-[#5A5146]/20 hover:bg-[#FAF6F0] rounded-lg text-[#5A5146]">Details</Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

            </div>

        </div>

      </div>

      {/* ADD LOCATION DIALOG MODAL */}
      <Dialog open={isAddAddressOpen} onOpenChange={setIsAddAddressOpen}>
        <DialogContent className="max-w-md bg-white border border-[#5A5146]/20 rounded-2xl shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-[#1F1D1A] flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#1F1D1A]" />
              Add Saved Address
            </DialogTitle>
            <DialogDescription className="text-xs text-[#7A7266] pt-0.5">
              Register a location address to quickly select during scheduling checkout
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddAddress} className="space-y-4 pt-3">
            {/* Label select */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#8C4B3E]">Location Label</Label>
              <div className="grid grid-cols-3 bg-[#FAF6F0] border border-[#5A5146]/20 p-1 rounded-xl h-10">
                {["Home", "Office", "Other"].map(lbl => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => setNewAddressLabel(lbl)}
                    className={`rounded-lg text-xs font-bold transition-all ${
                      newAddressLabel === lbl
                        ? "bg-white text-[#1F1D1A] shadow-2xs border border-[#5A5146]/15"
                        : "text-[#7A7266] hover:text-[#8C4B3E]"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            {/* Street Address */}
            <div className="space-y-1.5">
              <Label htmlFor="newStreet" className="text-xs font-bold text-[#8C4B3E]">Street Address</Label>
              <Input
                id="newStreet"
                placeholder="e.g. 500 Madison Avenue, Floor 12"
                value={newAddressStreet}
                onChange={(e) => setNewAddressStreet(e.target.value)}
                className="h-9.5 border-[#5A5146]/20 focus:ring-2 focus:ring-violet-950 rounded-xl text-xs bg-white"
                required
              />
            </div>

            {/* City State Zip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="newCity" className="text-xs font-bold text-[#8C4B3E]">City</Label>
                <Input
                  id="newCity"
                  placeholder="Manhattan"
                  value={newAddressCity}
                  onChange={(e) => setNewAddressCity(e.target.value)}
                  className="h-9.5 border-[#5A5146]/20 focus:ring-2 focus:ring-violet-950 rounded-xl text-xs bg-white"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newState" className="text-xs font-bold text-[#8C4B3E]">State</Label>
                <Input
                  id="newState"
                  placeholder="NY"
                  value={newAddressState}
                  onChange={(e) => setNewAddressState(e.target.value)}
                  className="h-9.5 border-[#5A5146]/20 focus:ring-2 focus:ring-violet-950 rounded-xl text-xs bg-white text-center"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newZip" className="text-xs font-bold text-[#8C4B3E]">ZIP Code</Label>
                <Input
                  id="newZip"
                  placeholder="400001"
                  maxLength={6}
                  pattern="\d{6}"
                  title="PIN code must be 6 digits"
                  value={newAddressZip}
                  onChange={(e) => setNewAddressZip(e.target.value)}
                  className="h-9.5 border-[#5A5146]/20 focus:ring-2 focus:ring-violet-950 rounded-xl text-xs bg-white text-center"
                  required
                />
              </div>
            </div>

            <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddAddressOpen(false)}
                className="rounded-xl border-[#5A5146]/20 text-xs h-9.5 w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="rounded-xl bg-[#8C4B3E] hover:bg-[#7C8A6B] text-white font-bold text-xs h-9.5 px-6 w-full sm:w-auto"
              >
                Save Location
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </DashboardLayout>
  );
}
