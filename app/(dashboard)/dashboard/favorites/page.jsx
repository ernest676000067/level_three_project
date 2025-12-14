"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  FiTrendingUp,
  FiUsers,
  FiBookmark,
  FiAlertTriangle,
  FiFilter,
  FiExternalLink,
  FiCopy,
  FiCheckCircle,
} from "react-icons/fi";

const favouriteProperties = [
  {
    id: "prop-1001",
    title: "Luxury Villa in Bonapriso",
    type: "House",
    neighborhood: "Bonapriso",
    saves: 128,
    weeklyChange: 12,
    status: "Available",
  },
  {
    id: "prop-1005",
    title: "Spacious Duplex with Pool",
    type: "House",
    neighborhood: "Bonamoussadi",
    saves: 92,
    weeklyChange: 7,
    status: "Available",
  },
  {
    id: "prop-1003",
    title: "Commercial Space near Business District",
    type: "Commercial",
    neighborhood: "Bonanjo",
    saves: 61,
    weeklyChange: -3,
    status: "Occupied",
  },
  {
    id: "prop-1010",
    title: "Modern Apartment with City View",
    type: "Apartment",
    neighborhood: "Akwa",
    saves: 55,
    weeklyChange: 5,
    status: "Reserved",
  },
  {
    id: "prop-1008",
    title: "Cozy Family Apartment",
    type: "Apartment",
    neighborhood: "Makepe",
    saves: 48,
    weeklyChange: 9,
    status: "Available",
  },
];

const userSavedData = [
  {
    id: "user-301",
    name: "Lise Tchoumba",
    email: "lise@client.com",
    location: "Bonapriso",
    interestLevel: "Hot lead",
    lastActive: "3h ago",
    savedProperties: ["prop-1001", "prop-1005"],
  },
  {
    id: "user-219",
    name: "Marc Djoumessi",
    email: "marc@client.com",
    location: "Akwa",
    interestLevel: "Engaged",
    lastActive: "Yesterday",
    savedProperties: ["prop-1003", "prop-1010"],
  },
  {
    id: "user-144",
    name: "Cynthia Ndongo",
    email: "cynthia@client.com",
    location: "Bonamoussadi",
    interestLevel: "Evaluating",
    lastActive: "2 days ago",
    savedProperties: ["prop-1005"],
  },
  {
    id: "user-401",
    name: "Klein & Co.",
    email: "contact@klein-business.com",
    location: "Bonanjo",
    interestLevel: "Corporate",
    lastActive: "5h ago",
    savedProperties: ["prop-1003"],
  },
  {
    id: "user-517",
    name: "Pauline Ayouba",
    email: "pauline@client.com",
    location: "Makepe",
    interestLevel: "Hot lead",
    lastActive: "30m ago",
    savedProperties: ["prop-1008", "prop-1001"],
  },
];

const unusualActivity = [
  {
    id: "flag-01",
    timestamp: "2025-12-08 14:22",
    user: "user-999 (unknown)",
    description: "42 favourites added within 3 minutes",
    severity: "High",
    property: "Multiple listings",
  },
  {
    id: "flag-02",
    timestamp: "2025-12-07 09:10",
    user: "Marc Djoumessi",
    description: "Repeated favourites/unfavourites on prop-1010 (8 times)",
    severity: "Medium",
    property: "Modern Apartment with City View",
  },
  {
    id: "flag-03",
    timestamp: "2025-12-05 19:45",
    user: "Automation Bot",
    description: "API key used from new IP address to favourite 12 properties",
    severity: "Critical",
    property: "Multiple listings",
  },
];

const severityStyles = {
  Critical: "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-gray-100 text-gray-700",
};

const metricCards = [
  {
    label: "Total favourites",
    value: favouriteProperties.reduce((sum, item) => sum + item.saves, 0),
    delta: "+18%",
    icon: FiBookmark,
    description: "Saved in the last 30 days",
  },
  {
    label: "Top performing listing",
    value: favouriteProperties[0].title,
    delta: `+${favouriteProperties[0].weeklyChange}% this week`,
    icon: FiTrendingUp,
    description: favouriteProperties[0].neighborhood,
  },
  {
    label: "Active leads",
    value: `${userSavedData.length} users`,
    delta: "+6 new this month",
    icon: FiUsers,
    description: "Saved at least one property",
  },
  {
    label: "Alerts flagged",
    value: `${unusualActivity.length} cases`,
    delta: "Review required",
    icon: FiAlertTriangle,
    description: "Potential suspicious behaviour",
  },
];

