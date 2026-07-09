import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import MainLayout from "../../layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  ShieldCheck
} from "lucide-react";

// Schema for updating user details
const profileSchema = z.object({
  fullName: z.string().min(2, { message: "Full Name must be at least 2 characters" }),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Please enter a valid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }).regex(/^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, {
    message: "Please enter a valid 10-digit phone number"
  }),
  street: z.string().min(5, { message: "Street Address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zipCode: z.string().regex(/^\d{5}$/, { message: "ZIP Code must be a 5-digit number" })
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

// Mock Initial Saved Addresses
const initialAddresses = [
  { id: 1, label: "Home", street: "123 Main St, Apt 4B", city: "Brooklyn", state: "NY", zipCode: "11201" },
  { id: 2, label: "Office", street: "500 Madison Ave, Floor 12", city: "Manhattan", state: "NY", zipCode: "10022" }
];

// Mock Recent Bookings list
const recentBookings = [
  { id: "BMLS-28491", providerName: "Sarah Jenkins", serviceName: "Deep Home Cleaning Service", date: "2026-07-15", time: "09:30 AM", price: 55.00, status: "upcoming" },
  { id: "BMLS-19402", providerName: "David Miller", serviceName: "Expert Plumbing & Leak Repair", date: "2026-07-03", time: "02:00 PM", price: 75.00, status: "completed" }
];

// Mock Favorite Providers list
const favoriteProviders = [
  {
    id: 1,
    providerName: "Sarah Jenkins",
    providerImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
    category: "Home Cleaning",
    rating: 4.9,
    reviewsCount: 142,
    location: "Brooklyn, NY",
    price: 35
  },
  {
    id: 3,
    providerName: "Marcus Vance",
    providerImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    category: "Electrical",
    rating: 4.9,
    reviewsCount: 115,
    location: "Manhattan, NY",
    price: 65
  }
];

export default function Profile() {
  const navigate = useNavigate();

  // Active section tab state
  const [activeTab, setActiveTab] = useState("details");

  // Mock Profile photo state
  const [profileImage, setProfileImage] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Address lists state
  const [addresses, setAddresses] = useState(initialAddresses);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState("Home");
  const [newAddressStreet, setNewAddressStreet] = useState("");
  const [newAddressCity, setNewAddressCity] = useState("");
  const [newAddressState, setNewAddressState] = useState("");
  const [newAddressZip, setNewAddressZip] = useState("");

  // Settings states
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

  // Zod forms binding
  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "Chloe Bennett",
      email: "chloe.bennett@example.com",
      phone: "555-019-2834",
      street: "789 Pine Street, Apt 1C",
      city: "Brooklyn",
      state: "NY",
      zipCode: "11201"
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update profile image simulation
  const handlePhotoUpload = () => {
    setIsUploadingPhoto(true);
    setTimeout(() => {
      // Choose a different mock profile pic
      setProfileImage("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80");
      setIsUploadingPhoto(false);
      setSuccessMsg("Profile picture updated successfully!");
      setTimeout(() => setSuccessMsg(""), 2000);
    }, 1200);
  };

  const onProfileSave = async (data) => {
    setIsSavingDetails(true);
    setSuccessMsg("");
    setErrorMsg("");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSavingDetails(false);
    setSuccessMsg("Account profile details updated successfully!");
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  const onPasswordChange = async (data) => {
    setIsChangingPass(true);
    setSuccessMsg("");
    setErrorMsg("");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsChangingPass(false);
    
    if (data.currentPassword !== "current123") {
      setErrorMsg("Incorrect current password. Please try again.");
    } else {
      setSuccessMsg("Password changed successfully!");
      resetPasswordForm();
      setTimeout(() => setSuccessMsg(""), 2500);
    }
  };

  // Saved addresses actions
  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddressStreet || !newAddressCity || !newAddressState || !newAddressZip) return;

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

    // Reset inputs
    setNewAddressStreet("");
    setNewAddressCity("");
    setNewAddressState("");
    setNewAddressZip("");
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleLogout = () => {
    // Clear storage and redirect to login/home
    setSuccessMsg("Logging out... Redirecting.");
    setTimeout(() => {
      navigate("/login");
    }, 1200);
  };

  return (
    <MainLayout>
      <div className="bg-slate-50/50 min-h-screen pb-16 font-sans">
        
        {/* BANNER HEADER */}
        <section className="bg-gradient-to-r from-blue-600 via-indigo-650 to-indigo-750 text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_50%)]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Account Settings</h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1.5 font-medium">Configure preferences, details, password keys, and delivery locations</p>
          </div>
        </section>

        {/* CONTAINER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT MENU SIDEBAR */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Photo Display Card */}
              <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-6 text-center">
                <CardContent className="p-0 flex flex-col items-center gap-4">
                  {/* Avatar wrapper */}
                  <div className="relative group">
                    <Avatar className="w-24 h-24 border-4 border-slate-100 shadow-md rounded-full overflow-hidden shrink-0">
                      <AvatarImage src={profileImage} className="object-cover w-full h-full" />
                      <AvatarFallback className="text-2xl font-bold bg-indigo-50 text-indigo-700">CB</AvatarFallback>
                    </Avatar>
                    
                    {/* Camera upload overlay trigger */}
                    <button 
                      type="button"
                      onClick={handlePhotoUpload}
                      disabled={isUploadingPhoto}
                      className="absolute inset-0 bg-slate-950/60 text-white rounded-full flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    >
                      {isUploadingPhoto ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Camera className="h-5 w-5" />
                          <span className="text-[9px] font-bold uppercase tracking-wider">Change</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">Chloe Bennett</h3>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Client Account</span>
                  </div>
                </CardContent>
              </Card>

              {/* Menu Navigation Card */}
              <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-4.5">
                <CardContent className="p-0 flex flex-col gap-1.5">
                  {[
                    { id: "details", label: "Personal Information", icon: User },
                    { id: "addresses", label: "Saved Locations", icon: MapPin },
                    { id: "settings", label: "Preferences & Toggles", icon: Bell },
                    { id: "security", label: "Security & Keys", icon: Lock },
                    { id: "bookings", label: "Recent Bookings", icon: Calendar },
                    { id: "favorites", label: "Saved Favorites", icon: Heart }
                  ].map((menu) => {
                    const isActive = activeTab === menu.id;
                    return (
                      <button
                        key={menu.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(menu.id);
                          setSuccessMsg("");
                          setErrorMsg("");
                        }}
                        className={`flex items-center gap-3 text-xs font-semibold px-4 py-3 rounded-xl transition-all ${
                          isActive 
                            ? "bg-blue-50 text-blue-600 font-extrabold"
                            : "bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <menu.icon className={`h-4.5 w-4.5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                        {menu.label}
                      </button>
                    );
                  })}

                  <hr className="border-slate-100 my-1.5" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-xs font-bold px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <LogOut className="h-4.5 w-4.5" />
                    Sign Out Account
                  </button>
                </CardContent>
              </Card>

            </div>

            {/* RIGHT DETAILS ACTIVE SCREEN */}
            <div className="lg:col-span-8">
              
              {successMsg && (
                <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl animate-fade-in shadow-2xs">
                  <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl animate-fade-in shadow-2xs">
                  <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* PANEL 1: ACCOUNT DETAILS */}
              {activeTab === "details" && (
                <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-6 animate-fade-in">
                  <CardHeader className="p-0 pb-4 border-b border-slate-50 flex flex-row items-center gap-2.5">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-extrabold text-slate-900">Personal Information</CardTitle>
                      <CardDescription className="text-xs">Update your primary registration contact credentials</CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 pt-5">
                    <form onSubmit={handleProfileSubmit(onProfileSave)} className="space-y-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <Label htmlFor="fullName" className="text-xs font-bold text-slate-700">Full Name</Label>
                        <Input
                          id="fullName"
                          className="h-10 border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl text-xs bg-white"
                          disabled={isSavingDetails}
                          {...regProfile("fullName")}
                        />
                        {profileErrors.fullName && <p className="text-[10px] text-rose-600 font-bold mt-1">{profileErrors.fullName.message}</p>}
                      </div>

                      {/* Email / Phone grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            className="h-10 border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl text-xs bg-white"
                            disabled={isSavingDetails}
                            {...regProfile("email")}
                          />
                          {profileErrors.email && <p className="text-[10px] text-rose-600 font-bold mt-1">{profileErrors.email.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="phone" className="text-xs font-bold text-slate-700">Phone Number</Label>
                          <Input
                            id="phone"
                            className="h-10 border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl text-xs bg-white"
                            disabled={isSavingDetails}
                            {...regProfile("phone")}
                          />
                          {profileErrors.phone && <p className="text-[10px] text-rose-600 font-bold mt-1">{profileErrors.phone.message}</p>}
                        </div>
                      </div>

                      {/* Street Address */}
                      <div className="space-y-1.5">
                        <Label htmlFor="street" className="text-xs font-bold text-slate-700">Primary Street Address</Label>
                        <Input
                          id="street"
                          className="h-10 border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl text-xs bg-white"
                          disabled={isSavingDetails}
                          {...regProfile("street")}
                        />
                        {profileErrors.street && <p className="text-[10px] text-rose-600 font-bold mt-1">{profileErrors.street.message}</p>}
                      </div>

                      {/* City State Zip */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="city" className="text-xs font-bold text-slate-700">City</Label>
                          <Input
                            id="city"
                            className="h-10 border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl text-xs bg-white"
                            disabled={isSavingDetails}
                            {...regProfile("city")}
                          />
                          {profileErrors.city && <p className="text-[10px] text-rose-600 font-bold mt-1">{profileErrors.city.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="state" className="text-xs font-bold text-slate-700">State</Label>
                          <Input
                            id="state"
                            className="h-10 border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl text-xs bg-white"
                            disabled={isSavingDetails}
                            {...regProfile("state")}
                          />
                          {profileErrors.state && <p className="text-[10px] text-rose-600 font-bold mt-1">{profileErrors.state.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="zipCode" className="text-xs font-bold text-slate-700">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            className="h-10 border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl text-xs bg-white"
                            disabled={isSavingDetails}
                            {...regProfile("zipCode")}
                          />
                          {profileErrors.zipCode && <p className="text-[10px] text-rose-600 font-bold mt-1">{profileErrors.zipCode.message}</p>}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-50 flex justify-end">
                        <Button
                          type="submit"
                          disabled={isSavingDetails}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 px-6 rounded-xl shadow-xs flex items-center justify-center gap-1.5"
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
                <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-6 animate-fade-in">
                  <CardHeader className="p-0 pb-4 border-b border-slate-50 flex flex-row items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-extrabold text-slate-900">Saved Locations</CardTitle>
                        <CardDescription className="text-xs">Manage locations for quick booking dispatch</CardDescription>
                      </div>
                    </div>

                    <Button 
                      onClick={() => setIsAddAddressOpen(true)}
                      size="sm"
                      className="bg-slate-900 hover:bg-black text-white rounded-xl h-9.5 text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" /> Add Address
                    </Button>
                  </CardHeader>

                  <CardContent className="p-0 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map(addr => (
                        <div key={addr.id} className="border border-slate-150 p-4.5 rounded-2xl bg-white relative flex flex-col justify-between hover:border-slate-250 transition-colors shadow-2xs">
                          <div>
                            <span className="inline-flex items-center text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-lg py-0.5 px-2 mb-2">
                              {addr.label}
                            </span>
                            <span className="block text-xs font-bold text-slate-800">{addr.street}</span>
                            <span className="block text-[11px] text-slate-500 mt-0.5">{addr.city}, {addr.state} {addr.zipCode}</span>
                          </div>

                          <div className="border-t border-slate-50 pt-3 mt-4.5 flex justify-end">
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
                  </CardContent>
                </Card>
              )}

              {/* PANEL 3: PREFERENCES & TOGGLES */}
              {activeTab === "settings" && (
                <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-6 animate-fade-in">
                  <CardHeader className="p-0 pb-4 border-b border-slate-50 flex flex-row items-center gap-2.5">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-extrabold text-slate-900">Preferences & Settings</CardTitle>
                      <CardDescription className="text-xs">Adjust notification preferences, theme rules, and languages</CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 pt-5 space-y-6">
                    
                    {/* Notifications Block */}
                    <div className="space-y-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Notification Preferences</span>
                      
                      <div className="flex items-center justify-between border border-slate-100 p-3 rounded-2xl bg-white shadow-2xs">
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">Email Alerts</span>
                          <span className="text-[10px] text-slate-400">Receive receipt invoices and booking logs via email</span>
                        </div>
                        <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
                      </div>

                      <div className="flex items-center justify-between border border-slate-100 p-3 rounded-2xl bg-white shadow-2xs">
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">SMS Updates</span>
                          <span className="text-[10px] text-slate-400">Receive dispatcher arrival alerts on your mobile phone</span>
                        </div>
                        <Switch checked={smsNotifs} onCheckedChange={setSmsNotifs} />
                      </div>

                      <div className="flex items-center justify-between border border-slate-100 p-3 rounded-2xl bg-white shadow-2xs">
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">Promotional Newsletters</span>
                          <span className="text-[10px] text-slate-400">Receive local coupon discount newsletters</span>
                        </div>
                        <Switch checked={promoEmails} onCheckedChange={setPromoEmails} />
                      </div>
                    </div>

                    {/* Dark Mode toggle */}
                    <div className="space-y-4 border-t border-slate-100 pt-5">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Visual Themes</span>
                      <div className="flex items-center justify-between border border-slate-100 p-3 rounded-2xl bg-white shadow-2xs">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-slate-100 text-slate-600 rounded-lg">
                            <Moon className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">System Dark Mode</span>
                            <span className="text-[10px] text-slate-400">Enable high-contrast night styling</span>
                          </div>
                        </div>
                        <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                      </div>
                    </div>

                    {/* Languages select */}
                    <div className="space-y-3.5 border-t border-slate-100 pt-5">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Regional Options</span>
                      
                      <div className="flex items-center justify-between flex-wrap gap-4 border border-slate-100 p-3.5 rounded-2xl bg-white shadow-2xs">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-slate-100 text-slate-600 rounded-lg">
                            <Globe className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">Default Language</span>
                            <span className="text-[10px] text-slate-400">Configure localized text templates</span>
                          </div>
                        </div>

                        <div className="relative w-[150px]">
                          <select
                            value={appLanguage}
                            onChange={(e) => setAppLanguage(e.target.value)}
                            className="w-full h-9 pl-3 pr-8 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl bg-white text-xs font-semibold text-slate-700 cursor-pointer appearance-none shadow-2xs"
                          >
                            <option value="en">English (US)</option>
                            <option value="es">Español (ES)</option>
                            <option value="fr">Français (FR)</option>
                            <option value="de">Deutsch (DE)</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                            <ChevronDown className="h-4 w-4 opacity-60" />
                          </div>
                        </div>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              )}

              {/* PANEL 4: SECURITY & KEYS */}
              {activeTab === "security" && (
                <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-6 animate-fade-in">
                  <CardHeader className="p-0 pb-4 border-b border-slate-50 flex flex-row items-center gap-2.5">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-extrabold text-slate-900">Security & Keys</CardTitle>
                      <CardDescription className="text-xs">Update your credentials password to secure access</CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 pt-5">
                    <form onSubmit={handlePasswordSubmit(onPasswordChange)} className="space-y-4">
                      {/* Current Pass */}
                      <div className="space-y-1.5">
                        <Label htmlFor="currentPassword" className="text-xs font-bold text-slate-700">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          placeholder="••••••••"
                          className="h-10 border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl text-xs bg-white"
                          disabled={isChangingPass}
                          {...regPassword("currentPassword")}
                        />
                        {passwordErrors.currentPassword && <p className="text-[10px] text-rose-600 font-bold mt-1">{passwordErrors.currentPassword.message}</p>}
                        <span className="text-[9px] text-slate-400 font-semibold block">Enter <span className="font-bold text-slate-500">current123</span> to simulate successful current password validations.</span>
                      </div>

                      {/* New Pass */}
                      <div className="space-y-1.5">
                        <Label htmlFor="newPassword" className="text-xs font-bold text-slate-700">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Min 6 characters"
                          className="h-10 border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl text-xs bg-white"
                          disabled={isChangingPass}
                          {...regPassword("newPassword")}
                        />
                        {passwordErrors.newPassword && <p className="text-[10px] text-rose-600 font-bold mt-1">{passwordErrors.newPassword.message}</p>}
                      </div>

                      {/* Confirm New Pass */}
                      <div className="space-y-1.5">
                        <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm new password"
                          className="h-10 border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl text-xs bg-white"
                          disabled={isChangingPass}
                          {...regPassword("confirmPassword")}
                        />
                        {passwordErrors.confirmPassword && <p className="text-[10px] text-rose-600 font-bold mt-1">{passwordErrors.confirmPassword.message}</p>}
                      </div>

                      <div className="pt-2 border-t border-slate-50 flex justify-end">
                        <Button
                          type="submit"
                          disabled={isChangingPass}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 px-6 rounded-xl shadow-xs flex items-center justify-center gap-1.5"
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
                <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-6 animate-fade-in">
                  <CardHeader className="p-0 pb-4 border-b border-slate-50 flex flex-row items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-extrabold text-slate-900">Recent Appointments</CardTitle>
                        <CardDescription className="text-xs">Summary log of booking history requests</CardDescription>
                      </div>
                    </div>
                    
                    <Link to="/bookings">
                      <Button variant="outline" size="sm" className="rounded-xl border-slate-200 hover:bg-slate-50 h-9.5 text-xs font-bold">
                        View Full History
                      </Button>
                    </Link>
                  </CardHeader>

                  <CardContent className="p-0 pt-6 space-y-4">
                    {recentBookings.map(b => (
                      <div key={b.id} className="border border-slate-150 p-4 rounded-xl flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4 bg-white hover:border-slate-200 transition-colors shadow-2xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-slate-400">#{b.id}</span>
                            <Badge variant={b.status === "upcoming" ? "default" : "success"} className="rounded-lg text-[9px] font-bold px-2 py-0">
                              {b.status.toUpperCase()}
                            </Badge>
                          </div>
                          <h4 className="font-extrabold text-slate-800 text-sm mt-1">{b.serviceName}</h4>
                          <span className="block text-[11px] text-slate-500 font-semibold">{b.providerName} • {b.date} at {b.time}</span>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0 border-t border-slate-50 sm:border-0 pt-2 sm:pt-0 shrink-0">
                          <span className="text-sm font-black text-slate-950">${b.price.toFixed(2)}</span>
                          <Link to="/bookings">
                            <Button size="xs" variant="outline" className="h-8 text-[10px] font-bold border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600">Details</Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* PANEL 6: FAVORITE PROVIDERS */}
              {activeTab === "favorites" && (
                <Card className="border border-slate-100 shadow-2xs rounded-2xl bg-white p-6 animate-fade-in">
                  <CardHeader className="p-0 pb-4 border-b border-slate-50 flex flex-row items-center gap-2.5">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                      <Heart className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-extrabold text-slate-900">Favorite Providers</CardTitle>
                      <CardDescription className="text-xs">Your preferred service specialists for quick booking access</CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 pt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {favoriteProviders.map(fav => (
                        <Card key={fav.id} className="group overflow-hidden border border-slate-100 hover:border-slate-250 shadow-2xs hover:shadow-xs transition-all duration-300 bg-white flex flex-col h-full rounded-2xl">
                          <div className="p-4 flex items-start gap-3">
                            <Avatar className="w-10 h-10 border border-slate-100 overflow-hidden bg-white shrink-0">
                              <AvatarImage src={fav.providerImage} className="object-cover" />
                              <AvatarFallback>{fav.providerName[0]}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-0.5 flex-1 min-w-0">
                              <Badge variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold rounded-lg text-[9px] py-0 px-2 uppercase">
                                {fav.category}
                              </Badge>
                              <h4 className="font-extrabold text-slate-900 text-xs truncate mt-1">{fav.providerName}</h4>
                              <div className="flex items-center gap-1 text-[10px] text-slate-450 font-medium">
                                <MapPin className="h-3 w-3" /> {fav.location}
                              </div>
                            </div>
                          </div>

                          <div className="p-4 pt-0 mt-auto border-t border-slate-50 flex items-center justify-between bg-slate-50/50">
                            <span className="text-[10px] font-bold text-slate-500">Starting: <span className="font-black text-slate-805">${fav.price}/hr</span></span>
                            <Link to={`/services/${fav.id}`}>
                              <Button size="xs" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-7 text-[9px] font-bold shadow-2xs">Book Pro</Button>
                            </Link>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* ADD LOCATION DIALOG MODAL */}
      <Dialog open={isAddAddressOpen} onOpenChange={setIsAddAddressOpen}>
        <DialogContent className="max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Add Saved Address
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 pt-0.5">
              Register a location address to quickly select during scheduling checkout
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddAddress} className="space-y-4 pt-3">
            {/* Label select */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Location Label</Label>
              <div className="grid grid-cols-3 bg-slate-50 border border-slate-150 p-1 rounded-xl h-10">
                {["Home", "Office", "Other"].map(lbl => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => setNewAddressLabel(lbl)}
                    className={`rounded-lg text-xs font-bold transition-all ${
                      newAddressLabel === lbl
                        ? "bg-white text-blue-600 shadow-2xs border border-slate-100"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            {/* Street Address */}
            <div className="space-y-1.5">
              <Label htmlFor="newStreet" className="text-xs font-bold text-slate-700">Street Address</Label>
              <Input
                id="newStreet"
                placeholder="e.g. 500 Madison Avenue, Floor 12"
                value={newAddressStreet}
                onChange={(e) => setNewAddressStreet(e.target.value)}
                className="h-9.5 border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl text-xs bg-white"
                required
              />
            </div>

            {/* City State Zip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="newCity" className="text-xs font-bold text-slate-700">City</Label>
                <Input
                  id="newCity"
                  placeholder="Manhattan"
                  value={newAddressCity}
                  onChange={(e) => setNewAddressCity(e.target.value)}
                  className="h-9.5 border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl text-xs bg-white"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newState" className="text-xs font-bold text-slate-700">State</Label>
                <Input
                  id="newState"
                  placeholder="NY"
                  value={newAddressState}
                  onChange={(e) => setNewAddressState(e.target.value)}
                  className="h-9.5 border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl text-xs bg-white text-center"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newZip" className="text-xs font-bold text-slate-700">ZIP Code</Label>
                <Input
                  id="newZip"
                  placeholder="10022"
                  maxLength={5}
                  value={newAddressZip}
                  onChange={(e) => setNewAddressZip(e.target.value)}
                  className="h-9.5 border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl text-xs bg-white text-center"
                  required
                />
              </div>
            </div>

            <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddAddressOpen(false)}
                className="rounded-xl border-slate-200 text-xs h-9.5 w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9.5 px-6 w-full sm:w-auto"
              >
                Save Location
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </MainLayout>
  );
}
