// ported from gbthang - FAQ accordion - 2026-04-17
import { useState } from "react";
import { Link } from "react-router-dom";

type QA = {
  q: string;
  a: string;
};

const FAQS: QA[] = [
  {
    q: "What is GatheringGlobe?",
    a: "GatheringGlobe is a community-driven platform where you can discover, host, and join local and online events. Whether it's a small meetup, a workshop, or a concert, you'll find (or create) a gathering here.",
  },
  {
    q: "Do I need an account to browse events?",
    a: "No — anyone can browse the Discover page to see upcoming events. You only need an account to create an event, register as an attendee, or chat with other attendees.",
  },
  {
    q: "How do I create an event?",
    a: "Log in to your account and click the green “Create Event” button in the top-right of the navbar. Fill in the event title, description (at least 20 characters), date, time, location, and capacity, then publish.",
  },
  {
    q: "How do I register for an event?",
    a: "Open any event from the Discover page and click “Register & Open Chat”. You'll be automatically added to the attendee list and taken to the event's live chat room — as long as the event isn't sold out.",
  },
  {
    q: "Is the chat room live?",
    a: "Yes. Once registered, your messages are delivered in real time using Socket.io. Chat history is also persisted, so you can close and reopen the page without losing past messages.",
  },
  {
    q: "Can I see a list of events I've joined?",
    a: "Yes. Go to your Profile page from the navbar. You'll see both the events you've created and the events you've registered for, with the most recent first.",
  },
  {
    q: "What happens when an event is sold out?",
    a: "Once attendees reach the event's capacity, the registration button changes to “Sold Out” and no new attendees can join. The event page and chat room stay visible for current attendees.",
  },
  {
    q: "Is my password secure?",
    a: "Yes. Passwords are hashed with bcrypt before being stored, and authentication uses JSON Web Tokens (JWT). We never store plaintext passwords.",
  },
];

const Faq = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx((curr) => (curr === idx ? null : idx));
  };

  return (
    <div className="min-h-screen bg-root py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">💬</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-green-800 mb-2">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Everything you need to know about GatheringGlobe.
          </p>
        </div>

        {/* Accordion */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 divide-y divide-gray-100 overflow-hidden">
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx}>
                <button
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold text-gray-800">
                    {item.q}
                  </span>
                  <svg
                    className={`w-5 h-5 text-green-700 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div
                  className={`grid transition-all duration-200 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 sm:px-6 pb-5 text-sm text-gray-600 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Still have questions?{" "}
            <Link
              to="/discover"
              className="text-green-700 hover:text-green-900 font-semibold"
            >
              Browse events
            </Link>{" "}
            or reach out via the chat room on any event page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Faq;
