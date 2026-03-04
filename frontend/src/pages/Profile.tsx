import { Link } from "react-router-dom";

const Profile = () => {
  return (
    <div className="min-h-screen bg-root py-10 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 mb-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-4xl text-white font-bold shadow-md">
            U
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-800">Guest User</h1>
            <p className="text-gray-500 text-sm mt-1">guest@example.com</p>
            <span className="inline-block mt-2 text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
              Member since 2026
            </span>
          </div>
          <div className="sm:ml-auto">
            <button className="px-5 py-2 border border-green-600 text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors text-sm">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Events Attended", value: "0" },
            { label: "Events Hosted", value: "0" },
            { label: "Tickets Owned", value: "0" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow border border-gray-100 p-5 text-center"
            >
              <p className="text-3xl font-bold text-green-700">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "🔍 Discover Events", to: "/discover" },
              { label: "✏️ Create an Event", to: "/create-event" },
              { label: "🔐 Log In", to: "/login" },
              { label: "🆕 Sign Up", to: "/signup" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-2 px-4 py-3 bg-green-50 hover:bg-green-100 text-green-800 font-medium rounded-lg transition-colors text-sm"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Placeholder message */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-center">
          <p className="text-yellow-800 text-sm font-medium">
            🚧 Full profile functionality coming soon. Log in to unlock all features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
