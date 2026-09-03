"use client";

import { useState, useEffect, useCallback } from "react";
import { Stethoscope, Tag, MessageSquare, Sparkles, Menu, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import {
  addService, updateService, deleteService, listServices,
  addPromo, updatePromo, deletePromo, listPromos,
  addFeedback,
  type ServiceRecord,
  type PromoRecord,
} from "./actions";
import { SERVICE_CATEGORIES } from "@/config/clinicConfig";

import { DeleteModal } from "../../../components/admin/DeleteModal";
import { Sidebar } from "../../../components/admin/Sidebar";
import { Header } from "../../../components/admin/Header";
import { ServiceForm } from "../../../components/admin/ServiceForm";
import { ServiceList } from "../../../components/admin/ServiceList";
import { PromoForm } from "../../../components/admin/PromoForm";
import { PromoList } from "../../../components/admin/PromoList";
import { FeedbackForm } from "../../../components/admin/FeedbackForm";

const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  SERVICE_CATEGORIES.map(({ key, label }) => [key, label])
);

const EMPTY_SERVICE_FORM = {
  name: "",
  category: SERVICE_CATEGORIES[0].key,
  description: "",
};

const EMPTY_PROMO_FORM = {
  title: "",
  subtitle: "",
  badge: "20% OFF",
  validity: "Limited Time",
  validUntil: "",
  pubmatImage: "",
  items: [
    { name: "", sessions: "1 session", price: "", originalPrice: "" }
  ],
};

