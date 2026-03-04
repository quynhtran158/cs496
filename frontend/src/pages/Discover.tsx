const mockEvents = [
  {
    id: 1,
    title: "Tech Summit 2026",
    date: "April 15, 2026",
    location: "San Francisco, CA",
    category: "Technology",
    emoji: "💻",
    price: "$49",
  },
  {
    id: 2,
    title: "Spring Music Festival",
    date: "May 3, 2026",
    location: "Austin, TX",
    category: "Music",
    emoji: "🎵",
    price: "$25",
  },
  {
    id: 3,
    title: "Startup Networking Night",
    date: "March 20, 2026",
    location: "New York, NY",
    category: "Business",
    emoji: "🚀",
    price: "Free",
  },
  {
    id: 4,
    title: "Art & Culture Expo",
    date: "June 10, 2026",
    location: "Chicago, IL",
    category: "Arts",
    emoji: "🎨",
    price: "$15",
  },
  {
    id: 5,
    title: "Marathon for Good",
    date: "April 28, 2026",
    location: "Boston, MA",
    category: "Sports",
    emoji: "🏃",
    price: "$30",
  },
  {
    id: 6,
    title: "Food & Wine Tasting",
    date: "May 17, 2026",
    location: "Napa Valley, CA",
    category: "Food",
    emoji: "🍷",
    price: "$75",
  },
];

const Discover = () => {
  return (
    <div className="min-h-screen bg-root py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Discover Events</h1>
          <p className="text-gray-500 text-lg">
            Find events that match your interests and connect with your community.
          </p>
        </div>

        {/* Search bar */}
        <div className="flex gap-3 mb-10 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search events, locations, categories..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button className="px-6 py-3 bg-green-700 text-white rounded-lg font-semibold text-sm hover:bg-green-800 transition-colors">
            Search
          </button>
        </div>

        {/* Event Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-br from-green-100 to-green-200 h-36 flex items-center justify-center">
                <span className="text-6xl">{event.emoji}</span>
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-full">
                  {event.category}
                </span>
                <h3 className="text-lg font-bold text-gray-800 mt-2 mb-1">{event.title}</h3>
                <p className="text-sm text-gray-500 mb-1">📅 {event.date}</p>
                <p className="text-sm text-gray-500 mb-3">📍 {event.location}</p>
                <div className="flex items-center justify-between">
                  <span className="text-green-700 font-bold">{event.price}</span>
                  <button className="text-sm px-4 py-1.5 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
                    View Event
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discover;
