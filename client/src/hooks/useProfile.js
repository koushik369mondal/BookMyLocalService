import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";

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

export const getProfileCompletion = (user) => {
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

export function useProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading, logout, reloadUser } = useAuth();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && ["details", "addresses"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUpgradingRole, setIsUpgradingRole] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState("Home");
  const [newAddressStreet, setNewAddressStreet] = useState("");
  const [newAddressCity, setNewAddressCity] = useState("");
  const [newAddressState, setNewAddressState] = useState("");
  const [newAddressZip, setNewAddressZip] = useState("");

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

      if (user.address && user.city) {
        setAddresses([
          {
            id: "default-1",
            label: "Primary Address",
            street: user.address,
            city: user.city,
            state: user.state || "NY",
            zipCode: user.zipCode || "10001",
            isDefault: true
          }
        ]);
      }
    }
  }, [user, resetProfileForm]);

  const handleUpgradeToProvider = async () => {
    setIsUpgradingRole(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await authService.updateProfile({ role: "PROVIDER" });
      await reloadUser();
      setSuccessMsg("Congratulations! Your account has been switched to a Service Provider account. Redirecting to Provider Dashboard...");
      setTimeout(() => {
        navigate("/provider/dashboard");
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || "Failed to switch account to Provider.");
    } finally {
      setIsUpgradingRole(false);
    }
  };

  const handleSwitchToCustomer = async () => {
    setIsUpgradingRole(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await authService.updateProfile({ role: "CUSTOMER" });
      await reloadUser();
      setSuccessMsg("Your account has been switched to a Customer account. Redirecting to Customer Dashboard...");
      setTimeout(() => {
        navigate("/customer/dashboard");
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || "Failed to switch account to Customer.");
    } finally {
      setIsUpgradingRole(false);
    }
  };

  const onProfileSave = async (data) => {
    setIsSavingDetails(true);
    setErrorMsg("");
    setSuccessMsg("");

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
      setSuccessMsg("Profile details updated successfully!");
    } catch (err) {
      console.error("Update profile error:", err);
      setErrorMsg(err.message || "Failed to update profile.");
    } finally {
      setIsSavingDetails(false);
    }
  };

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await authService.uploadAvatar(formData);
      if (res.success) {
        await reloadUser();
        setSuccessMsg("Avatar uploaded successfully!");
      }
    } catch (err) {
      console.error("Avatar upload error:", err);
      setErrorMsg(err.message || "Failed to upload profile photo.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddressStreet.trim() || !newAddressCity.trim()) return;

    const newAdd = {
      id: Date.now().toString(),
      label: newAddressLabel.trim() || "Address",
      street: newAddressStreet.trim(),
      city: newAddressCity.trim(),
      state: newAddressState.trim() || "NY",
      zipCode: newAddressZip.trim() || "10001",
      isDefault: addresses.length === 0
    };

    setAddresses([...addresses, newAdd]);
    setNewAddressLabel("Home");
    setNewAddressStreet("");
    setNewAddressCity("");
    setNewAddressState("");
    setNewAddressZip("");
    setIsAddAddressOpen(false);
    setSuccessMsg("New address added locally!");
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
  };

  return {
    user,
    authLoading,
    activeTab,
    setActiveTab,
    successMsg,
    errorMsg,
    isSavingDetails,
    isUploadingPhoto,
    isUpgradingRole,
    fileInputRef,
    addresses,
    isAddAddressOpen,
    setIsAddAddressOpen,
    newAddressLabel,
    setNewAddressLabel,
    newAddressStreet,
    setNewAddressStreet,
    newAddressCity,
    setNewAddressCity,
    newAddressState,
    setNewAddressState,
    newAddressZip,
    setNewAddressZip,
    regProfile,
    handleProfileSubmit: handleProfileSubmit(onProfileSave),
    profileErrors,
    handleUpgradeToProvider,
    handleSwitchToCustomer,
    handleAvatarFileChange,
    handleAddAddress,
    handleDeleteAddress,
    handleSetDefaultAddress,
    logout
  };
}