export default function CoreContentAdmin() {
  const [activeTab, setActiveTab] = useState<"services" | "promos" | "feedback">("services");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Service list state
  const [serviceList, setServiceList] = useState<ServiceRecord[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ServiceRecord | null>(null);

  // Service form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState(EMPTY_SERVICE_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Promo list & edit state
  const [promoList, setPromoList] = useState<PromoRecord[]>([]);
  const [promoListLoading, setPromoListLoading] = useState(false);
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);
  const [promoDeleteTarget, setPromoDeleteTarget] = useState<PromoRecord | null>(null);

  // Promo & Feedback form state
  const [promoForm, setPromoForm] = useState(EMPTY_PROMO_FORM);
  const [feedbackForm, setFeedbackForm] = useState({ patientName: "", treatmentTaken: "", rating: "5", comment: "" });

  // ─── SERVICES HANDLERS ──────────────────────────────────────────────────
  const refreshList = useCallback(async () => {
    setListLoading(true);
    try {
      const data = await listServices();
      setServiceList(data);
    } catch {
      // silently fail
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "services") refreshList();
  }, [activeTab, refreshList]);

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
    setEditingId(null);
    setExistingImageUrl(null);
    setServiceForm(EMPTY_SERVICE_FORM);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const startEdit = (rec: ServiceRecord) => {
    setEditingId(rec.id);
    setExistingImageUrl(rec.image_url);
    setServiceForm({ name: rec.name, category: rec.category, description: rec.description });
    setImageFile(null);
    setImagePreview(rec.image_url ?? null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", serviceForm.name);
      fd.append("category", serviceForm.category);
      fd.append("description", serviceForm.description);
      if (imageFile) fd.append("image", imageFile);

      if (editingId) {
        fd.append("id", editingId);
        fd.append("existingImageUrl", existingImageUrl ?? "");
        await updateService(fd);
        showSuccess("Service updated!");
      } else {
        await addService(fd);
        showSuccess("Service saved!");
      }

      resetServiceForm();
      await refreshList();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    const name = deleteTarget.name;
    const id = deleteTarget.id;
    try {
      await deleteService(id);
      setServiceList((prev) => prev.filter((s) => s.id !== id));
      setDeleteTarget(null);
      showSuccess(`"${name}" deleted.`);
      await refreshList();
    } catch (err: any) {
      setDeleteTarget(null);
      showError(err.message || "Failed to delete.");
      await refreshList();
    } finally {
      setLoading(false);
    }
  };

  // ─── PROMOS HANDLERS ───────────────────────────────────────────────────
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

  const parseItemsString = (itemsStr: string) => {
    if (!itemsStr) return [{ name: "", sessions: "1 session", price: "", originalPrice: "" }];
    return itemsStr.split("; ").map((str) => {
      const [name, sessions, price, originalPrice] = str.split(" | ");
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
          return parts.join(" | ");
        })
        .join("; ");

      const promoPayload = {
        title: promoForm.title,
        subtitle: promoForm.subtitle,
        badge: promoForm.badge,
        validity: promoForm.validity,
        validUntil: sanitizedValidUntil,
        pubmatImage: promoForm.pubmatImage,
        items: formattedItems,
      };

      if (editingPromoId) {
        await updatePromo(editingPromoId, promoPayload);
        showSuccess("Promo updated successfully!");
      } else {
        await addPromo(promoPayload);
        showSuccess("Promo published!");
      }

      resetPromoForm();
      await refreshPromoList();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePromoConfirm = async () => {
    if (!promoDeleteTarget) return;
    setLoading(true);
    try {
      await deletePromo(promoDeleteTarget.id);
      showSuccess(`Promo "${promoDeleteTarget.title}" deleted.`);
      setPromoDeleteTarget(null);
      await refreshPromoList();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── FEEDBACK HANDLERS ─────────────────────────────────────────────────
  const handleAddFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addFeedback({ ...feedbackForm, rating: Number(feedbackForm.rating) });
      setFeedbackForm({ patientName: "", treatmentTaken: "", rating: "5", comment: "" });
      showSuccess("Testimonial saved!");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const navigation = [
    { id: "services", name: "Services & Care", icon: Stethoscope },
    { id: "promos", name: "Promos & Offers", icon: Tag },
    { id: "feedback", name: "Patient Reviews", icon: MessageSquare },
  ] as const;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#333D29] font-sans flex flex-col md:flex-row antialiased">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white border-b border-[#F2ECE4] px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#FCE8E6] rounded-xl text-[#C88482]"><Sparkles className="w-4 h-4" /></div>
          <span className="font-serif font-bold text-base text-[#333D29]">Precious MD Admin</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-[#908A94] bg-[#F3EFEA] rounded-xl">
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <Sidebar
        navigation={navigation}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
        <Header activeTab={activeTab} statusMessage={statusMessage} statusType={statusType} />

        <main className="p-4 sm:p-6 lg:p-8 w-full mx-auto space-y-6 max-w-6xl">
          {activeTab === "services" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <ServiceForm
                editingId={editingId}
                serviceForm={serviceForm}
                setServiceForm={setServiceForm}
                imagePreview={imagePreview}
                imageFile={imageFile}
                handleImageChange={handleImageChange}
                handleSubmit={handleServiceSubmit}
                resetForm={resetServiceForm}
                loading={loading}
                categories={SERVICE_CATEGORIES}
              />
              <ServiceList
                serviceList={serviceList}
                listLoading={listLoading}
                editingId={editingId}
                categoryLabels={CATEGORY_LABEL}
                refreshList={refreshList}
                startEdit={startEdit}
                setDeleteTarget={setDeleteTarget}
              />
            </div>
          )}

          {activeTab === "promos" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <PromoForm
                promoForm={promoForm}
                setPromoForm={setPromoForm}
                handleSubmit={handlePromoSubmit}
                loading={loading}
                editingId={editingPromoId}
                onCancel={resetPromoForm}
              />
              <PromoList
                promoList={promoList}
                listLoading={promoListLoading}
                editingId={editingPromoId}
                startEdit={startEditPromo}
                setDeleteTarget={setPromoDeleteTarget}
                onRefresh={refreshPromoList}
              />
            </div>
          )}

          {activeTab === "feedback" && (
            <FeedbackForm
              feedbackForm={feedbackForm}
              setFeedbackForm={setFeedbackForm}
              handleSubmit={handleAddFeedback}
              loading={loading}
            />
          )}
        </main>
      </div>

      {/* Delete Confirmation Modals */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            service={deleteTarget}
            loading={loading}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
        {promoDeleteTarget && (
          <DeleteModal
            service={{ id: promoDeleteTarget.id, name: promoDeleteTarget.title } as any}
            loading={loading}
            onConfirm={handleDeletePromoConfirm}
            onCancel={() => setPromoDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}