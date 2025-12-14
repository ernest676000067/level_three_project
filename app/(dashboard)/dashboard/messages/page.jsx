"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  FiSearch,
  FiFilter,
  FiSend,
  FiAlertTriangle,
  FiMail,
  FiPhone,
  FiUser,
  FiTag,
  FiMessageCircle,
  FiRefreshCw,
  FiClock,
} from "react-icons/fi";

const initialInquiries = [
  {
    id: "inq-301",
    subject: "Viewing request - Luxury Villa",
    propertyTitle: "Luxury Villa in Bonapriso",
    propertyId: "prop-1001",
    clientName: "Elise N.",
    email: "elise.n@example.com",
    phone: "+237 670 123 456",
    createdAt: "2025-12-07T13:45:00Z",
    lastContact: "2025-12-07T15:10:00Z",
    status: "Open",
    priority: "High",
    assignedTo: "Clarisse M.",
    unread: true,
    tags: ["5 bedrooms", "Pool", "Garden"],
    thread: [
      {
        id: "msg-1",
        sender: "client",
        content: "Hello, I saw the villa listing and would like to schedule a visit this weekend. Is it still available?",
        time: "2025-12-07T13:45:00Z",
      },
      {
        id: "msg-2",
        sender: "agent",
        content: "Hi Elise! Yes, the villa is available. Saturday afternoon has a free slot—does that work for you?",
        time: "2025-12-07T14:05:00Z",
      },
      {
        id: "msg-3",
        sender: "client",
        content: "Saturday 3 PM would be perfect. Please confirm the address.",
        time: "2025-12-07T15:10:00Z",
      },
    ],
  },
  {
    id: "inq-302",
    subject: "Availability inquiry - Modern Apartment",
    propertyTitle: "Modern Apartment with City View",
    propertyId: "prop-1010",
    clientName: "Marc D.",
    email: "marc.djoumessi@example.com",
    phone: "+237 699 221 110",
    createdAt: "2025-12-06T10:12:00Z",
    lastContact: "2025-12-08T09:08:00Z",
    status: "Pending",
    priority: "Medium",
    assignedTo: "Joel T.",
    unread: false,
    tags: ["3 rooms", "City center"],
    thread: [
      {
        id: "msg-1",
        sender: "client",
        content: "Good morning. Is the modern apartment in Akwa still accepting new tenants for January?",
        time: "2025-12-06T10:12:00Z",
      },
      {
        id: "msg-2",
        sender: "agent",
        content: "Hi Marc, thanks for reaching out. The unit is currently reserved, but the status might change. Can I keep you informed?",
        time: "2025-12-06T11:40:00Z",
      },
      {
        id: "msg-3",
        sender: "client",
        content: "Sure, please add me to the waiting list. Is there a similar property nearby?",
        time: "2025-12-08T09:08:00Z",
      },
    ],
  },
  {
    id: "inq-303",
    subject: "Follow-up on documents",
    propertyTitle: "Spacious Duplex with Pool",
    propertyId: "prop-1005",
    clientName: "Cynthia N.",
    email: "cynthia.ndongo@example.com",
    phone: "+237 677 442 198",
    createdAt: "2025-12-05T17:25:00Z",
    lastContact: "2025-12-06T09:55:00Z",
    status: "Resolved",
    priority: "Low",
    assignedTo: "Clarisse M.",
    unread: false,
    tags: ["Documents", "Lease"],
    thread: [
      {
        id: "msg-1",
        sender: "client",
        content: "Hello Clarisse, I sent the missing documents yesterday. Can you confirm reception?",
        time: "2025-12-05T17:25:00Z",
      },
      {
        id: "msg-2",
        sender: "agent",
        content: "Hi Cynthia, I confirm we received them. I'll send the lease draft later today.",
        time: "2025-12-05T18:10:00Z",
      },
      {
        id: "msg-3",
        sender: "agent",
        content: "Lease documents have been shared via email. Let me know if anything looks off!",
        time: "2025-12-06T09:55:00Z",
      },
    ],
  },
  {
    id: "inq-304",
    subject: "Corporate lease proposal",
    propertyTitle: "Commercial Space near Business District",
    propertyId: "prop-1003",
    clientName: "Klein & Co.",
    email: "contact@klein-business.com",
    phone: "+237 655 778 099",
    createdAt: "2025-12-04T08:30:00Z",
    lastContact: "2025-12-07T16:30:00Z",
    status: "Pending",
    priority: "High",
    assignedTo: "Sandrine K.",
    unread: true,
    tags: ["Corporate", "Long-term"],
    thread: [
      {
        id: "msg-1",
        sender: "client",
        content: "We are considering a 3-year lease for the commercial space. Could you provide the rental terms and availability?",
        time: "2025-12-04T08:30:00Z",
      },
      {
        id: "msg-2",
        sender: "agent",
        content: "Hello Klein & Co., thanks for your interest. I've attached the terms for review.",
        time: "2025-12-04T09:15:00Z",
      },
      {
        id: "msg-3",
        sender: "client",
        content: "Thank you. We have a few edits on clauses 4 and 7. Let's discuss further.",
        time: "2025-12-07T16:30:00Z",
      },
    ],
  },
];

