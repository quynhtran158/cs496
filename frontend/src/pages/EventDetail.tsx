// ported from gbthang - join + TanStack Query - 2026-04-17
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
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
  attendees: string[];
  organizer_id: { _id: string; name?: string; username: string } | null;
  createdAt: string;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return dateStr;
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (timeStr: string) => {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
};

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: event,
    isLoading: loading,
    isError,
    error: queryError,
  } = useQuery<Event>({
    queryKey: ["event", id],
    queryFn: () => api<Event>(`/api/events/${id}`, { silent: true }),
    enabled: !!id,
  });

  const notFound =
    isError && (queryError as { status?: number } | null)?.status === 404;

  const isRegistered = !!(
    user && event?.attendees?.some((a) => a.toString() === user._id)
  );

  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  const handleJoin = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setJoining(true);
    setJoinError("");
    try {
      await api(`/api/events/${id}/join`, {
        method: "POST",
        token,
        silent: true,
      });
      await queryClient.invalidateQueries({ queryKey: ["event", id] });
      toast.success("Ticket confirmed! Opening chat room…");
      navigate(`/events/${id}/chat`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not register for event";
      setJoinError(message);
      toast.error(message);
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-root">
        <Spinner size="lg" label="Loading event…" fullPage />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen bg-root flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-gray-600 text-lg font-medium">
            {notFound ? "Event not found." : "Could not load event details."}
          </p>
          <button
            onClick={() => navigate("/discover")}
            className="mt-4 px-5 py-2 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-800 transition-colors"
          >
            Back to Discover
          </button>
        </div>
      </div>
    );
  }

  const organizer = event.organizer_id;

  return (
    <div className="min-h-screen bg-root py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Back link */}
        <button
          onClick={() => navigate("/discover")}
          className="flex items-center gap-1.5 text-sm text-green-700 hover:text-green-900 font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Discover
        </button>

        {/* Hero banner */}
        <div className="bg-gradient-to-br from-green-600 to-green-400 rounded-2xl h-52 flex items-center justify-center shadow">
          <span className="text-8xl">🎪</span>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-5 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 break-words">{event.title}</h1>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
              <span className="text-2xl">📅</span>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date & Time</p>
                <p className="text-sm font-medium text-gray-800 mt-0.5">{formatDate(event.date)}</p>
                <p className="text-sm text-gray-600">{formatTime(event.time)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
              <span className="text-2xl">📍</span>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</p>
                <p className="text-sm font-medium text-gray-800 mt-0.5">{event.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
              <span className="text-2xl">👥</span>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Capacity</p>
                <p className="text-sm font-medium text-gray-800 mt-0.5">
                  {event.attendees?.length ?? 0} / {event.capacity} registered
                </p>
                {(event.attendees?.length ?? 0) >= event.capacity && (
                  <span className="text-xs font-semibold text-red-500 mt-0.5 inline-block">Sold Out</span>
                )}
                {isRegistered && (
                  <span className="text-xs font-semibold text-green-700 mt-0.5 inline-block">
                    ✓ You're registered
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
              <span className="text-2xl">🙋</span>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Organizer</p>
                <p className="text-sm font-medium text-gray-800 mt-0.5">
                  {organizer
                    ? organizer.name || `@${organizer.username}`
                    : "Unknown"}
                </p>
                {organizer?.name && (
                  <p className="text-xs text-gray-500">@{organizer.username}</p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-2">About this event</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3">
            {joinError && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {joinError}
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:flex-wrap">
              {isRegistered ? (
                /* Already registered — show primary "Open Chat Room" */
                <button
                  onClick={() => navigate(`/events/${id}/chat`)}
                  className="px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-lg transition-colors w-full sm:w-auto text-center flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Open Chat Room
                </button>
              ) : (event.attendees?.length ?? 0) >= event.capacity ? (
                /* Sold out */
                <button
                  disabled
                  className="px-6 py-2.5 bg-gray-300 text-gray-500 text-sm font-semibold rounded-lg cursor-not-allowed w-full sm:w-auto text-center"
                >
                  Sold Out
                </button>
              ) : (
                /* Not registered, spots available */
                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className="px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto text-center flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  {joining ? "Processing…" : "Get Ticket & Join Chat"}
                </button>
              )}
              <Link
                to="/discover"
                className="px-6 py-2.5 border border-gray-300 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto text-center"
              >
                Browse More
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EventDetail;
