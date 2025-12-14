"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Modal from "@/components/ui/modal";
import Image from "next/image";

function WeekendDealCard({ deal, onEdit, onDelete }) {
	return (
		<Card className="mb-6 p-4 shadow-md rounded-lg bg-white">
			<div className="flex flex-col gap-2">
				{deal.main_image && (
					<div className="mb-2 w-full h-48 relative rounded-lg overflow-hidden">
						<Image src={deal.main_image} alt={deal.title} fill className="object-cover" />
					</div>
				)}
				<h2 className="text-xl font-bold">{deal.title}</h2>
				<p className="text-gray-600">{deal.city}, {deal.country}</p>
				<p className="text-sm">Type: <span className="font-semibold">{deal.deal_type}</span></p>
				<p className="text-sm">Status: <span className="font-semibold">{deal.availability_status}</span></p>
				<p className="text-sm">Price: <span className="font-semibold">XAF {deal.starting_price}</span></p>
				<div className="flex gap-2 mt-2">
					<Button size="sm" variant="outline" onClick={() => onEdit(deal)}>Edit</Button>
					<Button size="sm" variant="destructive" onClick={() => onDelete(deal.id)}>Delete</Button>
				</div>
			</div>
		</Card>
	);
}

function WeekendDealModal({ open, onClose, onSave, deal }) {
	const [form, setForm] = useState(deal || {
		title: "",
		subtitle: "",
		is_genius: "false",
		property_name: "",
		city: "",
		country: "",
		rating: "",
		review_summary: "",
		reviews_count: "",
		deal_type: "",
		starting_price: "",
		main_image: "",
		availability_status: "free",
		created_at: "",
		features: "",
	});
	const [imageFile, setImageFile] = useState(null);
	const [error, setError] = useState("");
	useEffect(() => {
		setForm(deal || {
			title: "",
			subtitle: "",
			is_genius: "false",
			property_name: "",
			city: "",
			country: "",
			rating: "",
			review_summary: "",
			reviews_count: "",
			deal_type: "",
			starting_price: "",
			main_image: "",
			availability_status: "free",
			created_at: "",
			features: "",
		});
		setImageFile(null);
		setError("");
	}, [deal, open]);

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

	const handleSubmit = async (e) => {
		e.preventDefault();
		const result = await onSave(form);
		if (result?.error) {
			setError(result.error.message || "Failed to save deal.");
		} else {
			setError("");
		}
	};

	return (
		<Modal open={open} onClose={onClose}>
			<div className="p-4 bg-white rounded-xl shadow-lg w-full max-w-sm mx-auto border border-gray-200" style={{maxHeight: '480px', overflowY: 'auto'}}>
				<h2 className="text-lg font-bold mb-4">{deal ? "Edit Weekend Deal" : "Add Weekend Deal"}</h2>
				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<input className="border p-2 rounded" placeholder="Title" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} required />
					<input className="border p-2 rounded" placeholder="Subtitle" value={form.subtitle} onChange={e => setForm(f => ({...f, subtitle: e.target.value}))} required />
					<select className="border p-2 rounded" value={form.is_genius} onChange={e => setForm(f => ({...f, is_genius: e.target.value}))}>
						<option value="true">True</option>
						<option value="false">False</option>
					</select>
					<input className="border p-2 rounded" placeholder="Property Name" value={form.property_name} onChange={e => setForm(f => ({...f, property_name: e.target.value}))} required />
					<input className="border p-2 rounded" placeholder="City" value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} required />
					<input className="border p-2 rounded" placeholder="Country" value={form.country} onChange={e => setForm(f => ({...f, country: e.target.value}))} required />
					<input className="border p-2 rounded" type="number" placeholder="Rating" value={form.rating} onChange={e => setForm(f => ({...f, rating: e.target.value}))} />
					<input className="border p-2 rounded" placeholder="Review Summary" value={form.review_summary} onChange={e => setForm(f => ({...f, review_summary: e.target.value}))} />
					<input className="border p-2 rounded" type="number" placeholder="Reviews Count" value={form.reviews_count} onChange={e => setForm(f => ({...f, reviews_count: e.target.value}))} />
					<input className="border p-2 rounded" placeholder="Deal Type" value={form.deal_type} onChange={e => setForm(f => ({...f, deal_type: e.target.value}))} />
					<input className="border p-2 rounded" type="number" placeholder="Starting Price" value={form.starting_price} onChange={e => setForm(f => ({...f, starting_price: e.target.value}))} required />
					<select className="border p-2 rounded" value={form.availability_status} onChange={e => setForm(f => ({...f, availability_status: e.target.value}))}>
						<option value="free">Free</option>
						<option value="occupied">Occupied</option>
					</select>
					<input className="border p-2 rounded" placeholder="Features (comma separated)" value={form.features} onChange={e => setForm(f => ({...f, features: e.target.value}))} />
					<div>
						<label className="block mb-2 text-sm font-medium">Image</label>
						<input type="file" accept="image/*" onChange={handleImageUpload} />
						{form.main_image && (
							<div className="mt-2 w-full h-32 relative rounded-lg overflow-hidden">
								<Image src={form.main_image} alt="Weekend Deal" fill className="object-cover" />
							</div>
						)}
					</div>
					{error && <p className="text-sm text-red-500 mt-2">{error}</p>}
					<div className="flex gap-2 mt-2">
						<Button type="submit" className="w-full">{deal ? "Update" : "Add"}</Button>
						<Button type="button" variant="outline" className="w-full" onClick={onClose}>Cancel</Button>
					</div>
				</form>
			</div>
		</Modal>
	);
}

export default function WeekendDealsPage() {
	const [deals, setDeals] = useState([]);
	const [loading, setLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	const [editing, setEditing] = useState(null);
	const supabase = createClient();

	useEffect(() => {
		async function fetchDeals() {
			setLoading(true);
			const { data, error } = await supabase.from("weekend_deals").select("*").order("created_at", { ascending: false });
			setDeals(data || []);
			setLoading(false);
		}
		fetchDeals();
	}, [modalOpen]);

	const handleAdd = () => {
		setEditing(null);
		setModalOpen(true);
	};
	const handleEdit = (deal) => {
		setEditing(deal);
		setModalOpen(true);
	};
	const handleDelete = async (id) => {
		await supabase.from("weekend_deals").delete().eq("id", id);
		setDeals(deals => deals.filter(d => d.id !== id));
	};
	const handleSave = async (form) => {
		let result;
		if (editing) {
			result = await supabase.from("weekend_deals").update(form).eq("id", editing.id);
		} else {
			const newDeal = {
				...form,
				created_at: new Date().toISOString(),
			};
			result = await supabase.from("weekend_deals").insert([newDeal]);
		}
		if (!result.error) setModalOpen(false);
		return result;
	};

	return (
		<div className="p-8 bg-gray-50 min-h-screen">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">Manage Weekend Deals</h1>
				<Button onClick={handleAdd}>Add Weekend Deal</Button>
			</div>
			{loading ? (
				<div className="text-center py-20 text-gray-500">Loading deals...</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{deals.map(deal => (
						<WeekendDealCard key={deal.id} deal={deal} onEdit={handleEdit} onDelete={handleDelete} />
					))}
				</div>
			)}
			<WeekendDealModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} deal={editing} />
		</div>
	);
}
