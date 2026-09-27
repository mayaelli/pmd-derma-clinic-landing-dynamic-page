"use client";

import { useState, useEffect } from "react";
import {
  User,
  GraduationCap,
  Award,
  Clock,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Building2,
  Upload,
  Sparkles,
  Edit,
  X,
  Stethoscope,
  Star,
  Loader2,
} from "lucide-react";
import {
  fetchDoctors,
  saveDoctor,
  deleteDoctor,
  uploadDoctorImage,
  fetchClinicInfo,
  updateClinicInfo,
  type Doctor,
} from "@/lib/doctorActions";

interface ScheduleDay {
  day: string;
  active: boolean;
  startTime: string;
  endTime: string;
}

interface AboutHeroSection {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
}

interface DoctorProfile {
  name: string;
  title: string;
  licenseNumber: string;
  experienceYears: number;
  bio: string;
  avatarUrl: string;
  specialties: string[];
  credentials: string[];
  schedule: ScheduleDay[];
}

const INITIAL_HERO: AboutHeroSection = {
  title: "Welcome to Precious MD Dermatology",
  subtitle: "Dedicated to your skin's natural radiance and health.",
  description:
    "We blend clinical dermatology with advanced aesthetic technology to offer safe, personalized treatments. Our practice is built on trust, medical excellence, and compassionate patient care.",
  imageUrl: "/precious-md-counter-full.png",
};

const INITIAL_PROFILE: DoctorProfile = {
  name: "Dr. Precious Martinez, MD",
  title: "Board Certified Dermatologist & Aesthetic Specialist",
  licenseNumber: "PRC-0149204",
  experienceYears: 12,
  bio: "Specializing in non-invasive skin rejuvenation, corrective clinical dermatology, and personalized aesthetic care with over a decade of clinical excellence.",
  avatarUrl: "",
  specialties: [
    "Clinical Dermatology",
    "Laser Therapeutics",
    "Anti-Aging Medicine",
    "Acne & Scar Reconstruction",
  ],
  credentials: [
    "Diplomate, Philippine Dermatological Society",
    "Fellow, American Academy of Dermatology (FAAD)",
    "MD, University of Santo Tomas Faculty of Medicine & Surgery",
  ],
  schedule: [
    { day: "Monday", active: true, startTime: "09:00", endTime: "17:00" },
    { day: "Tuesday", active: true, startTime: "09:00", endTime: "17:00" },
    { day: "Wednesday", active: true, startTime: "09:00", endTime: "17:00" },
    { day: "Thursday", active: true, startTime: "09:00", endTime: "17:00" },
    { day: "Friday", active: true, startTime: "09:00", endTime: "16:00" },
    { day: "Saturday", active: false, startTime: "10:00", endTime: "14:00" },
    { day: "Sunday", active: false, startTime: "09:00", endTime: "12:00" },
  ],
};

