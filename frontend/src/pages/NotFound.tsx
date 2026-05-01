// ported from gbthang - 404 page - 2026-04-17
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-root flex items-center justify-center px-6 py-10">
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-10 max-w-md w-full text-center">
        <div className="text-7xl mb-4">🗺️</div>
        <h1 className="text-5xl font-bold text-green-800 mb-2">404</h1>
        <p className="text-lg font-semibold text-gray-800 mb-1">Page not found</p>
        <p className="text-sm text-gray-500 mb-6">
          The page you're looking for doesn't exist, or it was moved somewhere else.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Back to Home
          </Link>
          <Link
            to="/discover"
            className="px-6 py-2.5 border border-gray-300 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Discover Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
