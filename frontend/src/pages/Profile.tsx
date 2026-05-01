// ported from gbthang - real profile data + TanStack Query - 2026-04-17
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import Spinner from "../components/Spinner";

interface EventSummary {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  attendees: string[];
  organizer_id?:
    | string
    | { _id: string; name?: string; username: string }
    | null;
  createdAt: string;
}

interface ProfileData {
  user: {
    _id: string;
    name?: string;
    username: string;
    email: string;
    bio?: string;
    imageUrl?: string;
    createdAt: string;
  };
  createdEvents: EventSummary[];
  registeredEvents: EventSummary[];
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return dateStr;
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatJoined = (iso?: string) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const EventRow = ({
  event,
  navigate,
}: {
  event: EventSummary;
  navigate: (p: string) => void;
}) => {
  const registered = event.attendees?.length ?? 0;
  const pct = event.capacity > 0 ? Math.round((registered / event.capacity) * 100) : 0;
  const barClass =
    pct >= 80 ? "bg-red-400" : pct >= 50 ? "bg-yellow-400" : "bg-green-500";

  return (
    <button
      onClick={() => navigate(`/events/${event._id}`)}
      className="w-full text-left flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-colors group"
    >
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-2xl flex-shrink-0">
        🎪
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 text-sm truncate group-hover:text-green-800">
          {event.title}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          📅 {formatDate(event.date)} &nbsp;·&nbsp; 📍 {event.location}
        </p>
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>
              {registered} / {event.capacity} registered
            </span>
            <span className={pct >= 80 ? "text-red-500 font-medium" : ""}>
              {pct}% full
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${barClass}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </button>
  );
};

const Profile = () => {
  const { token, user: authUser, logout } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: () => api<ProfileData>("/api/users/me", { token, silent: true }),
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-root">
        <Spinner size="lg" label="Loading your profile…" fullPage />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-root flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-gray-600 text-lg font-medium">Could not load profile.</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-5 py-2 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { user, createdEvents, registeredEvents } = data;
  const displayName = user.name || authUser?.name || user.username;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-root py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ── Profile Header Card ───────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-green-600 to-green-400" />

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12 gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-green-700 flex items-center justify-center">
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={displayName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-2xl font-bold">
                      {getInitials(displayName)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-3">
              <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
              <p className="text-gray-500 text-sm">@{user.username}</p>
              {user.bio && (
                <p className="text-gray-600 text-sm mt-2 max-w-xl">{user.bio}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-400">
                <span>✉️ {user.email}</span>
                <span>📅 Joined {formatJoined(user.createdAt)}</span>
                <span>🎪 {createdEvents.length} events hosted</span>
                <span>🎟️ {registeredEvents.length} events registered</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Created Events ────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-800">
              Events I'm Hosting ({createdEvents.length})
            </h2>
            <Link
              to="/create-event"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              + New Event
            </Link>
          </div>

          {createdEvents.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🗓️</div>
              <p className="text-gray-500 text-sm">You haven't created any events yet.</p>
              <Link
                to="/create-event"
                className="inline-block mt-3 px-4 py-2 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-800 transition-colors"
              >
                Create your first event
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {createdEvents.map((e) => (
                <EventRow key={e._id} event={e} navigate={navigate} />
              ))}
            </div>
          )}
        </div>

        {/* ── Registered Events ─────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-5">
            Events I'm Attending ({registeredEvents.length})
          </h2>

          {registeredEvents.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🎟️</div>
              <p className="text-gray-500 text-sm">You haven't registered for any events yet.</p>
              <Link
                to="/discover"
                className="inline-block mt-3 px-4 py-2 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-800 transition-colors"
              >
                Browse events
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {registeredEvents.map((e) => (
                <EventRow key={e._id} event={e} navigate={navigate} />
              ))}
            </div>
          )}
        </div>

        {/* ── Account ──────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Account
          </h2>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