export function DoctorManagement() {
  const [hero, setHero] = useState<AboutHeroSection>(INITIAL_HERO);
  const [profile, setProfile] = useState<DoctorProfile>(INITIAL_PROFILE);
  const [newSpecialty, setNewSpecialty] = useState("");
  const [newCredential, setNewCredential] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clinicInfoId, setClinicInfoId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [togglingHeroId, setTogglingHeroId] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);

  // Doctor list from database
  const [doctorList, setDoctorList] = useState<Doctor[]>([]);

  // Load data on mount
  useEffect(() => {
    loadDatabaseData();
  }, []);

  const loadDatabaseData = async () => {
    try {
      setLoading(true);

      const clinicInfo = await fetchClinicInfo();
      console.log('🔍 Loaded clinic info:', clinicInfo); // Debug log

      if (clinicInfo) {
        setClinicInfoId(clinicInfo.id || null);
        setHero({
          title: "Welcome to Precious MD Dermatology",
          subtitle: clinicInfo.mission_statement || INITIAL_HERO.subtitle,
          description: clinicInfo.clinic_description || INITIAL_HERO.description,
          imageUrl: clinicInfo.image_url || INITIAL_HERO.imageUrl,
        });
        console.log('✅ Hero set with imageUrl:', clinicInfo.image_url); // Debug log
      }

      const doctors = await fetchDoctors();
      setDoctorList(doctors);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hero Handlers
  const handleHeroChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setHero((prev) => ({ ...prev, [name]: value }));
  };

  // Doctor Avatar Upload
  const handleDoctorAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const imageUrl = await uploadDoctorImage(file);
      if (imageUrl) {
        setProfile((prev) => ({ ...prev, avatarUrl: imageUrl }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Profile Handlers
  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSpecialty = () => {
    if (!newSpecialty.trim()) return;
    setProfile((prev) => ({
      ...prev,
      specialties: [...prev.specialties, newSpecialty.trim()],
    }));
    setNewSpecialty("");
  };

  const handleRemoveSpecialty = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index),
    }));
  };

  const handleAddCredential = () => {
    if (!newCredential.trim()) return;
    setProfile((prev) => ({
      ...prev,
      credentials: [...prev.credentials, newCredential.trim()],
    }));
    setNewCredential("");
  };

  const handleRemoveCredential = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      credentials: prev.credentials.filter((_, i) => i !== index),
    }));
  };

  const handleScheduleToggle = (index: number) => {
    setProfile((prev) => {
      const updatedSchedule = [...prev.schedule];
      updatedSchedule[index] = {
        ...updatedSchedule[index],
        active: !updatedSchedule[index].active,
      };
      return { ...prev, schedule: updatedSchedule };
    });
  };

  const handleTimeChange = (
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setProfile((prev) => {
      const updatedSchedule = [...prev.schedule];
      updatedSchedule[index] = {
        ...updatedSchedule[index],
        [field]: value,
      };
      return { ...prev, schedule: updatedSchedule };
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDoctorId(null);
    resetForm();
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      // Only include fields that exist in the database
      const doctorData: Partial<Doctor> = {
        name: profile.name,
        title_role: profile.title,
        bio: profile.bio,
        image_url: profile.avatarUrl,
        credentials: profile.credentials,
        is_featured: false,
        display_order: doctorList.length,
      };

      // Only add id if editing existing doctor
      if (editingDoctorId) {
        doctorData.id = editingDoctorId;
      }

      await saveDoctor(doctorData);

      await loadDatabaseData();

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        closeModal();
      }, 1200);
    } catch (error) {
      console.error("Error saving doctor:", error);
      alert("Failed to save doctor profile.");
    } finally {
      setSaving(false);
    }
  };

  // Save Hero / Clinic Info
  const handleSaveClinicInfo = async () => {
    try {
      setSaving(true);
      if (clinicInfoId) {
        await updateClinicInfo(clinicInfoId, {
          mission_statement: hero.subtitle,
          clinic_description: hero.description,
          image_url: hero.imageUrl,
        });
      }

      // Reload data from database to reflect changes
      await loadDatabaseData();

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error("Error saving clinic info:", error);
      alert("Failed to save clinic information.");
    } finally {
      setSaving(false);
    }
  };

  const openAddNewModal = () => {
    resetForm();
    setEditingDoctorId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (doctor: Doctor & Record<string, any>) => {
    setProfile({
      name: doctor.name || "",
      title: doctor.title_role || "",
      licenseNumber: doctor.license_number || doctor.licenseNumber || "PRC-0149204",
      experienceYears: doctor.experience_years || doctor.experienceYears || 12,
      bio: doctor.bio || "",
      avatarUrl: doctor.image_url || "",
      specialties: doctor.specialties || INITIAL_PROFILE.specialties,
      credentials: doctor.credentials || INITIAL_PROFILE.credentials,
      schedule: doctor.schedule || INITIAL_PROFILE.schedule,
    });
    setEditingDoctorId(doctor.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this doctor profile?")) return;

    try {
      await deleteDoctor(id);
      await loadDatabaseData();
    } catch (error) {
      console.error("Error deleting doctor:", error);
      alert("Failed to delete doctor.");
    }
  };

  const handleSetHero = async (doctor: Doctor) => {
    if (doctor.is_featured) return; // already hero, nothing to do
    setTogglingHeroId(doctor.id);
    try {
      // Set all others to false first, then set this one to true
      await Promise.all(
        doctorList.map((d) =>
          saveDoctor({ ...d, is_featured: d.id === doctor.id })
        )
      );
      await loadDatabaseData();
    } catch (error) {
      console.error("Error setting hero doctor:", error);
      alert("Failed to update hero doctor.");
    } finally {
      setTogglingHeroId(null);
    }
  };

  const resetForm = () => {
    setProfile(INITIAL_PROFILE);
    setNewSpecialty("");
    setNewCredential("");
  };

  return (
    <div className="space-y-5">
      {/* Top Banner Header */}
      <div className="bg-white border border-[#F2ECE4] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FCE8E6] border border-[#F2ECE4] flex items-center justify-center text-[#C88482]">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-semibold text-base text-[#333D29]">
              Doctor & Clinic Management
            </h1>
            <p className="text-[10px] text-[#738285]">
              Manage doctor profiles, credentials & hero content
            </p>
          </div>
        </div>

        <button
          onClick={openAddNewModal}
          className="inline-flex items-center justify-center gap-2 bg-[#CD9581] hover:bg-[#b57371] text-white px-5 py-2 rounded-xl font-semibold text-xs transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Doctor</span>
        </button>
      </div>

      {/* Hero Section Management */}
      <div className="bg-white border border-[#F2ECE4] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#F2ECE4] pb-3">
          <Sparkles className="w-4 h-4 text-[#C88482]" />
          <div>
            <h2 className="font-semibold text-sm text-[#333D29]">
              About Us Hero Section
            </h2>
            <p className="text-[10px] text-[#738285]">
              Public website hero content and showcase image
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-semibold text-[#556365] uppercase tracking-wider mb-1">
                Mission Statement / Subtitle
              </label>
              <input
                type="text"
                name="subtitle"
                value={hero.subtitle}
                onChange={handleHeroChange}
                className="w-full bg-[#FDFBF7] border border-[#F2ECE4] rounded-xl px-3 py-2 text-xs text-[#333D29] focus:outline-none focus:ring-2 focus:ring-[#CD9581]/20 focus:border-[#CD9581] transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#556365] uppercase tracking-wider mb-1">
                Clinic Description
              </label>
              <textarea
                name="description"
                rows={6}
                value={hero.description}
                onChange={handleHeroChange}
                className="w-full bg-[#FDFBF7] border border-[#F2ECE4] rounded-xl p-3 text-xs text-[#333D29] focus:outline-none focus:ring-2 focus:ring-[#CD9581]/20 focus:border-[#CD9581] transition-all resize-y"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveClinicInfo}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 bg-[#CD9581] hover:bg-[#b57371] text-white px-4 py-2 rounded-xl font-semibold text-xs transition-all shadow-xs active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Clinic Info</span>
                </>
              )}
            </button>
          </div>

          {/* Static Hero Image */}

        </div>
      </div>

      {/* Doctor List */}
      <div className="bg-white border border-[#F2ECE4] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#F2ECE4] pb-3">
          <User className="w-4 h-4 text-[#C88482]" />
          <h2 className="font-semibold text-sm text-[#333D29]">
            Doctor Profiles
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-[#CD9581] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-[#738285]">Loading doctors...</p>
          </div>
        ) : doctorList.length === 0 ? (
          <div className="text-center py-12 text-[#738285]">
            <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No doctors added yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...doctorList]
              .sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0))
              .map((doctor) => (
                <div
                  key={doctor.id}
                  className={`bg-[#FDFBF7] border rounded-xl p-4 hover:shadow-md transition-all ${doctor.is_featured
                      ? "border-[#C87D87] bg-[#FFF8F6] ring-1 ring-[#C87D87]/20"
                      : "border-[#F2ECE4]"
                    }`}
                >
                  {/* Hero badge */}
                  {doctor.is_featured && (
                    <div className="flex items-center gap-1.5 mb-3 px-2 py-1 bg-[#FCE8E6] rounded-lg w-fit">
                      <Star className="w-3 h-3 text-[#C87D87] fill-[#C87D87]" />
                      <span className="text-[10px] font-bold text-[#C87D87] uppercase tracking-wider">
                        Hero / Featured
                      </span>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-white border-2 border-[#F2ECE4] shrink-0">
                      {doctor.image_url ? (
                        <img
                          src={doctor.image_url}
                          alt={doctor.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-7 h-7 text-[#C88482]" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-[#333D29] truncate">
                        {doctor.name}
                      </h3>
                      <p className="text-[10px] text-[#738285] mt-0.5 line-clamp-2">
                        {doctor.title_role}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-3 border-t border-[#F2ECE4]">
                    {/* Set as Hero toggle */}
                    <button
                      type="button"
                      onClick={() => handleSetHero(doctor)}
                      disabled={doctor.is_featured || togglingHeroId === doctor.id}
                      title={doctor.is_featured ? "Already set as hero" : "Set as hero / featured doctor"}
                      className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer border disabled:cursor-not-allowed ${doctor.is_featured
                          ? "bg-[#FCE8E6] border-[#C87D87]/30 text-[#C87D87]"
                          : "bg-white border-[#F2ECE4] hover:border-[#C87D87] hover:bg-[#FCE8E6] hover:text-[#C87D87] text-[#738285]"
                        }`}
                    >
                      {togglingHeroId === doctor.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Star className={`w-3 h-3 ${doctor.is_featured ? "fill-[#C87D87]" : ""}`} />
                      )}
                      {doctor.is_featured ? "Hero" : "Set Hero"}
                    </button>

                    <button
                      onClick={() => openEditModal(doctor)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-[#F2ECE4] hover:border-[#CD9581] hover:bg-[#CD9581] hover:text-white text-[#556365] rounded-lg text-[10px] font-semibold transition-all cursor-pointer"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(doctor.id)}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-[#F2ECE4] hover:border-red-500 hover:bg-red-500 hover:text-white text-red-500 rounded-lg text-[10px] font-semibold transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Doctor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-2xl border border-[#F2ECE4] w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#F2ECE4] px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="font-semibold text-lg text-[#333D29]">
                  {editingDoctorId ? "Edit Doctor Profile" : "Add New Doctor"}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-[#738285] hover:text-[#333D29] hover:bg-[#FDFBF7] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="flex items-center gap-4 p-3 bg-[#FDFBF7] border border-[#F2ECE4] rounded-xl">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-[#F2ECE4] flex items-center justify-center shrink-0">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-[#C88482]" />
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-semibold text-[#556365] uppercase tracking-wider">
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer bg-[#CD9581] hover:bg-[#b57371] text-white px-3 py-1.5 rounded-lg text-[10px] font-semibold shadow-xs transition-all inline-flex items-center gap-1">
                      {uploadingImage ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3 h-3" />
                          <span>{profile.avatarUrl ? "Change Photo" : "Upload Photo"}</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleDoctorAvatarUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>

                    {profile.avatarUrl && !uploadingImage && (
                      <button
                        type="button"
                        onClick={() => setProfile((prev) => ({ ...prev, avatarUrl: "" }))}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-[#556365] uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="w-full bg-[#FDFBF7] border border-[#F2ECE4] rounded-xl px-3 py-2 text-xs text-[#333D29] focus:outline-none focus:border-[#CD9581]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[#556365] uppercase tracking-wider mb-1">
                    Title / Role
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={profile.title}
                    onChange={handleProfileChange}
                    className="w-full bg-[#FDFBF7] border border-[#F2ECE4] rounded-xl px-3 py-2 text-xs text-[#333D29] focus:outline-none focus:border-[#CD9581]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[#556365] uppercase tracking-wider mb-1">
                    License Number
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={profile.licenseNumber}
                    onChange={handleProfileChange}
                    className="w-full bg-[#FDFBF7] border border-[#F2ECE4] rounded-xl px-3 py-2 text-xs text-[#333D29] focus:outline-none focus:border-[#CD9581]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[#556365] uppercase tracking-wider mb-1">
                    Years Experience
                  </label>
                  <input
                    type="number"
                    name="experienceYears"
                    value={profile.experienceYears}
                    onChange={handleProfileChange}
                    className="w-full bg-[#FDFBF7] border border-[#F2ECE4] rounded-xl px-3 py-2 text-xs text-[#333D29] focus:outline-none focus:border-[#CD9581]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#556365] uppercase tracking-wider mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  value={profile.bio}
                  onChange={handleProfileChange}
                  className="w-full bg-[#FDFBF7] border border-[#F2ECE4] rounded-xl p-3 text-xs text-[#333D29] focus:outline-none focus:border-[#CD9581]"
                />
              </div>

              {/* Specialties & Credentials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#F2ECE4]">
                    <Stethoscope className="w-4 h-4 text-[#C88482]" />
                    <h3 className="font-semibold text-sm text-[#333D29]">Specialties</h3>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSpecialty())}
                      placeholder="Add Specialty"
                      className="flex-1 bg-[#FDFBF7] border border-[#F2ECE4] rounded-xl px-3 py-1.5 text-xs text-[#333D29]"
                    />
                    <button
                      type="button"
                      onClick={handleAddSpecialty}
                      className="bg-[#FDFBF7] hover:bg-[#F3EFEA] text-[#333D29] p-2 rounded-xl border border-[#F2ECE4]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {profile.specialties.map((spec, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-[#FDFBF7] border border-[#F2ECE4] px-2.5 py-1 rounded-full text-[10px] font-semibold"
                      >
                        {spec}
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecialty(index)}
                          className="hover:text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#F2ECE4]">
                    <GraduationCap className="w-4 h-4 text-[#C88482]" />
                    <h3 className="font-semibold text-sm text-[#333D29]">Credentials</h3>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCredential}
                      onChange={(e) => setNewCredential(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCredential())}
                      placeholder="Add Credential"
                      className="flex-1 bg-[#FDFBF7] border border-[#F2ECE4] rounded-xl px-3 py-1.5 text-xs text-[#333D29]"
                    />
                    <button
                      type="button"
                      onClick={handleAddCredential}
                      className="bg-[#FDFBF7] hover:bg-[#F3EFEA] text-[#333D29] p-2 rounded-xl border border-[#F2ECE4]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <ul className="space-y-1.5">
                    {profile.credentials.map((cred, index) => (
                      <li
                        key={index}
                        className="flex items-start justify-between gap-2 p-2 bg-[#FDFBF7] border border-[#F2ECE4] rounded-xl text-[10px]"
                      >
                        <div className="flex items-start gap-1.5">
                          <Award className="w-3.5 h-3.5 text-[#C88482] shrink-0 mt-0.5" />
                          <span>{cred}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCredential(index)}
                          className="text-[#738285] hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Consultation Hours */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#F2ECE4]">
                  <Clock className="w-4 h-4 text-[#C88482]" />
                  <h3 className="font-semibold text-sm text-[#333D29]">
                    Consultation Hours
                  </h3>
                </div>

                <div className="grid grid-cols-1 divide-y divide-[#F2ECE4]">
                  {profile.schedule.map((item, index) => (
                    <div
                      key={item.day}
                      className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 w-32">
                        <input
                          type="checkbox"
                          checked={item.active}
                          onChange={() => handleScheduleToggle(index)}
                          className="w-3.5 h-3.5 accent-[#CD9581] cursor-pointer"
                        />
                        <span className="text-xs font-medium">{item.day}</span>
                      </div>

                      {item.active ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={item.startTime}
                            onChange={(e) =>
                              handleTimeChange(index, "startTime", e.target.value)
                            }
                            className="bg-[#FDFBF7] border border-[#F2ECE4] rounded-lg px-2.5 py-1 text-[10px]"
                          />
                          <span className="text-[10px]">to</span>
                          <input
                            type="time"
                            value={item.endTime}
                            onChange={(e) =>
                              handleTimeChange(index, "endTime", e.target.value)
                            }
                            className="bg-[#FDFBF7] border border-[#F2ECE4] rounded-lg px-2.5 py-1 text-[10px]"
                          />
                        </div>
                      ) : (
                        <span className="text-[10px] text-[#738285] italic">Day Off</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F2ECE4]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2 text-[#556365] hover:bg-[#FDFBF7] rounded-xl font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 bg-[#CD9581] hover:bg-[#b57371] text-white px-6 py-2 rounded-xl font-semibold text-xs cursor-pointer disabled:opacity-60"
                >
                  {saving ? "Saving..." : saveSuccess ? "Saved!" : editingDoctorId ? "Update Doctor" : "Add Doctor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}