"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Modal from "@/components/ui/modal";
import Image from "next/image";

function GuestHomeCard({ home, onEdit, onDelete }) {
	return (
		<Card className="mb-6 p-4 shadow-md rounded-lg bg-white">
			<div className="flex flex-col gap-2">
				{home.image && (
					<div className="mb-2 w-full h-48 relative rounded-lg overflow-hidden">
						<Image src={home.image} alt={home.name} fill className="object-cover" />
					</div>
				)}
				<h2 className="text-xl font-bold">{home.name}</h2>
				<p className="text-gray-600">{home.city}, {home.country}</p>
				<p className="text-sm">Type: <span className="font-semibold">{home.type}</span></p>
				<p className="text-sm">Status: <span className="font-semibold">{home.status}</span></p>
				<p className="text-sm">Mode: <span className="font-semibold">{home.mode}</span></p>
				<p className="text-sm">Price: <span className="font-semibold">XAF {home.price}</span></p>
				<div className="flex gap-2 mt-2">
					<Button size="sm" variant="outline" onClick={() => onEdit(home)}>Edit</Button>
					<Button size="sm" variant="destructive" onClick={() => onDelete(home.id)}>Delete</Button>
				</div>
			</div>
		</Card>
	);
}

function GuestHomeModal({ open, onClose, onSave, home }) {
	const [form, setForm] = useState(home || {
		name: "",
		type: "Serviced Apartment",
		city: "",
		country: "",
		image: "",
		rating: "",
		status: "Wonderful",
		mode: "",
		price: "",
		genus: "Genius",
		review_count: "",
		features: "",
	});
	const [imageFile, setImageFile] = useState(null);
	const [error, setError] = useState("");
	useEffect(() => {
		setForm(home || {
			name: "",
			type: "Serviced Apartment",
			city: "",
			country: "",
			image: "",
			rating: "",
			status: "Wonderful",
			mode: "",
			price: "",
			genus: "Genius",
			review_count: "",
			features: "",
		});
		setImageFile(null);
		setError("");
	}, [home, open]);

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
				setForm(f => ({ ...f, image: imageUrl }));
			}
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const result = await onSave(form);
		if (result?.error) {
			setError(result.error.message || "Failed to save home.");
		} else {
			setError("");
		}
	};

	return (
		<Modal open={open} onClose={onClose}>
			<div className="p-4 bg-white rounded-xl shadow-lg w-full max-w-sm mx-auto border border-gray-200" style={{maxHeight: '480px', overflowY: 'auto'}}>
				<h2 className="text-lg font-bold mb-4">{home ? "Edit Guest Home" : "Add Guest Home"}</h2>
				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<input className="border p-2 rounded" placeholder="Name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required />
					<input className="border p-2 rounded" placeholder="Type" value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))} required />
					<input className="border p-2 rounded" placeholder="City" value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} required />
					<input className="border p-2 rounded" placeholder="Country" value={form.country} onChange={e => setForm(f => ({...f, country: e.target.value}))} required />
					<input className="border p-2 rounded" type="number" placeholder="Rating" value={form.rating} onChange={e => setForm(f => ({...f, rating: e.target.value}))} />
					<input className="border p-2 rounded" placeholder="Status" value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))} />
					<input className="border p-2 rounded" placeholder="Mode" value={form.mode} onChange={e => setForm(f => ({...f, mode: e.target.value}))} />
					<input className="border p-2 rounded" type="number" placeholder="Price" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} required />
					<input className="border p-2 rounded" placeholder="Genus" value={form.genus} onChange={e => setForm(f => ({...f, genus: e.target.value}))} />
					<input className="border p-2 rounded" type="number" placeholder="Review Count" value={form.review_count} onChange={e => setForm(f => ({...f, review_count: e.target.value}))} />
					<input className="border p-2 rounded" placeholder="Features (comma separated)" value={form.features} onChange={e => setForm(f => ({...f, features: e.target.value}))} />
					<div>
						<label className="block mb-2 text-sm font-medium">Image</label>
						<input type="file" accept="image/*" onChange={handleImageUpload} />
						{form.image && (
							<div className="mt-2 w-full h-32 relative rounded-lg overflow-hidden">
								<Image src={form.image} alt="Guest Home" fill className="object-cover" />
							</div>
						)}
					</div>
					{error && <p className="text-sm text-red-500 mt-2">{error}</p>}
					<div className="flex gap-2 mt-2">
						<Button type="submit" className="w-full">{home ? "Update" : "Add"}</Button>
						<Button type="button" variant="outline" className="w-full" onClick={onClose}>Cancel</Button>
					</div>
				</form>
			</div>
		</Modal>
	);
}

export default function GuestHomesLovePage() {
	const [homes, setHomes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	const [editing, setEditing] = useState(null);
	const supabase = createClient();

	useEffect(() => {
		async function fetchHomes() {
			setLoading(true);
			const { data, error } = await supabase.from("homes_guests_love").select("*").order("name", { ascending: true });
			setHomes(data || []);
			setLoading(false);
		}
		fetchHomes();
	}, [modalOpen]);

	const handleAdd = () => {
		setEditing(null);
		setModalOpen(true);
	};
	const handleEdit = (home) => {
		setEditing(home);
		setModalOpen(true);
	};
	const handleDelete = async (id) => {
		await supabase.from("homes_guests_love").delete().eq("id", id);
		setHomes(homes => homes.filter(h => h.id !== id));
	};
	const handleSave = async (form) => {
		let result;
		if (editing) {
			result = await supabase.from("homes_guests_love").update(form).eq("id", editing.id);
		} else {
			const newHome = {
				...form,
			};
			result = await supabase.from("homes_guests_love").insert([newHome]);
		}
		if (!result.error) setModalOpen(false);
		return result;
	};

	return (
		<div className="p-8 bg-gray-50 min-h-screen">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">Manage Homes Guests Love</h1>
				<Button onClick={handleAdd}>Add Guest Home</Button>
			</div>
			{loading ? (
				<div className="text-center py-20 text-gray-500">Loading homes...</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{homes.map(home => (
						<GuestHomeCard key={home.id} home={home} onEdit={handleEdit} onDelete={handleDelete} />
					))}
				</div>
			)}
			<GuestHomeModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} home={editing} />
		</div>
	);
}
