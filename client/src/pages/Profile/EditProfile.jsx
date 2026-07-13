import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2, 
  Camera, 
  ArrowLeft,
  ChevronDown
} from "lucide-react";

// Schema for profile validations
const editProfileSchema = z.object({
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

export default function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user, loading: authLoading, reloadUser } = useAuth();

  // Profile image upload preview state
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(editProfileSchema),
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
      reset({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || ""
      });
    }
  }, [user, reset]);

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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
      }, 3050);
    }
  };

  const onProfileSave = async (data) => {
    setIsSubmitting(true);
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
      setSuccessMsg("Changes saved successfully! Redirecting back to your profile...");
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || "Failed to save profile changes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <DashboardLayout>
        <div className="min-h-[50vh] flex items-center justify-center bg-slate-50/50">
          <Loader2 className="h-8 w-8 animate-spin text-slate-900" />
        </div>
      </DashboardLayout>
    );
  }

  const initials = user.fullName ? user.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "?";

  return (
    <DashboardLayout>
      <div className="bg-slate-50/50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
        
        {/* Hidden File Picker Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/png, image/jpeg, image/jpg, image/webp" 
          onChange={handleFileChange} 
          className="hidden" 
        />

        <div className="max-w-3xl mx-auto space-y-6">
          
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)} 
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-550 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </button>
          </div>

          {successMsg && (
            <div className="flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl animate-fade-in shadow-2xs">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl animate-fade-in shadow-2xs">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <Card className="border border-slate-100 shadow-md bg-white rounded-3xl overflow-hidden">
            
            <div className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 text-white p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_50%)]"></div>
              <div className="relative z-10">
                <CardTitle className="text-xl sm:text-2xl font-black">Edit Account Profile</CardTitle>
                <CardDescription className="text-slate-300 text-xs sm:text-sm mt-1">Modify your contact variables, photo, and default settings</CardDescription>
              </div>
            </div>

            <CardContent className="p-6 sm:p-8 space-y-8">
              
              {/* Photo Display Upload section */}
              <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100">
                <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
                  <Avatar className="w-20 h-20 border-2 border-slate-100 shadow-md rounded-full overflow-hidden shrink-0">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} className="object-cover w-full h-full" />
                    ) : null}
                    <AvatarFallback className="text-xl font-bold bg-slate-900/10 text-slate-900">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-slate-950/60 text-white rounded-full flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera className="h-4.5 w-4.5" />
                    <span className="text-[8px] font-bold uppercase">Upload</span>
                  </div>
                </div>

                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Profile Avatar Picture</h4>
                  <p className="text-[11px] text-slate-400">Accepts JPG, PNG, or WebP formats under 5 MB max sizing</p>
                  
                  <div className="flex items-center gap-2.5 pt-2">
                    <Button 
                      type="button" 
                      onClick={handlePhotoClick}
                      disabled={isUploadingPhoto}
                      size="xs" 
                      className="bg-slate-900 hover:bg-slate-700 text-white rounded-xl text-[10px] font-bold h-8 px-4"
                    >
                      {isUploadingPhoto ? "Uploading..." : "Upload New Image"}
                    </Button>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onProfileSave)} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-xs font-bold text-slate-700">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Chloe Bennett"
                      className="h-10 border-slate-200 focus:ring-2 focus:ring-slate-900 rounded-xl text-xs bg-white"
                      disabled={isSubmitting}
                      {...register("fullName")}
                    />
                    {errors.fullName && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.fullName.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      className="h-10 border-slate-200 focus:ring-2 focus:ring-slate-900 rounded-xl text-xs bg-slate-50 cursor-not-allowed"
                      disabled
                      {...register("email")}
                    />
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <Label htmlFor="phone" className="text-xs font-bold text-slate-700">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="555-019-2834"
                      className="h-10 border-slate-200 focus:ring-2 focus:ring-slate-900 rounded-xl text-xs bg-white"
                      disabled={isSubmitting}
                      {...register("phone")}
                    />
                    {errors.phone && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.phone.message}</p>}
                  </div>

                </div>

                <div className="space-y-4 border-t border-slate-100 pt-6">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Default Dispatch Address</span>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="address" className="text-xs font-bold text-slate-700">Street Address</Label>
                    <Input
                      id="address"
                      placeholder="789 Pine Street, Apt 1C"
                      className="h-10 border-slate-200 focus:ring-2 focus:ring-slate-900 rounded-xl text-xs bg-white"
                      disabled={isSubmitting}
                      {...register("address")}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="city" className="text-xs font-bold text-slate-700">City</Label>
                      <Input
                        id="city"
                        placeholder="Brooklyn"
                        className="h-10 border-slate-200 focus:ring-2 focus:ring-slate-900 rounded-xl text-xs bg-white"
                        disabled={isSubmitting}
                        {...register("city")}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="state" className="text-xs font-bold text-slate-700">State</Label>
                      <Input
                        id="state"
                        placeholder="NY"
                        className="h-10 border-slate-200 focus:ring-2 focus:ring-slate-900 rounded-xl text-xs bg-white text-center"
                        disabled={isSubmitting}
                        {...register("state")}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="zipCode" className="text-xs font-bold text-slate-700">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        placeholder="400001"
                        maxLength={6}
                        className="h-10 border-slate-200 focus:ring-2 focus:ring-slate-900 rounded-xl text-xs bg-white text-center"
                        disabled={isSubmitting}
                        {...register("zipCode")}
                      />
                      {errors.zipCode && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.zipCode.message}</p>}
                    </div>
                  </div>

                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3.5">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => navigate(-1)}
                    className="rounded-xl border-0 text-slate-600 hover:bg-slate-50 text-xs font-bold h-10 px-6 cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-slate-900 hover:bg-slate-700 text-white font-bold text-xs h-10 px-8 rounded-xl shadow-xs"
                  >
                    {isSubmitting ? "Saving Changes..." : "Save Changes"}
                  </Button>
                </div>

              </form>
            </CardContent>

          </Card>

        </div>
      </div>
    </DashboardLayout>
  );
}