export default function FavouritesAdminPage() {
  const [selectedPropertyId, setSelectedPropertyId] = useState(
    favouriteProperties[0]?.id ?? null,
  );
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [featuredPropertyIds, setFeaturedPropertyIds] = useState([]);
  const [resolvedAlertIds, setResolvedAlertIds] = useState([]);

  const toggleFeaturedProperty = (propertyId) => {
    setFeaturedPropertyIds((previous) =>
      previous.includes(propertyId)
        ? previous.filter((id) => id !== propertyId)
        : [...previous, propertyId],
    );
  };

  const markAlertResolved = (alertId) => {
    setResolvedAlertIds((previous) =>
      previous.includes(alertId) ? previous : [...previous, alertId],
    );
  };

  const copyAlertSummary = (alert) => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      const summary = `${alert.timestamp} • ${alert.user} • ${alert.description}`;
      navigator.clipboard.writeText(summary).catch(() => {});
    }
  };

  const filteredTopProperties = useMemo(() => {
    if (!showOnlyAvailable) {
      return favouriteProperties;
    }
    return favouriteProperties.filter((property) => property.status === "Available");
  }, [showOnlyAvailable]);

  const selectedProperty = useMemo(
    () => favouriteProperties.find((property) => property.id === selectedPropertyId) ?? null,
    [selectedPropertyId],
  );

  const usersForSelectedProperty = useMemo(() => {
    if (!selectedProperty) {
      return [];
    }
    return userSavedData.filter((user) => user.savedProperties.includes(selectedProperty.id));
  }, [selectedProperty]);

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Favourites Overview</h1>
          <p className="text-sm text-gray-500">
            Track high-interest properties, engage with potential tenants, and monitor suspicious saving patterns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowOnlyAvailable((current) => !current)}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
              showOnlyAvailable
                ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                : "border-gray-200 bg-white text-gray-700 hover:border-blue-200"
            }`}
          >
            <FiFilter className="text-base" />
            {showOnlyAvailable ? "Showing available only" : "Filter by availability"}
          </button>
          <Link
            href="/dashboard/listings"
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A2342] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0c2d55]"
          >
            Manage listings
          </Link>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.label}
              className="rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {card.label}
                  </p>
                  <p className="mt-2 text-xl font-semibold text-[#0A2342]">{card.value}</p>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Icon size={18} />
                </span>
              </div>
              <p className="mt-2 text-xs font-medium text-emerald-600">{card.delta}</p>
              <p className="mt-2 text-xs text-gray-500">{card.description}</p>
            </article>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Top saved properties</h2>
              <p className="text-sm text-gray-500">Review engagement across the most popular listings.</p>
            </div>
            <p className="text-xs text-gray-400">Data refreshed 5 minutes ago</p>
          </header>

          <div className="mt-5 overflow-hidden rounded-xl border border-gray-100">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-3">Property</th>
                  <th className="px-5 py-3">Saves</th>
                  <th className="px-5 py-3">Trend</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTopProperties.map((property) => {
                  const percentage = Math.min(
                    100,
                    Math.round((property.saves / favouriteProperties[0].saves) * 100),
                  );
                  const isFeatured = featuredPropertyIds.includes(property.id);

                  return (
                    <tr
                      key={property.id}
                      className={`transition hover:bg-gray-50 ${
                        isFeatured ? "bg-blue-50/40" : ""
                      }`}
                    >
                      <td className="px-5 py-4">
                        <div
                          className="cursor-pointer"
                          onClick={() => setSelectedPropertyId(property.id)}
                        >
                          <p className="font-semibold text-gray-900">
                            {property.title}
                            {isFeatured && (
                              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-[2px] text-[10px] font-semibold text-blue-700">
                                <FiCheckCircle size={10} />
                                Featured
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            {property.type} • {property.neighborhood}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-700">{property.saves}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="relative h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                            <span
                              className="absolute inset-y-0 left-0 rounded-full bg-blue-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span
                            className={`text-xs font-semibold ${
                              property.weeklyChange >= 0 ? "text-emerald-600" : "text-red-500"
                            }`}
                          >
                            {property.weeklyChange >= 0 ? "+" : ""}
                            {property.weeklyChange}%
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            property.status === "Available"
                              ? "bg-emerald-100 text-emerald-700"
                              : property.status === "Reserved"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {property.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="relative inline-flex group focus-within:outline-none">
                          <button
                            type="button"
                            onClick={() => setSelectedPropertyId(property.id)}
                            className="rounded-full px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                          >
                            View
                          </button>

                          <div
                            className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 w-64 translate-y-2 transform rounded-xl border border-gray-100 bg-white p-4 text-left text-sm text-gray-600 shadow-xl transition-all duration-200 ease-out opacity-0 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100"
                          >
                            <p className="text-sm font-semibold text-gray-900">{property.title}</p>
                            <p className="text-xs text-gray-500">
                              {property.neighborhood} • {property.type}
                            </p>

                            <div className="mt-3 flex flex-col gap-2">
                              <Link
                                href={`/dashboard/listings/${property.id}`}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A2342] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#0c2d55]"
                              >
                                <FiExternalLink size={14} />
                                Open listing
                              </Link>

                              <button
                                type="button"
                                onClick={() => toggleFeaturedProperty(property.id)}
                                className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                  isFeatured
                                    ? "border border-blue-200 bg-blue-50 text-blue-700"
                                    : "border border-gray-200 bg-white text-gray-600 hover:border-blue-200"
                                }`}
                              >
                                <FiCheckCircle size={14} />
                                {isFeatured ? "Remove featured" : "Feature listing"}
                              </button>

                              <button
                                type="button"
                                onClick={() => setSelectedPropertyId(property.id)}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-dashed border-blue-200 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                              >
                                View interested leads
                              </button>
                            </div>

                            {isFeatured && (
                              <p className="mt-3 text-[11px] font-medium text-blue-600">
                                Added to the featured rotation. Update media before Saturday.
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Property filter</p>
              <h2 className="mt-1 text-lg font-semibold text-gray-900">Saved by users</h2>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              {usersForSelectedProperty.length} leads
            </span>
          </div>

          <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Select property
            <select
              value={selectedPropertyId ?? ""}
              onChange={(event) => setSelectedPropertyId(event.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring focus:ring-blue-100"
            >
              {favouriteProperties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.title}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-5 space-y-4">
            {usersForSelectedProperty.length === 0 && (
              <p className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                No users have saved this property yet. Promote it to increase visibility.
              </p>
            )}

            {usersForSelectedProperty.map((user) => (
              <article
                key={user.id}
                className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <span className="text-xs font-semibold text-indigo-600">{user.interestLevel}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>{user.location}</span>
                  <span>Active {user.lastActive}</span>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </div>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Unusual activity monitor</h2>
            <p className="text-sm text-gray-500">
              Stay alert to bots, fake favourites, or suspicious usage patterns.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-blue-200"
          >
            Export log
          </button>
        </header>

        <div className="mt-4 overflow-hidden rounded-xl border border-gray-100">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Property</th>
                <th className="px-5 py-3">Details</th>
                <th className="px-5 py-3">Severity</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {unusualActivity.map((alert) => {
                const resolved = resolvedAlertIds.includes(alert.id);
                const baseSeverity = severityStyles[alert.severity] ?? "bg-gray-100 text-gray-600";

                return (
                  <tr
                    key={alert.id}
                    className={`transition hover:bg-gray-50 ${resolved ? "opacity-80" : ""}`}
                  >
                    <td className="px-5 py-4 text-gray-500">{alert.timestamp}</td>
                    <td className="px-5 py-4 text-gray-700">{alert.user}</td>
                    <td className="px-5 py-4 text-gray-700">{alert.property}</td>
                    <td className="px-5 py-4 text-gray-600">{alert.description}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          resolved ? "bg-gray-200 text-gray-600" : baseSeverity
                        }`}
                      >
                        {resolved ? "Resolved" : alert.severity}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="relative inline-flex group focus-within:outline-none">
                        <button
                          type="button"
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                            resolved ? "text-emerald-600" : "text-blue-600 hover:bg-blue-50"
                          }`}
                        >
                          {resolved ? "Reviewed" : "Review"}
                        </button>

                        <div
                          className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 w-64 translate-y-2 transform rounded-xl border border-gray-100 bg-white p-4 text-left text-sm text-gray-600 shadow-xl transition-all duration-200 ease-out opacity-0 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100"
                        >
                          <p className="text-sm font-semibold text-gray-900">Follow-up actions</p>
                          <p className="text-xs text-gray-500">
                            Select an action to keep your moderation queue up to date.
                          </p>

                          <div className="mt-3 space-y-2">
                            <button
                              type="button"
                              onClick={() => markAlertResolved(alert.id)}
                              className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                resolved
                                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : "border border-gray-200 bg-white text-gray-600 hover:border-blue-200"
                              }`}
                            >
                              <FiCheckCircle size={14} />
                              {resolved ? "Marked as resolved" : "Mark as resolved"}
                            </button>

                            <button
                              type="button"
                              onClick={() => copyAlertSummary(alert)}
                              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-blue-200 hover:bg-blue-50"
                            >
                              <FiCopy size={14} />
                              Copy summary
                            </button>

                            <Link
                              href="/dashboard/listings"
                              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-blue-200 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                            >
                              Review related listings
                            </Link>
                          </div>

                          {resolved && (
                            <p className="mt-3 text-[11px] font-medium text-emerald-600">
                              Logged as resolved. It will remain visible for 7 days.
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
