"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Stethoscope,
  Tag,
  MessageSquare,
  Calendar,
  Menu,
  X,
  UserCheck,
  ShieldCheck,
  Film,
} from "lucide-react";

import {
  addPromo, updatePromo, deletePromo, listPromos,
  type PromoRecord,
} from "./actions";

import {
  addReel, updateReel, deleteReel, listReels,
  type ReelRecord,
  type AddReelPayload,
} from "../reels/actions";

import { DeleteModal } from "../../../components/admin/DeleteModal";
import { Sidebar, type TabType } from "../../../components/admin/Sidebar";
import { Header } from "../../../components/admin/Header";
import { ServiceForm, ServiceFormData } from "../../../components/admin/ServiceForm";
import { ServiceList, SubcategoryRecord, ServiceItemRecord } from "../../../components/admin/ServiceList";
import { PromoForm } from "../../../components/admin/PromoForm";
import { PromoList } from "../../../components/admin/PromoList";
import { ReelForm, type ReelFormData } from "../../../components/admin/ReelForm";
import { ReelList } from "../../../components/admin/ReelList";
import { BookingList } from "../../../components/admin/BookingList";
import { ReviewManagement } from "@/components/admin/ReviewManagement";
import { DoctorManagement } from "@/components/admin/DoctorManagement";
import { MobileBlocker } from "@/components/admin/MobileBlocker";
import { createClient } from "@/lib/supabase/client";

const EMPTY_PROMO_FORM = {
  title: "",
  subtitle: "",
  badge: "20% OFF",
  validity: "Limited Time",
  validUntil: "",
  pubmatImage: "",
  items: [{ name: "", sessions: "1 session", price: "", originalPrice: "" }],
};

const EMPTY_REEL_FORM: ReelFormData = {
  title: "",
  description: "",
  videoUrl: "",
  category: "",
  duration: "",
};

