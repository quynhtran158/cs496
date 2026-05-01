// ported from gbthang - chat room page + TanStack Query - 2026-04-17
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { api } from "../lib/api";
import Spinner from "../components/Spinner";

interface ChatMsg {
  _id?: string;
  eventId: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
}

interface Event {
  _id: string;
  title: string;
  attendees: string[];
}

const Chat = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();
  const { socket, isConnected } = useSocket();

  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load event title (TanStack Query)
  const { data: event } = useQuery<Event>({
    queryKey: ["event", eventId],
    queryFn: () => api<Event>(`/api/events/${eventId}`, { silent: true }),
    enabled: !!eventId,
  });

  // Registration guard — redirect non-attendees back to the event page
  useEffect(() => {
    if (!event || !user) return;
    const registered = event.attendees?.some((a) => a.toString() === user._id);
    if (!registered) {
      toast.error("You must register for this event to access the chat.");
      navigate(`/events/${eventId}`, { replace: true });
    }
  }, [event, user, eventId, navigate]);

  // Load chat history (TanStack Query)
  const { data: history, isLoading: loadingHistory } = useQuery<ChatMsg[]>({
    queryKey: ["chatHistory", eventId],
    queryFn: () =>
      api<ChatMsg[]>(`/api/chatrooms/${eventId}/messages`, {
        token,
        silent: true,
      }),
    enabled: !!eventId && !!token,
  });

  useEffect(() => {
    if (history) setMessages(history);
  }, [history]);

  // Join socket room and listen for new messages
  useEffect(() => {
    if (!socket || !eventId || !user) return;

    socket.emit("join_room", { eventId, username: user.username });

    const handleReceive = (msg: ChatMsg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
      socket.emit("leave_room", { eventId });
    };
  }, [socket, eventId, user]);

  const handleSend = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const text = input.trim();
      if (!text || !socket || !eventId || !user) return;

      socket.emit("send_message", {
        eventId,
        userId: user._id,
        username: user.username,
        text,
      });
      setInput("");
      inputRef.current?.focus();
    },
    [input, socket, eventId, user]
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-root flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">You must be logged in to access the chat.</p>
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-800 transition-colors"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-root py-4 sm:py-6 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto flex flex-col gap-3 sm:gap-4">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/events/${eventId}`)}
            className="flex items-center gap-1.5 text-sm text-green-700 hover:text-green-900 font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Event
          </button>
        </div>

        {/* D4: use dynamic viewport height (dvh) so mobile browser chrome doesn't cut off input */}
        <div
          className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden flex flex-col h-[calc(100dvh-150px)] sm:h-[calc(100dvh-160px)]"
        >

          {/* Chat Header */}
          <div className="bg-gradient-to-r from-green-700 to-green-500 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
            <div className="min-w-0">
              <h1 className="text-white font-bold text-base sm:text-lg truncate">
                {event ? event.title : "Loading…"} — Chat Room
              </h1>
              <p className="text-green-100 text-xs mt-0.5 flex items-center gap-1.5">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-300" : "bg-gray-400"
                  }`}
                />
                {isConnected ? "Connected" : "Connecting…"}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
            {loadingHistory && <Spinner size="md" label="Loading chat history…" />}

            {!loadingHistory && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="text-4xl mb-3">💬</span>
                <p className="text-gray-500 text-sm font-medium">No messages yet</p>
                <p className="text-gray-400 text-xs mt-1">Be the first to say something!</p>
              </div>
            )}

            {messages.map((msg, idx) => {
              const isMe = msg.username === user?.username;
              const showName =
                idx === 0 || messages[idx - 1]?.username !== msg.username;

              return (
                <div
                  key={msg._id ?? `${idx}-${msg.createdAt}`}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  {showName && (
                    <span className="text-xs text-gray-400 mb-1 px-1">
                      {isMe ? "You" : msg.username}
                    </span>
                  )}
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? "bg-green-700 text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-800 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-300 mt-0.5 px-1">
                    {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="border-t border-gray-100 px-3 sm:px-4 py-3 flex items-center gap-2 sm:gap-3 flex-shrink-0 bg-white"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isConnected ? "Type a message…" : "Connecting…"}
              disabled={!isConnected}
              className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed bg-gray-50"
            />
            <button
              type="submit"
              disabled={!isConnected || !input.trim()}
              className="px-3 sm:px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 flex-shrink-0"
              aria-label="Send message"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
