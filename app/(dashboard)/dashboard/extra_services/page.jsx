"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Modal from "@/components/ui/modal";
import Image from "next/image";

function ExtraServiceCard({ service, onEdit, onDelete }) {
  return (
    <Card className="mb-6 p-4 shadow-md rounded-lg bg-white">
      <div className="flex flex-col gap-2">
        {/* Gallery: show all images if available, else fallback to main_image */}
        <div className="mb-2 w-full h-48 relative rounded-lg overflow-hidden flex gap-2">
          {Array.isArray(service.images) && service.images.length > 0 ? (
            service.images.slice(0, 3).map((img, idx) => (
              <Image key={img + idx} src={img} alt={service.name} fill className="object-cover" style={{objectFit:'cover', zIndex:idx}} />
            ))
          ) : (
            service.main_image && (
              <Image src={service.main_image} alt={service.name} fill className="object-cover" />
            )
          )}
        </div>
        <h2 className="text-xl font-bold">{service.name}</h2>
        <p className="text-gray-600">{service.city}, {service.country}</p>
        <p className="text-sm">Type: <span className="font-semibold">{service.type}</span></p>
        <p className="text-sm">Status: <span className="font-semibold">{service.status}</span></p>
        <p className="text-sm">Price: <span className="font-semibold">XAF {service.price}</span></p>
        <div className="flex gap-2 mt-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(service)}>Edit</Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(service.id)}>Delete</Button>
        </div>
      </div>
    </Card>
  );
}

function ExtraServiceModal({ open, onClose, onSave, service }) {
  const [form, setForm] = useState(service || {
    name: "",
    type: "Transport",
    country: "",
    city: "",
    price: "",
    price_signed_in: "",
    overall_rating: "",
    review_summary: "",
    reviews_count: "",
    location_rating: "",
    status: "free",
    availability_status: "free",
    has_genius: "false",
    main_image: "",
    amenities: "",
    Features: "",
    images: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    setForm(service || {
      name: "",
      type: "Transport",
      country: "",
      city: "",
      price: "",
      price_signed_in: "",
      overall_rating: "",
      review_summary: "",
      reviews_count: "",
      location_rating: "",
      status: "free",
      availability_status: "free",
      has_genius: "false",
      main_image: "",
      amenities: "",
      Features: "",
      images: [],
    });
    setImageFiles([]);
    setError("");
  }, [service, open]);

  // Multi-image upload
  const handleImagesUpload = async (e) => {
    const files = Array.from(e.target.files).slice(0, 8);
    setImageFiles(files);
    if (files.length) {
      const supabase = createClient();
      const uploadedUrls = [];
      for (const file of files) {
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2,8)}-${file.name}`;
        const { data, error } = await supabase.storage.from("properties").upload(fileName, file);
        if (error) {
          setError("Image upload failed: " + error.message);
        } else if (data?.path) {
          const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/properties/${data.path}`;
          uploadedUrls.push(imageUrl);
        }
      }
      // Set main_image as first image, images array for gallery
      setForm(f => ({ ...f, main_image: uploadedUrls[0] || f.main_image, images: uploadedUrls }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onSave(form);
    if (result?.error) {
      setError(result.error.message || "Failed to save service.");
    } else {
      setError("");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-4 bg-white rounded-xl shadow-lg w-full max-w-sm mx-auto border border-gray-200" style={{maxHeight: '480px', overflowY: 'auto'}}>
        <h2 className="text-lg font-bold mb-4">{service ? "Edit Service" : "Add Service"}</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input className="border p-2 rounded" placeholder="Name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required />
          <input className="border p-2 rounded" placeholder="Type" value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))} required />
          <input className="border p-2 rounded" placeholder="Country" value={form.country} onChange={e => setForm(f => ({...f, country: e.target.value}))} required />
          <input className="border p-2 rounded" placeholder="City" value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} required />
          <input className="border p-2 rounded" type="number" placeholder="Price" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} required />
          <input className="border p-2 rounded" type="number" placeholder="Price Signed In" value={form.price_signed_in} onChange={e => setForm(f => ({...f, price_signed_in: e.target.value}))} />
          <input className="border p-2 rounded" type="number" placeholder="Overall Rating" value={form.overall_rating} onChange={e => setForm(f => ({...f, overall_rating: e.target.value}))} />
          <input className="border p-2 rounded" placeholder="Review Summary" value={form.review_summary} onChange={e => setForm(f => ({...f, review_summary: e.target.value}))} />
          <input className="border p-2 rounded" type="number" placeholder="Reviews Count" value={form.reviews_count} onChange={e => setForm(f => ({...f, reviews_count: e.target.value}))} />
          <input className="border p-2 rounded" type="number" placeholder="Location Rating" value={form.location_rating} onChange={e => setForm(f => ({...f, location_rating: e.target.value}))} />
          <select className="border p-2 rounded" value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}>
            <option value="free">Free</option>
            <option value="occupied">Occupied</option>
          </select>
          <select className="border p-2 rounded" value={form.availability_status} onChange={e => setForm(f => ({...f, availability_status: e.target.value}))}>
            <option value="free">Free</option>
            <option value="occupied">Occupied</option>
          </select>
          <select className="border p-2 rounded" value={form.has_genius} onChange={e => setForm(f => ({...f, has_genius: e.target.value}))}>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
          <input className="border p-2 rounded" placeholder="Amenities (comma separated)" value={form.amenities} onChange={e => setForm(f => ({...f, amenities: e.target.value}))} />
          <input className="border p-2 rounded" placeholder="Features (comma separated)" value={form.Features} onChange={e => setForm(f => ({...f, Features: e.target.value}))} />
          <div>
            <label className="block mb-2 text-sm font-medium">Images (up to 8)</label>
            <input type="file" accept="image/*" multiple onChange={handleImagesUpload} />
            {/* Gallery preview */}
            <div className="flex gap-2 mt-2">
              {Array.isArray(form.images) && form.images.length > 0 && form.images.map((img, idx) => (
                <div key={img + idx} className="w-16 h-16 relative rounded-lg overflow-hidden">
                  <Image src={img} alt={`Service image ${idx + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          <div className="flex gap-2 mt-2">
            <Button type="submit" className="w-full">{service ? "Update" : "Add"}</Button>
            <Button type="button" variant="outline" className="w-full" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default function ExtraServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      const { data, error } = await supabase.from("extra_services").select("*").order("created_at", { ascending: false });
      setServices(data || []);
      setLoading(false);
    }
    fetchServices();
  }, [modalOpen]);

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const handleEdit = (service) => {
    setEditing(service);
    setModalOpen(true);
  };
  const handleDelete = async (id) => {
    await supabase.from("extra_services").delete().eq("id", id);
    setServices(services => services.filter(s => s.id !== id));
  };
  const handleSave = async (form) => {
    let result;
    if (editing) {
      result = await supabase.from("extra_services").update(form).eq("id", editing.id);
    } else {
      const newService = {
        ...form,
        created_at: new Date().toISOString(),
      };
      result = await supabase.from("extra_services").insert([newService]);
    }
    if (!result.error) setModalOpen(false);
    return result;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Extra Services</h1>
        <Button onClick={handleAdd}>Add Service</Button>
      </div>
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading services...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <ExtraServiceCard key={service.id} service={service} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}
      <ExtraServiceModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} service={editing} />
    </div>
  );
}