export default function CoreContentAdmin() {
  const [activeTab, setActiveTab] = useState<TabType>("bookings");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Database / Service States
  const [dbCategories, setDbCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [subcategoriesList, setSubcategoriesList] = useState<SubcategoryRecord[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: "subcategory" | "service"; name: string } | null>(null);

  // Form & Edit States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingType, setEditingType] = useState<"subcategory" | "service" | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [serviceForm, setServiceForm] = useState<ServiceFormData>({
    formMode: "subcategory",
    category_id: "",
    sub_title: "",
    sub_description: "",
    sub_badge_text: "",
    subcategory_id: "",
    name: "",
    price_text: "",
    note: "",
    bento_slot: null,
    bento_title: "",
  });

  // Promo list state
  const [promoList, setPromoList] = useState<PromoRecord[]>([]);
  const [promoListLoading, setPromoListLoading] = useState(false);
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);
  const [promoDeleteTarget, setPromoDeleteTarget] = useState<PromoRecord | null>(null);
  const [promoForm, setPromoForm] = useState(EMPTY_PROMO_FORM);

  // Reel list state
  const [reelList, setReelList] = useState<ReelRecord[]>([]);
  const [reelListLoading, setReelListLoading] = useState(false);
  const [editingReelId, setEditingReelId] = useState<string | null>(null);
  const [reelDeleteTarget, setReelDeleteTarget] = useState<ReelRecord | null>(null);
  const [reelForm, setReelForm] = useState<ReelFormData>(EMPTY_REEL_FORM);

  const supabase = createClient();

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Fetch Categories & Nested Subcategories/Services from Supabase
  const fetchServices = useCallback(async () => {
    setListLoading(true);
    try {
      const { data: catData } = await supabase.from("categories").select("id, name, slug").order("created_at");
      if (catData) setDbCategories(catData);

      const { data: subData } = await supabase
        .from("subcategories")
        .select(`
          id,
          category_id,
          title,
          description,
          badge_text,
          image_url,
          image_urls,
          bento_slot,
          bento_title,
          categories(name, slug),
          services(id, subcategory_id, name, price_text, note, bento_slot, bento_title, active)
        `)
        .order("created_at", { ascending: true });

      if (subData) {
        const formatted: SubcategoryRecord[] = subData.map((sub: any) => ({
          id: sub.id,
          category_id: sub.category_id,
          category_name: sub.categories?.name,
          category_slug: sub.categories?.slug,
          title: sub.title,
          description: sub.description,
          badge_text: sub.badge_text,
          image_url: sub.image_url,
          image_urls: Array.isArray(sub.image_urls) ? sub.image_urls : [],
          bento_slot: sub.bento_slot,
          bento_title: sub.bento_title,
          services: sub.services || [],
        }));
        setSubcategoriesList(formatted);
      }
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      setListLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (activeTab === "services") fetchServices();
  }, [activeTab, fetchServices]);

  const showSuccess = (msg: string) => {
    setStatusType("success");
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const showError = (msg: string) => {
    setStatusType("error");
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const resetServiceForm = () => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    // Preserve the current formMode when resetting
    const currentMode = serviceForm.formMode;

    setEditingId(null);
    setEditingType(null);
    setImageFile(null);
    setImagePreview(null);
    setServiceForm({
      formMode: currentMode, // Keep current mode (subcategory or service)
      category_id: dbCategories[0]?.id || "",
      sub_title: "",
      sub_description: "",
      sub_badge_text: "",
      subcategory_id: "", // Always reset to empty - user must choose
      name: "",
      price_text: "",
      note: "",
      bento_slot: null,
      bento_title: "",
      extraImageUrl2: "",
      extraImageUrl3: "",
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const startEditSubcategory = (sub: SubcategoryRecord) => {
    setEditingId(sub.id);
    setEditingType("subcategory");
    setImagePreview(sub.image_url || null);
    setServiceForm({
      formMode: "subcategory",
      category_id: sub.category_id,
      sub_title: sub.title,
      sub_description: sub.description || "",
      sub_badge_text: sub.badge_text || "",
      bento_slot: sub.bento_slot || null,
      bento_title: sub.bento_title || "",
      extraImageUrl2: Array.isArray(sub.image_urls) ? (sub.image_urls[0] || "") : "",
      extraImageUrl3: Array.isArray(sub.image_urls) ? (sub.image_urls[1] || "") : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEditService = (svc: ServiceItemRecord) => {
    setEditingId(svc.id);
    setEditingType("service");
    setServiceForm({
      formMode: "service",
      subcategory_id: svc.subcategory_id,
      name: svc.name,
      price_text: svc.price_text,
      note: svc.note || "",
      bento_slot: svc.bento_slot,
      bento_title: svc.bento_title || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation for service mode
    if (serviceForm.formMode === "service" && !serviceForm.subcategory_id) {
      showError("Please select a parent subcategory for this service.");
      return;
    }

    setLoading(true);
    try {
      if (serviceForm.formMode === "subcategory") {
        // Check for bento slot conflicts if slot is selected
        if (serviceForm.bento_slot) {
          // Build query to find conflicts
          let query = supabase
            .from("subcategories")
            .select("id, title")
            .eq("bento_slot", serviceForm.bento_slot);

          // Exclude current record if editing
          if (editingId) {
            query = query.neq("id", editingId);
          }

          const { data: existingBento, error: checkError } = await query.maybeSingle();

          if (checkError && checkError.code !== 'PGRST116') {
            // PGRST116 is "no rows returned" which is fine
            console.error("Bento conflict check error:", checkError);
            showError("Error checking for bento slot conflicts.");
            setLoading(false);
            return;
          }

          if (existingBento) {
            const userConfirm = window.confirm(
              `⚠️ Bento slot ${serviceForm.bento_slot} is already in use!\n\nCurrently used by: "${existingBento.title}"\n\nClick OK to move this slot to your new subcategory, or Cancel to choose a different slot.`
            );
            if (!userConfirm) {
              setLoading(false);
              return;
            }

            // Clear the other subcategory's bento slot
            const { error: clearError } = await supabase
              .from("subcategories")
              .update({ bento_slot: null, bento_title: null })
              .eq("id", existingBento.id);

            if (clearError) {
              console.error("Error clearing old bento slot:", clearError);
              showError("Failed to clear existing bento slot. Please try again.");
              setLoading(false);
              return;
            }

            console.log(`Cleared bento slot ${serviceForm.bento_slot} from "${existingBento.title}"`);
          }
        }

        let imageUrl = imagePreview;

        if (imageFile) {
          const fileExt = imageFile.name.split(".").pop();
          const fileName = `${Date.now()}.${fileExt}`;
          const { error: uploadErr } = await supabase.storage.from("procedure-images").upload(fileName, imageFile);
          if (uploadErr) throw uploadErr;

          const { data: publicUrlData } = supabase.storage.from("procedure-images").getPublicUrl(fileName);
          imageUrl = publicUrlData.publicUrl;
        }

        // ── Upload extra images (slots 2 & 3) from ServiceForm ──────────────
        const extraFiles = (window as any).__extraServiceImages as
          { file2: File | null; file3: File | null } | null;

        // Helper: upload one file and return its public URL
        const uploadExtra = async (file: File): Promise<string> => {
          const ext = file.name.split(".").pop();
          const name = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
          const { error: err } = await supabase.storage
            .from("procedure-images")
            .upload(name, file);
          if (err) throw err;
          const { data: u } = supabase.storage
            .from("procedure-images")
            .getPublicUrl(name);
          return u.publicUrl;
        };

        // Resolve final URLs for slots 2 & 3.
        // If a new File was chosen → upload it.
        // If the form value is a real URL (editing, kept old image) → keep it.
        // If empty/cleared → null (removed from array).
        const resolveSlot = async (
          file: File | null,
          formValue: string | undefined
        ): Promise<string | null> => {
          if (file) return uploadExtra(file);
          if (formValue && formValue !== "__new__" && formValue !== "")
            return formValue;
          return null;
        };

        const slot2Url = await resolveSlot(
          extraFiles?.file2 ?? null,
          serviceForm.extraImageUrl2
        );
        const slot3Url = await resolveSlot(
          extraFiles?.file3 ?? null,
          serviceForm.extraImageUrl3
        );

        const imageUrls = [slot2Url, slot3Url].filter(Boolean) as string[];

        const payload = {
          category_id: serviceForm.category_id,
          title: serviceForm.sub_title,
          description: serviceForm.sub_description,
          badge_text: serviceForm.sub_badge_text || null,
          image_url: imageUrl,
          image_urls: imageUrls,
          bento_slot: serviceForm.bento_slot,
          bento_title: serviceForm.bento_title || null,
        };

        if (editingId && editingType === "subcategory") {
          await supabase.from("subcategories").update(payload).eq("id", editingId);
          showSuccess("Subcategory updated.");
        } else {
          await supabase.from("subcategories").insert([payload]);
          showSuccess("New subcategory added.");
        }
      } else {
        // Service item payload - remove bento fields as they're on subcategory level
        const payload = {
          subcategory_id: serviceForm.subcategory_id,
          name: serviceForm.name,
          price_text: serviceForm.price_text,
          note: serviceForm.note || null,
        };

        if (editingId && editingType === "service") {
          await supabase.from("services").update(payload).eq("id", editingId);
          showSuccess("Service item updated.");
        } else {
          await supabase.from("services").insert([payload]);
          showSuccess("New service item added.");
        }
      }

      resetServiceForm();
      await fetchServices();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Action failed.";
      showError("Error: " + message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    try {
      const targetTable = deleteTarget.type === "subcategory" ? "subcategories" : "services";
      const { error } = await supabase.from(targetTable).delete().eq("id", deleteTarget.id);
      if (error) throw error;

      showSuccess(`"${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
      await fetchServices();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Deletion failed.";
      setDeleteTarget(null);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const refreshPromoList = useCallback(async () => {
    setPromoListLoading(true);
    try {
      const data = await listPromos();
      setPromoList(data);
    } catch {
      // silently fail
    } finally {
      setPromoListLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "promos") refreshPromoList();
  }, [activeTab, refreshPromoList]);

  // ── Reel data + handlers ─────────────────────────────────────────────────
  const refreshReelList = useCallback(async () => {
    setReelListLoading(true);
    try {
      const data = await listReels();
      setReelList(data);
    } catch {
      // silently fail
    } finally {
      setReelListLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "reels") refreshReelList();
  }, [activeTab, refreshReelList]);

  const resetReelForm = () => {
    setEditingReelId(null);
    setReelForm(EMPTY_REEL_FORM);
  };

  const startEditReel = (reel: ReelRecord) => {
    setEditingReelId(reel.id);
    setReelForm({
      title: reel.title,
      description: reel.description || "",
      videoUrl: reel.video_url,
      category: reel.category || "",
      duration: reel.duration || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reelForm.title.trim()) { showError("Title is required."); return; }
    if (!reelForm.videoUrl.trim()) { showError("A video file or URL is required."); return; }

    setLoading(true);
    try {
      const payload: AddReelPayload = {
        title: reelForm.title.trim(),
        description: reelForm.description.trim() || undefined,
        videoUrl: reelForm.videoUrl.trim(),
        category: reelForm.category.trim() || undefined,
        duration: reelForm.duration.trim() || undefined,
      };

      if (editingReelId) {
        await updateReel(editingReelId, payload);
        showSuccess("Reel updated.");
      } else {
        await addReel(payload);
        showSuccess("Reel published.");
      }

      resetReelForm();
      await refreshReelList();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Action failed.";
      showError("Error: " + message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReelConfirm = async () => {
    if (!reelDeleteTarget) return;
    setLoading(true);
    try {
      await deleteReel(reelDeleteTarget.id);
      showSuccess(`"${reelDeleteTarget.title}" deleted.`);
      setReelDeleteTarget(null);
      await refreshReelList();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Deletion failed.";
      showError("Error: " + message);
    } finally {
      setLoading(false);
    }
  };

  const parseItemsString = (itemsStr: string) => {
    if (!itemsStr) return [{ name: "", sessions: "1 session", price: "", originalPrice: "" }];
    return itemsStr.split(";").map((str) => {
      const [name, sessions, price, originalPrice] = str.split("|").map(p => p.trim());
      return {
        name: name || "",
        sessions: sessions || "1 session",
        price: price || "",
        originalPrice: originalPrice || "",
      };
    });
  };

  const startEditPromo = (rec: PromoRecord) => {
    setEditingPromoId(rec.id);
    setPromoForm({
      title: rec.title,
      subtitle: rec.subtitle || "",
      badge: rec.badge,
      validity: rec.validity,
      validUntil: rec.valid_until || "",
      pubmatImage: rec.pubmat_image || "",
      items: parseItemsString(rec.items),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetPromoForm = () => {
    setEditingPromoId(null);
    setPromoForm(EMPTY_PROMO_FORM);
  };

  const handlePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("=== PROMO SUBMIT DEBUG ===");
    console.log("Editing ID:", editingPromoId);
    console.log("Form Data:", promoForm);

    try {
      const sanitizedValidUntil =
        promoForm.validUntil && promoForm.validUntil.trim() !== ""
          ? promoForm.validUntil.trim()
          : null;

      const formattedItems = (promoForm.items || [])
        .filter((item) => item.name && item.name.trim().length > 0)
        .map((item) => {
          const parts = [
            item.name.trim(),
            item.sessions?.trim() || "1 session",
            item.price?.trim() || "",
          ];
          if (item.originalPrice?.trim()) {
            parts.push(item.originalPrice.trim());
          }
          return parts.join("|");
        })
        .join(";");

      const promoPayload = {
        title: promoForm.title,
        subtitle: promoForm.subtitle,
        badge: promoForm.badge,
        validity: promoForm.validity,
        validUntil: sanitizedValidUntil,
        pubmatImage: promoForm.pubmatImage,
        items: formattedItems,
      };

      console.log("Payload:", promoPayload);

      if (editingPromoId) {
        console.log("Calling updatePromo with ID:", editingPromoId);
        await updatePromo(editingPromoId, promoPayload);
        showSuccess("Promotion updated.");
      } else {
        console.log("Calling addPromo");
        await addPromo(promoPayload);
        showSuccess("Promotion published.");
      }

      resetPromoForm();
      await refreshPromoList();
      console.log("=== SUBMIT SUCCESS ===");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Action failed.";
      console.error("=== SUBMIT ERROR ===", err);
      alert("Error: " + message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePromoConfirm = async () => {
    if (!promoDeleteTarget) return;
    setLoading(true);
    try {
      await deletePromo(promoDeleteTarget.id);
      showSuccess(`Promotion "${promoDeleteTarget.title}" deleted.`);
      setPromoDeleteTarget(null);
      await refreshPromoList();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Deletion failed.";
      alert("Error: " + message);
    } finally {
      setLoading(false);
    }
  };

  const navigation = [
    { id: "bookings", name: "Appointments", icon: Calendar },
    { id: "services", name: "Services & Care", icon: Stethoscope },
    { id: "promos", name: "Promos & Offers", icon: Tag },
    { id: "reels", name: "Reels & Videos", icon: Film },
    { id: "doctor", name: "Doctor Profile", icon: UserCheck },
    { id: "reviews", name: "Patient Reviews", icon: MessageSquare },
  ] as const;

  return (
    <MobileBlocker>
      <div className="min-h-screen bg-[#FDFBF7] text-[#333D29] font-sans antialiased">
        {/* Mobile Bar */}
        <div className="md:hidden bg-white/90 backdrop-blur-md border-b border-[#F2ECE4] px-5 py-3.5 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FCE8E6] rounded-lg text-[#C88482]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-base text-[#333D29] block leading-none" style={{ fontFamily: 'Optima, sans-serif' }}>
                Precious MD
              </span>
              <span className="text-[10px] tracking-wider uppercase text-[#738285] font-medium">
                Clinical Workspace
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#738285] hover:text-[#333D29] bg-[#FDFBF7] rounded-lg transition-colors border border-[#F2ECE4]"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Desktop layout with fixed sidebar */}
        <div className="hidden md:flex h-screen overflow-hidden">
          <Sidebar
            navigation={navigation}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
          />

          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            <Header activeTab={activeTab} statusMessage={statusMessage} statusType={statusType} />

            <main className="p-4 sm:p-6 lg:p-8 w-full mx-auto space-y-6 max-w-7xl">
              {/* Main Workspace Tabs */}
              {activeTab === "doctor" && <DoctorManagement />}
              {activeTab === "bookings" && <BookingList />}

              {activeTab === "services" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-6 lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 scrollbar-thumb-rounded-full">
                    <ServiceForm
                      editingId={editingId}
                      editingType={editingType}
                      serviceForm={serviceForm}
                      setServiceForm={setServiceForm}
                      imagePreview={imagePreview}
                      imageFile={imageFile}
                      handleImageChange={handleImageChange}
                      handleSubmit={handleServiceSubmit}
                      resetForm={resetServiceForm}
                      loading={loading}
                      categories={dbCategories}
                      subcategories={subcategoriesList}
                    />
                  </div>
                  <div className="lg:col-span-6">
                    <ServiceList
                      categories={dbCategories}
                      subcategoriesList={subcategoriesList}
                      listLoading={listLoading}
                      editingId={editingId}
                      refreshList={fetchServices}
                      startEditSubcategory={startEditSubcategory}
                      startEditService={startEditService}
                      setDeleteTarget={setDeleteTarget}
                    />
                  </div>
                </div>
              )}

              {activeTab === "promos" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-5">
                    <PromoForm
                      promoForm={promoForm}
                      setPromoForm={setPromoForm}
                      handleSubmit={handlePromoSubmit}
                      loading={loading}
                      editingId={editingPromoId}
                      onCancel={resetPromoForm}
                    />
                  </div>
                  <div className="lg:col-span-7">
                    <PromoList
                      promoList={promoList}
                      listLoading={promoListLoading}
                      editingId={editingPromoId}
                      startEdit={startEditPromo}
                      setDeleteTarget={setPromoDeleteTarget}
                      onRefresh={refreshPromoList}
                    />
                  </div>
                </div>
              )}

              {activeTab === "reviews" && <ReviewManagement />}

              {activeTab === "reels" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-5 lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 scrollbar-thumb-rounded-full">
                    <ReelForm
                      reelForm={reelForm}
                      setReelForm={setReelForm}
                      handleSubmit={handleReelSubmit}
                      loading={loading}
                      editingId={editingReelId}
                      onCancel={resetReelForm}
                    />
                  </div>
                  <div className="lg:col-span-7">
                    <ReelList
                      reelList={reelList}
                      listLoading={reelListLoading}
                      editingId={editingReelId}
                      startEdit={startEditReel}
                      setDeleteTarget={setReelDeleteTarget}
                      onRefresh={refreshReelList}
                    />
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>

        {/* Modals */}
        {deleteTarget && (
          <DeleteModal
            service={{ id: deleteTarget.id, name: deleteTarget.name }}
            loading={loading}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
        {promoDeleteTarget && (
          <DeleteModal
            service={{ id: promoDeleteTarget.id, name: promoDeleteTarget.title }}
            loading={loading}
            onConfirm={handleDeletePromoConfirm}
            onCancel={() => setPromoDeleteTarget(null)}
          />
        )}
        {reelDeleteTarget && (
          <DeleteModal
            service={{ id: reelDeleteTarget.id, name: reelDeleteTarget.title }}
            loading={loading}
            onConfirm={handleDeleteReelConfirm}
            onCancel={() => setReelDeleteTarget(null)}
          />
        )}
      </div>
    </MobileBlocker>
  );
}