const statusFilters = [
  { label: "All", value: "all" },
  { label: "Open", value: "Open" },
  { label: "Pending", value: "Pending" },
  { label: "Resolved", value: "Resolved" },
];

const priorityStyles = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-emerald-100 text-emerald-700",
};

const statusStyles = {
  Open: "bg-blue-100 text-blue-700",
  Pending: "bg-amber-100 text-amber-700",
  Resolved: "bg-emerald-100 text-emerald-700",
};

const quickReplies = [
  "Thanks for reaching out! I'll get back to you shortly.",
  "The property is available—let me share the next steps.",
  "Can we schedule a viewing this week?",
];

const formatTimestamp = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString("en-GB", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function MessagesPage() {
  const [messages, setMessages] = useState(initialInquiries);
  const [selectedMessageId, setSelectedMessageId] = useState(
    initialInquiries[0]?.id ?? null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [replyText, setReplyText] = useState("");

  const stats = useMemo(() => {
    const openCount = messages.filter((message) => message.status === "Open").length;
    const pendingCount = messages.filter((message) => message.status === "Pending").length;
    const resolvedCount = messages.filter((message) => message.status === "Resolved").length;
    const unreadCount = messages.filter((message) => message.unread).length;

    return [
      {
        label: "Open inquiries",
        value: openCount,
        description: "Need a reply",
      },
      {
        label: "Pending follow-ups",
        value: pendingCount,
        description: "Awaiting client",
      },
      {
        label: "Resolved",
        value: resolvedCount,
        description: "Closed conversations",
      },
      {
        label: "New today",
        value: unreadCount,
        description: "Unread messages",
      },
    ];
  }, [messages]);

  const filteredMessages = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    return [...messages]
      .filter((message) => {
        const matchesStatus =
          statusFilter === "all" || message.status === statusFilter;

        const matchesSearch =
          !normalizedTerm ||
          message.subject.toLowerCase().includes(normalizedTerm) ||
          message.propertyTitle.toLowerCase().includes(normalizedTerm) ||
          message.clientName.toLowerCase().includes(normalizedTerm) ||
          message.email.toLowerCase().includes(normalizedTerm) ||
          message.tags.some((tag) => tag.toLowerCase().includes(normalizedTerm));

        return matchesStatus && matchesSearch;
      })
      .sort(
        (a, b) => new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime(),
      );
  }, [messages, searchTerm, statusFilter]);

  useEffect(() => {
    if (
      filteredMessages.length > 0 &&
      !filteredMessages.some((message) => message.id === selectedMessageId)
    ) {
      setSelectedMessageId(filteredMessages[0].id);
      setReplyText("");
    }

    if (filteredMessages.length === 0) {
      setSelectedMessageId(null);
    }
  }, [filteredMessages, selectedMessageId]);

  const selectedMessage = useMemo(() => {
    if (!selectedMessageId) return null;
    return messages.find((message) => message.id === selectedMessageId) ?? null;
  }, [messages, selectedMessageId]);

  const handleSelectMessage = (messageId) => {
    setSelectedMessageId(messageId);
    setReplyText("");
    setMessages((previous) =>
      previous.map((message) =>
        message.id === messageId ? { ...message, unread: false } : message,
      ),
    );
  };

  const handleStatusChange = (messageId, newStatus) => {
    setMessages((previous) =>
      previous.map((message) =>
        message.id === messageId ? { ...message, status: newStatus } : message,
      ),
    );
  };

  const handleToggleUnread = (messageId) => {
    setMessages((previous) =>
      previous.map((message) =>
        message.id === messageId
          ? { ...message, unread: !message.unread }
          : message,
      ),
    );
  };

  const handleAssignAgent = (messageId, agent) => {
    setMessages((previous) =>
      previous.map((message) =>
        message.id === messageId ? { ...message, assignedTo: agent } : message,
      ),
    );
  };

  const handleQuickReply = (text) => {
    setReplyText(text);
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedMessageId) {
      return;
    }

    const newEntry = {
      id: `agent-${Date.now()}`,
      sender: "agent",
      content: replyText.trim(),
      time: new Date().toISOString(),
    };

    setMessages((previous) =>
      previous.map((message) => {
        if (message.id !== selectedMessageId) {
          return message;
        }

        const nextStatus =
          message.status === "Resolved" ? "Pending" : message.status;

        return {
          ...message,
          status: nextStatus,
          unread: false,
          lastContact: newEntry.time,
          thread: [...message.thread, newEntry],
        };
      }),
    );

    setReplyText("");
  };

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
            <FiMessageCircle className="text-blue-600" />
            Client Inquiries
          </h1>
          <p className="text-sm text-gray-500">
            Respond to tenant questions, coordinate viewings, and keep the conversation organized.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 transition hover:border-blue-200"
          >
            <FiRefreshCw className="text-base text-blue-500" />
            Sync with CRM
          </button>

          <Link
            href="/dashboard/listings"
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A2342] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0c2d55]"
          >
            Manage properties
          </Link>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {card.label}
            </p>
            <p className="mt-1 text-xl font-semibold text-[#0A2342]">{card.value}</p>
            <p className="text-xs text-gray-500">{card.description}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[330px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="space-y-4">
            <div className="relative">
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by client, property, or keyword"
                className="h-11 w-full rounded-lg border border-gray-200 pl-11 pr-4 text-sm outline-none transition focus:border-blue-300 focus:ring focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {statusFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setStatusFilter(filter.value)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    statusFilter === filter.value
                      ? "bg-[#0A2342] text-white"
                      : "border border-gray-200 bg-white text-gray-600 hover:border-blue-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {filteredMessages.length === 0 && (
              <p className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                No inquiries match your current filters.
              </p>
            )}

            {filteredMessages.map((message) => {
              const isActive = message.id === selectedMessageId;
              const priorityClass = priorityStyles[message.priority] ?? "bg-gray-100 text-gray-600";
              const statusClass = statusStyles[message.status] ?? "bg-gray-100 text-gray-600";

              return (
                <button
                  key={message.id}
                  type="button"
                  onClick={() => handleSelectMessage(message.id)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                    isActive
                      ? "border-blue-200 bg-blue-50 shadow-sm"
                      : "border-gray-100 bg-white hover:border-blue-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{message.clientName}</p>
                      <p className="text-xs text-gray-500">{message.propertyTitle}</p>
                    </div>
                    <span className="text-[11px] text-gray-400">{formatTimestamp(message.lastContact)}</span>
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">{message.subject}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ${statusClass}`}>
                      {message.status}
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ${priorityClass}`}>
                      <FiAlertTriangle size={12} />
                      {message.priority} priority
                    </span>
                    {message.unread && (
                      <span className="inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" aria-hidden />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          {selectedMessage ? (
            <div className="flex h-full flex-col">
              <div className="border-b border-gray-100 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold text-gray-900">{selectedMessage.propertyTitle}</h2>
                      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                        statusStyles[selectedMessage.status] ?? "bg-gray-100 text-gray-600"
                      }`}
                      >
                        {selectedMessage.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Inquiry from {selectedMessage.clientName}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <FiUser />
                        Assigned to {selectedMessage.assignedTo}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FiMail />
                        {selectedMessage.email}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FiPhone />
                        {selectedMessage.phone}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <select
                      value={selectedMessage.status}
                      onChange={(event) => handleStatusChange(selectedMessage.id, event.target.value)}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring focus:ring-blue-100"
                    >
                      <option value="Open">Mark as open</option>
                      <option value="Pending">Mark as pending</option>
                      <option value="Resolved">Mark as resolved</option>
                    </select>

                    <select
                      value={selectedMessage.assignedTo}
                      onChange={(event) => handleAssignAgent(selectedMessage.id, event.target.value)}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring focus:ring-blue-100"
                    >
                      <option value="Clarisse M.">Clarisse M.</option>
                      <option value="Joel T.">Joel T.</option>
                      <option value="Sandrine K.">Sandrine K.</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleToggleUnread(selectedMessage.id)}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 transition hover:border-blue-200"
                    >
                      {selectedMessage.unread ? "Mark as read" : "Mark as unread"}
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <FiClock />
                    Created {formatTimestamp(selectedMessage.createdAt)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FiMessageCircle />
                    Last contact {formatTimestamp(selectedMessage.lastContact)}
                  </span>
                  {selectedMessage.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-600"
                    >
                      <FiTag />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-4">
                  {selectedMessage.thread.map((entry) => {
                    const isAgent = entry.sender === "agent";

                    return (
                      <div
                        key={entry.id}
                        className={`flex ${isAgent ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                            isAgent
                              ? "rounded-tr-sm bg-[#0A2342] text-white"
                              : "rounded-tl-sm bg-gray-100 text-gray-800"
                          }`}
                        >
                          <p>{entry.content}</p>
                          <span className={`mt-2 block text-[11px] ${isAgent ? "text-blue-100" : "text-gray-500"}`}>
                            {formatTimestamp(entry.time)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-gray-100 bg-gray-50 px-6 py-5">
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((text) => (
                    <button
                      key={text}
                      type="button"
                      onClick={() => handleQuickReply(text)}
                      className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 transition hover:border-blue-200 hover:bg-white"
                    >
                      {text}
                    </button>
                  ))}
                </div>

                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
                  <textarea
                    value={replyText}
                    onChange={(event) => setReplyText(event.target.value)}
                    rows={3}
                    placeholder="Write a reply to the client..."
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-300 focus:ring focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={handleSendReply}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A2342] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0c2d55]"
                  >
                    <FiSend />
                    Send reply
                  </button>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Replies sync with the client portal and email notifications.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-12 text-center text-gray-500">
              <FiMessageCircle className="text-4xl text-gray-300" />
              <p className="text-sm">No inquiries match the selected filters. Adjust your filters to see more conversations.</p>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
