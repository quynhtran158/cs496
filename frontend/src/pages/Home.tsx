import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-root">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-28 px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow">
          Welcome to GatheringGlobe
        </h1>
        <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
          Discover amazing events, connect with communities, and create unforgettable experiences.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/discover"
            className="px-8 py-3 bg-white text-green-800 font-bold rounded-full hover:bg-green-50 transition-colors text-lg shadow"
          >
            Discover Events
          </Link>
          <Link
            to="/create-event"
            className="px-8 py-3 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-green-800 transition-colors text-lg"
          >
            Create an Event
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Why GatheringGlobe?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              emoji: "🎉",
              title: "Discover Events",
              desc: "Browse thousands of local and global events tailored to your interests.",
              link: "/discover",
            },
            {
              emoji: "✏️",
              title: "Create Events",
              desc: "Host your own events, manage tickets, and grow your audience.",
              link: "/create-event",
            },
            {
              emoji: "👤",
              title: "Your Profile",
              desc: "Track your events, tickets, and connect with like-minded people.",
              link: "/profile",
            },
          ].map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className="bg-white rounded-2xl shadow hover:shadow-md transition-shadow p-8 flex flex-col items-center text-center gap-3 border border-gray-100"
            >
              <span className="text-5xl">{card.emoji}</span>
              <h3 className="text-xl font-bold text-gray-800">{card.title}</h3>
              <p className="text-gray-500 text-sm">{card.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-50 py-16 px-6 text-center border-t border-green-100">
        <h2 className="text-3xl font-bold text-green-800 mb-3">
          Ready to get started?
        </h2>
        <p className="text-gray-600 mb-6 text-lg">
          Join thousands of event-goers and organizers on GatheringGlobe.
        </p>
        <Link
          to="/signup"
          className="inline-block px-8 py-3 bg-green-700 hover:bg-green-800 text-white font-bold rounded-full transition-colors text-lg shadow"
        >
          Get Started — It's Free
        </Link>
      </section>
    </div>
  );
};

export default Home;
