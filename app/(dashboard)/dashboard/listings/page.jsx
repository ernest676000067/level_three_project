"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Modal from "@/components/ui/modal";

import Image from "next/image";
function PropertyCard({ property, onEdit, onDelete }) {
  return (
    <Card className="mb-6 p-4 shadow-md rounded-lg bg-white">
      <div className="flex flex-col gap-2">
        {property.main_image && (
          <div className="mb-2 w-full h-48 relative rounded-lg overflow-hidden">
            <Image src={property.main_image} alt={property.name} fill className="object-cover" />
          </div>
        )}
        <h2 className="text-xl font-bold">{property.name}</h2>
        <p className="text-gray-600">{property.city}, {property.country}</p>
        <p className="text-sm">Status: <span className="font-semibold">{property.status}</span></p>
        <p className="text-sm">Price: <span className="font-semibold">XAF {property.price}</span></p>
        <div className="flex gap-2 mt-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(property)}>Edit</Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(property.id)}>Delete</Button>
        </div>
      </div>
    </Card>
  );
}

function PropertyModal({ open, onClose, onSave, property }) {
  const [form, setForm] = useState(property || {
    name: "",
    type: "Apartment",
    country: "",
    city: "",
    price: "",
    old_price: "",
    overall_rating: "",
    review_summary: "",
    reviews_count: "",
    location_rating: "",
    status: "free",
    main_image: "",
    price_signed_in: "",
    has_genius: "false",
    features: "",
    images: [],
  });
  const [imageFile, setImageFile] = useState(null);
  const [extraImages, setExtraImages] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    setForm(property || {
      name: "",
      type: "Apartment",
      country: "",
      city: "",
      price: "",
      old_price: "",
      overall_rating: "",
      review_summary: "",
      reviews_count: "",
      location_rating: "",
      status: "free",
      main_image: "",
      price_signed_in: "",
      has_genius: "false",
      features: "",
    });
    setImageFile(null);
    setError("");
  }, [property, open]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const supabase = createClient();
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage.from("properties").upload(fileName, file);
      if (error) {
        setError("Image upload failed: " + error.message);
      } else if (data?.path) {
        const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/properties/${data.path}`;
        setForm(f => ({ ...f, main_image: imageUrl }));
      }
    }
  };

  // Handle upload for extra images (up to 8)
  const handleExtraImagesUpload = async (e) => {
    const files = Array.from(e.target.files).slice(0, 8);
    const supabase = createClient();
    let uploaded = [];
    for (let file of files) {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage.from("properties").upload(fileName, file);
      if (!error && data?.path) {
        const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/properties/${data.path}`;
        uploaded.push(imageUrl);
      }
    }
    setExtraImages(uploaded);
    setForm(f => ({ ...f, images: uploaded }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onSave(form);
    if (result?.error) {
      setError(result.error.message || "Failed to save property.");
    } else {
      setError("");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-4 bg-white rounded-xl shadow-lg w-full max-w-sm mx-auto border border-gray-200" style={{maxHeight: '480px', overflowY: 'auto'}}>
        <h2 className="text-lg font-bold mb-4">{property ? "Edit Property" : "Add Property"}</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input className="border p-2 rounded" placeholder="Name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required />
          <input className="border p-2 rounded" placeholder="Type" value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))} required />
          <input className="border p-2 rounded" placeholder="Country" value={form.country} onChange={e => setForm(f => ({...f, country: e.target.value}))} required />
          <input className="border p-2 rounded" placeholder="City" value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} required />
          <input className="border p-2 rounded" type="number" placeholder="Price" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} required />
          <input className="border p-2 rounded" type="number" placeholder="Old Price" value={form.old_price} onChange={e => setForm(f => ({...f, old_price: e.target.value}))} />
          <input className="border p-2 rounded" type="number" placeholder="Overall Rating" value={form.overall_rating} onChange={e => setForm(f => ({...f, overall_rating: e.target.value}))} />
          <input className="border p-2 rounded" placeholder="Review Summary" value={form.review_summary} onChange={e => setForm(f => ({...f, review_summary: e.target.value}))} />
          <input className="border p-2 rounded" type="number" placeholder="Reviews Count" value={form.reviews_count} onChange={e => setForm(f => ({...f, reviews_count: e.target.value}))} />
          <input className="border p-2 rounded" type="number" placeholder="Location Rating" value={form.location_rating} onChange={e => setForm(f => ({...f, location_rating: e.target.value}))} />
          <select className="border p-2 rounded" value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}>
            <option value="free">Free</option>
            <option value="booked">Booked</option>
            <option value="occupied">Occupied</option>
          </select>
          <div>
            <label className="block mb-2 text-sm font-medium">Main Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {form.main_image && (
              <div className="mt-2 w-full h-32 relative rounded-lg overflow-hidden">
                <Image src={form.main_image} alt="Property" fill className="object-cover" />
              </div>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Extra Images (up to 8)</label>
            <input type="file" accept="image/*" multiple onChange={handleExtraImagesUpload} />
            <div className="flex flex-wrap gap-2 mt-2">
              {extraImages.map((img, idx) => (
                <div key={idx} className="w-16 h-16 relative rounded overflow-hidden border">
                  <Image src={img} alt={`Extra ${idx + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
          <input className="border p-2 rounded" type="number" placeholder="Price Signed In" value={form.price_signed_in} onChange={e => setForm(f => ({...f, price_signed_in: e.target.value}))} />
          <select className="border p-2 rounded" value={form.has_genius} onChange={e => setForm(f => ({...f, has_genius: e.target.value}))}>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
          <input className="border p-2 rounded" placeholder="Features (comma separated)" value={form.features} onChange={e => setForm(f => ({...f, features: e.target.value}))} />
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          <div className="flex gap-2 mt-2">
            <Button type="submit" className="w-full">{property ? "Update" : "Add"}</Button>
            <Button type="button" variant="outline" className="w-full" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      const { data, error } = await supabase.from("properties").select("*").order("created_at", { ascending: false });
      setProperties(data || []);
      setLoading(false);
    }
    fetchProperties();
  }, [modalOpen]);

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const handleEdit = (property) => {
    setEditing(property);
    setModalOpen(true);
  };
  const handleDelete = async (id) => {
    await supabase.from("properties").delete().eq("id", id);
    setProperties(props => props.filter(p => p.id !== id));
  };
  const handleSave = async (form) => {
    let result;
    if (editing) {
      result = await supabase.from("properties").update(form).eq("id", editing.id);
    } else {
      // Let Supabase auto-generate id, only set created_at
      const newProperty = {
        ...form,
        created_at: new Date().toISOString(),
      };
      result = await supabase.from("properties").insert([newProperty]);
    }
    if (!result.error) setModalOpen(false);
    return result;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Properties</h1>
        <Button onClick={handleAdd}>Add Property</Button>
      </div>
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading properties...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}
      <PropertyModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} property={editing} />
    </div>
  );
}
