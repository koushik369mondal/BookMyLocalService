import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  User, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2, 
  Camera, 
  Plus, 
  Trash2, 
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
    if (tab && ["details", "addresses"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);

  // Submission messages
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSavingDetails, setIsSavingDetails] = useState(false);
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

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("File size exceeds 5MB limit.");
      return;
    }

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

        {/* LIGHT RETRO BANNER HEADER */}
        <section className="bg-[#F0E7D5] text-[#1F1D1A] py-8 border-b border-[#E8DCC3]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D1A]">My Account Profile</h1>
              <p className="text-[#5A5146] text-xs mt-1 font-medium">Manage your personal details, avatar photo, and saved dispatch addresses</p>
            </div>

            {/* TAB SELECTOR SWITCHER */}
            <div className="flex bg-[#FAF6F0] p-1 rounded-xl border border-[#E8DCC3]">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "details"
                    ? "bg-[#F0E7D5] text-[#C9A46A] shadow-2xs border border-[#E8DCC3]"
                    : "text-[#5A5146] hover:text-[#1F1D1A]"
                }`}
              >
                Personal Info
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("addresses")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "addresses"
                    ? "bg-[#F0E7D5] text-[#C9A46A] shadow-2xs border border-[#E8DCC3]"
                    : "text-[#5A5146] hover:text-[#1F1D1A]"
                }`}
              >
                Saved Addresses
              </button>
            </div>
          </div>
        </section>

        {/* CONTAINER */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* COMPLETE YOUR PROFILE BANNER */}
          {completionPercent < 100 && (
            <Card className="border border-[#E8DCC3] bg-[#F0E7D5]/60 rounded-2xl p-4 mb-6 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-[#C9A46A]/20 text-[#C9A46A] rounded-lg shrink-0 mt-0.5 border border-[#C9A46A]/30">
                    <AlertCircle className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#1F1D1A]">Complete Your Profile</h3>
                    <p className="text-[11px] text-[#5A5146] mt-0.5">
                      Fill in missing fields: {missingFields.map(f => f.label).join(", ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-xs font-bold text-[#C9A46A]">{completionPercent}%</span>
                  <Progress value={completionPercent} className="w-24 h-1.5 rounded-full bg-[#FAF6F0] [&>div]:bg-[#C9A46A]" />
                </div>
              </div>
            </Card>
          )}

          <div>
            
            {successMsg && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-[#7DAB7D]/20 border border-[#7DAB7D]/40 text-[#2B522B] text-xs font-bold rounded-xl shadow-2xs">
                <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5 text-[#2B522B]" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-[#8C4B3E]/20 border border-[#8C4B3E]/40 text-[#8C4B3E] text-xs font-bold rounded-xl shadow-2xs">
                <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 text-[#8C4B3E]" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* PANEL 1: ACCOUNT DETAILS & UNIFIED EDIT FORM */}
            {activeTab === "details" && (
              <Card className="border border-[#E8DCC3] rounded-2xl bg-white p-6 shadow-2xs">
                <CardHeader className="p-0 pb-4 border-b border-[#E8DCC3] flex flex-row items-center gap-2.5">
                  <div className="p-2 bg-[#F0E7D5] text-[#C9A46A] rounded-xl border border-[#E8DCC3]">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-[#1F1D1A]">Personal Details & Avatar</CardTitle>
                    <CardDescription className="text-xs text-[#7A7266]">View and update your personal information and profile picture</CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="p-0 pt-6">
                  
                  {/* AVATAR UPLOAD SECTION */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 pb-6 mb-6 border-b border-[#E8DCC3]">
                    <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
                      <Avatar className="w-16 h-16 border border-[#E8DCC3] rounded-full overflow-hidden shrink-0 shadow-2xs">
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} className="object-cover w-full h-full" />
                        ) : null}
                        <AvatarFallback className="text-lg font-bold bg-[#F0E7D5] text-[#C9A46A]">{initials}</AvatarFallback>
                      </Avatar>
                      
                      <button 
                        type="button"
                        disabled={isUploadingPhoto}
                        className="absolute inset-0 bg-[#1F1D1A]/60 text-white rounded-full flex flex-col items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                      >
                        {isUploadingPhoto ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <div className="space-y-1 text-center sm:text-left">
                      <h4 className="text-sm font-bold text-[#1F1D1A]">{user.fullName}</h4>
                      <p className="text-xs text-[#7A7266] font-medium">{user.role} Account • {user.email}</p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="xs" 
                        onClick={handlePhotoClick}
                        disabled={isUploadingPhoto}
                        className="rounded-lg border-[#E8DCC3] bg-[#FAF6F0] text-[#1F1D1A] text-[10px] font-bold h-7 px-3 mt-1 hover:bg-[#F0E7D5]"
                      >
                        {isUploadingPhoto ? "Uploading..." : "Change Photo"}
                      </Button>
                    </div>
                  </div>

                  <form onSubmit={handleProfileSubmit(onProfileSave)} className="space-y-5">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-xs font-bold text-[#1F1D1A]">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        className="h-10 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A]"
                        disabled={isSavingDetails}
                        {...regProfile("fullName")}
                      />
                      {profileErrors.fullName && <p className="text-[10px] text-[#8C4B3E] font-bold mt-1">{profileErrors.fullName.message}</p>}
                    </div>

                    {/* Email / Phone grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-bold text-[#1F1D1A]">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          className="h-10 border-[#E8DCC3] rounded-xl text-xs bg-[#F0E7D5]/50 text-[#7A7266] cursor-not-allowed"
                          disabled
                          {...regProfile("email")}
                        />
                        <p className="text-[10px] text-[#7A7266] font-medium">Email address is locked to your account</p>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-bold text-[#1F1D1A]">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="Enter your phone number"
                          className="h-10 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A]"
                          disabled={isSavingDetails}
                          {...regProfile("phone")}
                        />
                        {profileErrors.phone && <p className="text-[10px] text-[#8C4B3E] font-bold mt-1">{profileErrors.phone.message}</p>}
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-1.5">
                      <Label htmlFor="address" className="text-xs font-bold text-[#1F1D1A]">Primary Street Address</Label>
                      <Input
                        id="address"
                        placeholder="e.g. 789 Pine Street, Apt 1C"
                        className="h-10 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A]"
                        disabled={isSavingDetails}
                        {...regProfile("address")}
                      />
                    </div>

                    {/* City State Zip */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="city" className="text-xs font-bold text-[#1F1D1A]">City</Label>
                        <Input
                          id="city"
                          placeholder="e.g. Brooklyn"
                          className="h-10 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A]"
                          disabled={isSavingDetails}
                          {...regProfile("city")}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="state" className="text-xs font-bold text-[#1F1D1A]">State</Label>
                        <Input
                          id="state"
                          placeholder="e.g. NY"
                          className="h-10 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A]"
                          disabled={isSavingDetails}
                          {...regProfile("state")}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="zipCode" className="text-xs font-bold text-[#1F1D1A]">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          placeholder="e.g. 400001"
                          maxLength={6}
                          className="h-10 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A]"
                          disabled={isSavingDetails}
                          {...regProfile("zipCode")}
                        />
                        {profileErrors.zipCode && <p className="text-[10px] text-[#8C4B3E] font-bold mt-1">{profileErrors.zipCode.message}</p>}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E8DCC3] flex justify-end">
                      <Button
                        type="submit"
                        disabled={isSavingDetails}
                        className="bg-[#C9A46A] hover:bg-[#b89359] text-white font-bold text-xs h-10 px-7 rounded-xl shadow-2xs border border-[#E8DCC3] flex items-center justify-center gap-1.5"
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
              <Card className="border border-[#E8DCC3] rounded-2xl bg-white p-6 shadow-2xs">
                <CardHeader className="p-0 pb-4 border-b border-[#E8DCC3] flex flex-row items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-[#F0E7D5] text-[#C9A46A] rounded-xl border border-[#E8DCC3]">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-[#1F1D1A]">Saved Locations</CardTitle>
                      <CardDescription className="text-xs text-[#7A7266]">Manage saved addresses for fast service checkout</CardDescription>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setIsAddAddressOpen(true)}
                    size="sm"
                    className="bg-[#C9A46A] hover:bg-[#b89359] text-white rounded-xl h-9.5 text-xs font-bold flex items-center gap-1 border border-[#E8DCC3]"
                  >
                    <Plus className="h-4 w-4" /> Add Address
                  </Button>
                </CardHeader>

                <CardContent className="p-0 pt-6">
                  {addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="h-10 w-10 text-[#7A7266] mx-auto mb-3 opacity-40" />
                      <p className="text-sm font-bold text-[#1F1D1A]">No saved addresses yet</p>
                      <p className="text-xs text-[#7A7266] mt-1">Add your first address for faster booking checkout</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map(addr => (
                        <div key={addr.id} className="border border-[#E8DCC3] p-4.5 rounded-2xl bg-white relative flex flex-col justify-between hover:border-[#C9A46A] transition-colors shadow-2xs">
                          <div>
                            <span className="inline-flex items-center text-[10px] font-bold text-[#C9A46A] bg-[#F0E7D5] border border-[#E8DCC3] rounded-lg py-0.5 px-2 mb-2">
                              {addr.label}
                            </span>
                            <span className="block text-xs font-bold text-[#1F1D1A]">{addr.street}</span>
                            <span className="block text-[11px] text-[#7A7266] mt-0.5">{addr.city}, {addr.state} {addr.zipCode}</span>
                          </div>

                          <div className="border-t border-[#E8DCC3] pt-3 mt-4.5 flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="text-[#8C4B3E] hover:underline text-xs font-bold flex items-center gap-1.5 transition-colors"
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

          </div>

        </div>

      </div>

      {/* ADD LOCATION DIALOG MODAL */}
      <Dialog open={isAddAddressOpen} onOpenChange={setIsAddAddressOpen}>
        <DialogContent className="max-w-md bg-[#FAF6F0] border border-[#E8DCC3] rounded-2xl shadow-xl p-6 text-[#1F1D1A]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#1F1D1A] flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#C9A46A]" />
              Add Saved Address
            </DialogTitle>
            <DialogDescription className="text-xs text-[#7A7266] pt-0.5">
              Register a location address to quickly select during scheduling checkout
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddAddress} className="space-y-4 pt-3">
            {/* Label select */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#1F1D1A]">Location Label</Label>
              <div className="grid grid-cols-3 bg-[#F0E7D5] border border-[#E8DCC3] p-1 rounded-xl h-10">
                {["Home", "Office", "Other"].map(lbl => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => setNewAddressLabel(lbl)}
                    className={`rounded-lg text-xs font-bold transition-all ${
                      newAddressLabel === lbl
                        ? "bg-[#FAF6F0] text-[#C9A46A] shadow-2xs border border-[#E8DCC3]"
                        : "text-[#5A5146] hover:text-[#1F1D1A]"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            {/* Street Address */}
            <div className="space-y-1.5">
              <Label htmlFor="newStreet" className="text-xs font-bold text-[#1F1D1A]">Street Address</Label>
              <Input
                id="newStreet"
                placeholder="e.g. 500 Madison Avenue, Floor 12"
                value={newAddressStreet}
                onChange={(e) => setNewAddressStreet(e.target.value)}
                className="h-9.5 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A]"
                required
              />
            </div>

            {/* City State Zip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="newCity" className="text-xs font-bold text-[#1F1D1A]">City</Label>
                <Input
                  id="newCity"
                  placeholder="Manhattan"
                  value={newAddressCity}
                  onChange={(e) => setNewAddressCity(e.target.value)}
                  className="h-9.5 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A]"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newState" className="text-xs font-bold text-[#1F1D1A]">State</Label>
                <Input
                  id="newState"
                  placeholder="NY"
                  value={newAddressState}
                  onChange={(e) => setNewAddressState(e.target.value)}
                  className="h-9.5 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A] text-center"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newZip" className="text-xs font-bold text-[#1F1D1A]">ZIP Code</Label>
                <Input
                  id="newZip"
                  placeholder="400001"
                  maxLength={6}
                  pattern="\d{6}"
                  title="PIN code must be 6 digits"
                  value={newAddressZip}
                  onChange={(e) => setNewAddressZip(e.target.value)}
                  className="h-9.5 border-[#E8DCC3] focus-visible:ring-2 focus-visible:ring-[#C9A46A]/20 focus-visible:border-[#C9A46A] rounded-xl text-xs bg-white text-[#1F1D1A] text-center"
                  required
                />
              </div>
            </div>

            <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddAddressOpen(false)}
                className="rounded-xl border-[#E8DCC3] bg-[#FAF6F0] text-[#5A5146] hover:bg-[#F0E7D5] text-xs h-9.5 w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="rounded-xl bg-[#C9A46A] hover:bg-[#b89359] text-white font-bold text-xs h-9.5 px-6 w-full sm:w-auto border border-[#E8DCC3]"
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
