"use client";

import { useEffect, useState } from "react";
import { supabaseAdmin } from "@/lib/supabase";
import ImageUploader from "@/components/ImageUploader";

interface HeroSlide {
  imageUrl: string;
  linkUrl: string;
}

export default function SettingsPage() {
  const [form, setForm] = useState({
    storeName: "The Archivist",
    storeEmail: "contact@archivist.com",
    storePhone: "+1 (555) 123-4567",
    storeAddress: "123 Collector Ave, Suite 100, New York, NY 10001",
    currency: "USD",
    taxRate: "8.875",
    freeShippingThreshold: "100",
    shippingCost: "15.99",
    whatsappPhone: "+1234567890",
    facebook: "https://facebook.com/archivist",
    twitter: "https://twitter.com/archivist",
    instagram: "https://instagram.com/archivist",
    discountPrefix: "ARCHIV",
    discountDefaultType: "percentage",
    discountDefaultValue: "10",
    discountDefaultExpiryDays: "30",
    discountDefaultMaxUses: "1",
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [slidesSaved, setSlidesSaved] = useState(false);
  const [uploadingSlide, setUploadingSlide] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/settings").then((r) => r.json()),
      fetch("/api/admin/hero-slides").then((r) => r.json()),
    ]).then(([settingsData, slidesData]) => {
      if (settingsData && settingsData.storeName) setForm(settingsData);
      if (Array.isArray(slidesData)) setSlides(slidesData);
    }).finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      alert("Failed to save settings");
    }
  };

  const saveSlides = async () => {
    setSlidesSaved(false);
    try {
      const res = await fetch("/api/admin/hero-slides", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slides),
      });
      if (res.ok) {
        setSlidesSaved(true);
        setTimeout(() => setSlidesSaved(false), 2000);
      }
    } catch {
      alert("Failed to save hero slides");
    }
  };

  const addSlide = () => {
    setSlides((prev) => [...prev, { imageUrl: "", linkUrl: "" }]);
  };

  const removeSlide = (index: number) => {
    setSlides((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="font-heading text-lg font-bold text-dark-text-secondary">Loading settings...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">Settings</h1>
      <p className="text-sm text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-6">Manage your store configuration.</p>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white p-5">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider mb-4">General</h2>
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Store Name</label>
              <input name="storeName" value={form.storeName} onChange={handleChange} className="input-field w-full" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Store Email</label>
                <input name="storeEmail" value={form.storeEmail} onChange={handleChange} className="input-field w-full" />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Store Phone</label>
                <input name="storePhone" value={form.storePhone} onChange={handleChange} className="input-field w-full" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Address</label>
              <input name="storeAddress" value={form.storeAddress} onChange={handleChange} className="input-field w-full" />
            </div>
          </div>
        </div>

        <div className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white p-5">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider mb-4">Pricing &amp; Shipping</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Currency</label>
              <select name="currency" value={form.currency} onChange={handleChange} className="input-field w-full">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (&euro;)</option>
                <option value="GBP">GBP (&pound;)</option>
                <option value="JPY">JPY (&yen;)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Tax Rate (%)</label>
              <input name="taxRate" value={form.taxRate} onChange={handleChange} className="input-field w-full" />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Free Shipping Over ($)</label>
              <input name="freeShippingThreshold" value={form.freeShippingThreshold} onChange={handleChange} className="input-field w-full" />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Shipping Cost ($)</label>
              <input name="shippingCost" value={form.shippingCost} onChange={handleChange} className="input-field w-full" />
            </div>
          </div>
        </div>

        <div className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white p-5">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider mb-4">WhatsApp</h2>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">WhatsApp Phone Number</label>
            <input name="whatsappPhone" value={form.whatsappPhone} onChange={handleChange} className="input-field w-full" placeholder="+1234567890" />
            <p className="text-[10px] text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mt-1">Used for the wa.me redirect link when customers confirm checkout.</p>
          </div>
        </div>

        <div className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white p-5">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider mb-4">Discount Codes</h2>
          <p className="text-[10px] text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-4">Defaults used to pre-fill the batch generator on the Discount Codes page. You can override them each time you generate.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Code Prefix</label>
              <input name="discountPrefix" value={form.discountPrefix} onChange={handleChange} className="input-field w-full" placeholder="ARCHIV" />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Default Discount Type</label>
              <select name="discountDefaultType" value={form.discountDefaultType} onChange={handleChange} className="input-field w-full">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Default Discount Value</label>
              <input name="discountDefaultValue" value={form.discountDefaultValue} onChange={handleChange} className="input-field w-full" placeholder="10" />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Default Expiry (days)</label>
              <input name="discountDefaultExpiryDays" value={form.discountDefaultExpiryDays} onChange={handleChange} className="input-field w-full" placeholder="30" />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Default Max Uses Per Code</label>
              <input name="discountDefaultMaxUses" value={form.discountDefaultMaxUses} onChange={handleChange} className="input-field w-full" placeholder="1" />
            </div>
          </div>
        </div>

        <div className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-sm font-bold uppercase tracking-wider">Hero Carousel Slides</h2>
            <button type="button" onClick={addSlide} className="text-[10px] font-bold uppercase tracking-wider text-crimson hover:underline">+ Add Slide</button>
          </div>
          <div className="space-y-4">
            {slides.length === 0 && (
              <p className="text-xs text-dark-text-secondary dark:text-dark-text-secondary text-gray-500">No slides. Add one to show a carousel on the homepage.</p>
            )}
            {slides.map((slide, i) => (
              <div key={i} className="border border-dark-border/50 dark:border-dark-border/50 border-gray-200/50 p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500">Slide {i + 1}</span>
                  <button type="button" onClick={() => removeSlide(i)} className="text-[10px] font-bold uppercase tracking-wider text-red-500 hover:underline">Remove</button>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <ImageUploader
                      images={slide.imageUrl ? [{ url: slide.imageUrl }] : []}
                      compact
                      uploading={uploadingSlide === i}
                      onAdd={async (files) => {
                        const file = files[0];
                        if (!file) return;
                        setUploadingSlide(i);
                        try {
                          const ext = file.name.split(".").pop() || "png";
                          const fileName = `hero/hero-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
                          const { error } = await supabaseAdmin.storage
                            .from("product-images")
                            .upload(fileName, file, { contentType: file.type });
                          if (error) throw new Error(error.message);
                          const { data: publicUrlData } = supabaseAdmin.storage.from("product-images").getPublicUrl(fileName);
                          setSlides((prev) => prev.map((s, j) => j === i ? { ...s, imageUrl: publicUrlData.publicUrl } : s));
                        } catch (err: any) {
                          alert(err?.message || "Upload failed");
                        } finally {
                          setUploadingSlide(null);
                        }
                      }}
                      onRemove={() => setSlides((prev) => prev.map((s, j) => j === i ? { ...s, imageUrl: "" } : s))}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Optional link URL (e.g. /categories/marvel-multiverse)"
                      value={slide.linkUrl}
                      onChange={(e) => setSlides((prev) => prev.map((s, j) => j === i ? { ...s, linkUrl: e.target.value } : s))}
                      className="input-field w-full text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={saveSlides} className="btn-primary text-xs">Save Slides</button>
            {slidesSaved && <span className="text-xs font-bold text-green-500 uppercase tracking-wider ml-3">Saved!</span>}
          </div>
        </div>

        <div className="border border-dark-border dark:border-dark-border border-gray-200 bg-dark-surface dark:bg-dark-surface bg-white p-5">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider mb-4">Social Links</h2>
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Facebook</label>
              <input name="facebook" value={form.facebook} onChange={handleChange} className="input-field w-full" />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Twitter / X</label>
              <input name="twitter" value={form.twitter} onChange={handleChange} className="input-field w-full" />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-gray-500 mb-1.5 block">Instagram</label>
              <input name="instagram" value={form.instagram} onChange={handleChange} className="input-field w-full" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" className="btn-primary">Save Settings</button>
          {saved && <span className="text-xs font-bold text-green-500 uppercase tracking-wider">Saved!</span>}
        </div>
      </form>
    </div>
  );
}
