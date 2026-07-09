import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import MainLayout from "../../layouts/MainLayout";
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
  Building,
  Check,
  Briefcase
} from "lucide-react";

// Schema for profile validations
const editProfileSchema = z.object({
  fullName: z.string().min(2, { message: "Full Name must be at least 2 characters" }),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Please enter a valid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }).regex(/^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, {
    message: "Please enter a valid 10-digit phone number"
  }),
  dob: z.string().min(1, { message: "Date of Birth is required" }),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"], {
    errorMap: () => ({ message: "Please select your gender" })
  }),
  street: z.string().min(5, { message: "Street Address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zipCode: z.string().regex(/^\d{5}$/, { message: "ZIP Code must be a 5-digit number" })
});

export default function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Profile image upload preview state
  const [previewImage, setPreviewImage] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Submission messages
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: "Chloe Bennett",
      email: "chloe.bennett@example.com",
      phone: "555-019-2834",
      dob: "1998-04-18",
      gender: "female",
      street: "789 Pine Street, Apt 1C",
      city: "Brooklyn",
      state: "NY",
      zipCode: "11201"
    }
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploadingPhoto(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setIsUploadingPhoto(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const onProfileSave = async (data) => {
    setIsSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");

    // Simulate API update call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulated error check for manual testing
    if (data.fullName.toLowerCase().includes("error")) {
      setErrorMsg("Failed to save changes. Please check if your connection is stable.");
      setIsSubmitting(false);
    } else {
      setSuccessMsg("Changes saved successfully! Redirecting back to your profile...");
      setIsSubmitting(false);

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    }
  };

  return (
    <MainLayout>
      <div className="bg-slate-50/50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
        
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* TOP BACK LINK NAVIGATION */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)} 
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-550 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </button>
          </div>

          {/* EDIT CARD */}
          <Card className="border border-slate-100 shadow-md bg-white rounded-3xl overflow-hidden">
            
            {/* Header banner */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-650 to-indigo-750 text-white p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_50%)]"></div>
              <div className="relative z-10">
                <CardTitle className="text-xl sm:text-2xl font-black">Edit Account Profile</CardTitle>
                <CardDescription className="text-blue-100 text-xs sm:text-sm mt-1">Modify your contact variables, photo, and default settings</CardDescription>
              </div>
            </div>

            <CardContent className="p-6 sm:p-8 space-y-6">
              
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

              <form onSubmit={handleSubmit(onProfileSave)} className="space-y-6">
                
                {/* PHOTO UPLOAD BLOCK */}
                <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  
                  <div className="relative shrink-0">
                    <Avatar className="w-20 h-20 border-2 border-white shadow-md rounded-full overflow-hidden">
                      <AvatarImage src={previewImage} className="object-cover" />
                      <AvatarFallback className="text-xl font-bold bg-indigo-100 text-indigo-700">CB</AvatarFallback>
                    </Avatar>
                    
                    {/* Hidden File input */}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/*"
                    />

                    <button
                      type="button"
                      onClick={handlePhotoClick}
                      disabled={isUploadingPhoto || isSubmitting}
                      className="absolute bottom-0 right-0 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md cursor-pointer border border-white transition-transform hover:scale-105"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-center sm:text-left space-y-1">
                    <span className="text-xs font-bold text-slate-800 block">Profile Picture</span>
                    <p className="text-[10px] text-slate-450 leading-relaxed max-w-xs font-medium">
                      Supports JPG, PNG, or WEBP. Upload high-contrast square photos for better dispatcher visibility.
                    </p>
                  </div>

                </div>

                {/* FIELDS INPUTS */}
                <div className="space-y-4">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Basic Information</span>
                  
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-xs font-bold text-slate-700">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Chloe Bennett"
                      className={`h-10 border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl text-xs bg-white ${
                        errors.fullName ? "border-rose-350 focus:ring-rose-500" : ""
                      }`}
                      disabled={isSubmitting}
                      {...register("fullName")}
                    />
                    {errors.fullName && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.fullName.message}</p>}
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        className={`h-10 border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl text-xs bg-white ${
                          errors.email ? "border-rose-350 focus:ring-rose-500" : ""
                        }`}
                        disabled={isSubmitting}
                        {...register("email")}
                      />
                      {errors.email && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-bold text-slate-700">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="555-019-2834"
                        className={`h-10 border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl text-xs bg-white ${
                          errors.phone ? "border-rose-350 focus:ring-rose-500" : ""
                        }`}
                        disabled={isSubmitting}
                        {...register("phone")}
                      />
                      {errors.phone && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  {/* DOB & Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="dob" className="text-xs font-bold text-slate-700">Date of Birth</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-[50%] translate-y-[-50%] text-slate-400">
                          <Calendar className="h-4 w-4" />
                        </span>
                        <Input
                          id="dob"
                          type="date"
                          className={`pl-9 h-10 border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl text-xs bg-white ${
                            errors.dob ? "border-rose-350 focus:ring-rose-500" : ""
                          }`}
                          disabled={isSubmitting}
                          {...register("dob")}
                        />
                      </div>
                      {errors.dob && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.dob.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="gender" className="text-xs font-bold text-slate-700">Gender</Label>
                      <div className="relative">
                        <select
                          id="gender"
                          className={`w-full h-10 pl-3 pr-8 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl bg-white text-xs font-semibold text-slate-700 cursor-pointer appearance-none shadow-2xs ${
                            errors.gender ? "border-rose-350 focus:ring-rose-500" : ""
                          }`}
                          disabled={isSubmitting}
                          {...register("gender")}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                          <ChevronDown className="h-4 w-4 opacity-60" />
                        </div>
                      </div>
                      {errors.gender && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.gender.message}</p>}
                    </div>
                  </div>

                </div>

                {/* ADDRESS BLOCK */}
                <div className="space-y-4 border-t border-slate-100 pt-6">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Default Dispatch Address</span>
                  
                  {/* Street Address */}
                  <div className="space-y-1.5">
                    <Label htmlFor="street" className="text-xs font-bold text-slate-700">Street Address</Label>
                    <Input
                      id="street"
                      placeholder="789 Pine Street, Apt 1C"
                      className={`h-10 border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl text-xs bg-white ${
                        errors.street ? "border-rose-350 focus:ring-rose-500" : ""
                      }`}
                      disabled={isSubmitting}
                      {...register("street")}
                    />
                    {errors.street && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.street.message}</p>}
                  </div>

                  {/* City, State, Pincode/Zip */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="city" className="text-xs font-bold text-slate-700">City</Label>
                      <Input
                        id="city"
                        placeholder="Brooklyn"
                        className={`h-10 border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl text-xs bg-white ${
                          errors.city ? "border-rose-350 focus:ring-rose-500" : ""
                        }`}
                        disabled={isSubmitting}
                        {...register("city")}
                      />
                      {errors.city && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.city.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="state" className="text-xs font-bold text-slate-700">State</Label>
                      <Input
                        id="state"
                        placeholder="NY"
                        className={`h-10 border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl text-xs bg-white ${
                          errors.state ? "border-rose-350 focus:ring-rose-500" : ""
                        }`}
                        disabled={isSubmitting}
                        {...register("state")}
                      />
                      {errors.state && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.state.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="zipCode" className="text-xs font-bold text-slate-700">Pincode / ZIP</Label>
                      <Input
                        id="zipCode"
                        placeholder="11201"
                        maxLength={5}
                        className={`h-10 border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl text-xs bg-white ${
                          errors.zipCode ? "border-rose-350 focus:ring-rose-500" : ""
                        }`}
                        disabled={isSubmitting}
                        {...register("zipCode")}
                      />
                      {errors.zipCode && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.zipCode.message}</p>}
                    </div>
                  </div>

                </div>

                {/* BUTTONS PANEL */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3.5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/profile")}
                    disabled={isSubmitting}
                    className="border-slate-200 hover:bg-slate-50 text-slate-650 font-bold text-xs h-10 px-5 rounded-xl transition-all"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting || isUploadingPhoto}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 px-6 rounded-xl shadow-md flex items-center justify-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        Saving changes...
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

        </div>

      </div>
    </MainLayout>
  );
}

// Chevron selector icon
function ChevronDown(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
