// ported from gbthang - TanStack Query - 2026-04-17
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import Spinner from "../components/Spinner";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  organizer_id: { _id: string; name?: string; username: string } | null;
  createdAt: string;
}

const categoryEmojis = ["🎪", "💻", "🎵", "🚀", "🎨", "🏃", "🍷", "🌟", "🎭", "📚"];
const categoryColors = [
  "from-green-100 to-green-200",
  "from-blue-100 to-blue-200",
  "from-purple-100 to-purple-200",
  "from-yellow-100 to-yellow-200",
  "from-pink-100 to-pink-200",
  "from-orange-100 to-orange-200",
];

const hashIndex = (str: string, len: number) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) % len;
  return hash;
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return dateStr;
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

const formatTime = (timeStr: string) => {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
};

const Discover = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const {
    data: events = [],
    isLoading,
    isError,
  } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: () => api<Event[]>("/api/events", { silent: true }),
  });

  const filtered = events.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-root py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Discover Events</h1>
            <p className="text-gray-500 mt-1 text-sm">
              {isLoading
                ? "Loading..."
                : search
                ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${search}"`
                : `${events.length} event${events.length !== 1 ? "s" : ""} available`}
            </p>
          </div>
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search events…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Loading state */}
        {isLoading && <Spinner size="lg" label="Loading events…" fullPage />}

        {/* Error state */}
        {!isLoading && isError && (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-gray-500">Could not load events. Please try again.</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && events.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🗓️</div>
            <p className="text-gray-500 text-lg font-medium">No events yet</p>
            <p className="text-gray-400 text-sm mt-1">Be the first to create one!</p>
          </div>
        )}

        {/* No search results */}
        {!isLoading && !isError && events.length > 0 && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg font-medium">No events match "{search}"</p>
            <button onClick={() => setSearch("")} className="mt-3 text-sm text-green-700 font-semibold hover:underline">
              Clear search
            </button>
          </div>
        )}

        {/* Event Cards */}
        {!isLoading && !isError && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event) => {
              const emoji = categoryEmojis[hashIndex(event._id, categoryEmojis.length)];
              const gradient = categoryColors[hashIndex(event.title, categoryColors.length)];

              return (
                <div
                  key={event._id}
                  className="bg-white rounded-2xl shadow hover:shadow-md transition-shadow border border-gray-100 overflow-hidden cursor-pointer group"
                  onClick={() => navigate(`/events/${event._id}`)}
                >
                  <div className={`bg-gradient-to-br ${gradient} h-36 flex items-center justify-center`}>
                    <span className="text-6xl">{emoji}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-green-800 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">
                      📅 {formatDate(event.date)} &nbsp;·&nbsp; {formatTime(event.time)}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">📍 {event.location}</p>
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        👥 {event.capacity} spots
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/events/${event._id}`);
                        }}
                        className="text-sm px-4 py-1.5 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                      >
                        View Event
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
