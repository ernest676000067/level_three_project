"use client";

import { useEffect, useRef, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const inquiriesData = [
  { day: "Mon", value: 15 },
  { day: "Tue", value: 10 },
  { day: "Wed", value: 30 },
  { day: "Thu", value: 25 },
  { day: "Fri", value: 40 },
  { day: "Sat", value: 35 },
  { day: "Sun", value: 50 },
];

const typeData = [
  { name: "Houses", value: 60, color: "#3b82f6" },
  { name: "Apartments", value: 25, color: "#93c5fd" },
  { name: "Commercial", value: 15, color: "#6b7280" },
];

const totalInquiries = inquiriesData.reduce((sum, item) => sum + item.value, 0);
const averageInquiries = Math.round(totalInquiries / inquiriesData.length);
const peakDay = inquiriesData.reduce((max, item) =>
  item.value > max.value ? item : max
, inquiriesData[0]);

const inquiryHighlights = [
  { label: "Total Inquiries", value: totalInquiries },
  { label: "Weekly Average", value: averageInquiries },
  { label: "Peak Day", value: `${peakDay.day} (${peakDay.value})` },
];

const recentListings = [
  {
    img: "/house1.jpg",
    title: "455 Rue de l'Indépendance",
    price: "$1,600,000",
  },
  {
    img: "/house2.jpg",
    title: "23 Boulevard de la Paix",
    price: "$860,000",
  },
  {
    img: "/house3.jpg",
    title: "78 Avenue des Avenues",
    price: "$660,000",
  },
];

const quickActions = [
  { label: "Add Property", icon: "➕" },
  { label: "Manage Listings", icon: "📁" },
  { label: "Invite Agent", icon: "🤝" },
];

const insightsData = [
  { label: "Conversion Rate", value: "32%", delta: "+4.2%", trend: "up" },
  { label: "Avg. Inquiry Response", value: "2h 15m", delta: "-18m", trend: "up" },
  { label: "Active Leases", value: "87", delta: "-3%", trend: "down" },
];

export default function DashboardSection() {
  const [isListingsModalOpen, setIsListingsModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const closeTimeoutRef = useRef(null);

  const openListingsModal = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    if (isListingsModalOpen) {
      setModalVisible(true);
      return;
    }

    setIsListingsModalOpen(true);
  };

  const closeListingsModal = () => {
    setModalVisible(false);
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsListingsModalOpen(false);
    }, 220);
  };

  useEffect(() => {
    if (isListingsModalOpen) {
      const frame = requestAnimationFrame(() => setModalVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    setModalVisible(false);
    return undefined;
  }, [isListingsModalOpen]);

  useEffect(() => () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  }, []);

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
        <section className="bg-white p-5 lg:p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Property Inquiries</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {inquiryHighlights.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                  {item.label}
                </p>
                <p className="text-lg font-semibold text-[#0A2342] mt-1">
                  {item.value}
                </p>
              </div>
            ))}

          </div>

          <div className="w-full h-[70vh]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={inquiriesData} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ stroke: "#93c5fd", strokeWidth: 1 }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="space-y-6">
          <div className="bg-white p-5 lg:p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Listings</h2>
              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View all
              </button>
            </div>

            <div className="space-y-4">
              {recentListings.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={openListingsModal}
                  className="flex w-full items-center gap-3 rounded-md border border-transparent p-2 text-left transition-colors hover:border-blue-100 hover:bg-blue-50"
                >
                  <div className="w-14 h-14 bg-gray-200 rounded-md overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500">{item.price}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 lg:p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

            <div className="space-y-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  className="w-full flex items-center justify-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg" aria-hidden>{action.icon}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white p-5 lg:p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Property Type Distribution</h2>

          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-start">
            <PieChart width={200} height={200}>
              <Pie
                data={typeData}
                dataKey="value"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={3}
              >
                {typeData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>

            <div className="space-y-3">
              {typeData.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ background: item.color }}
                  ></span>
                  <span className="text-sm text-gray-700">
                    {item.value}% {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white p-5 lg:p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Portfolio Insights</h2>

          <div className="space-y-5">
            {insightsData.map((insight) => (
              <div key={insight.label} className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    {insight.label}
                  </p>
                  <p className="text-xl font-semibold text-gray-900 mt-1">
                    {insight.value}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    insight.trend === "down" ? "text-red-500" : "text-emerald-600"
                  }`}
                >
                  {insight.delta}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
