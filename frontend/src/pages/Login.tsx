import { useState } from "react";
import { Link } from "react-router-dom";

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof FormErrors]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Checkpoint 1: Form submitted", formData);
    }
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: "#cce7c9" }}>
      {/* Left side: decorative panel */}
      <div className="hidden md:flex w-1/2 h-full bg-gradient-to-br from-green-400 to-green-700 items-center justify-center">
        <div className="text-center text-white px-10">
          <h1 className="text-5xl font-bold mb-4">CS496</h1>
          <p className="text-xl opacity-90">Discover, host, and buy event tickets with us</p>
        </div>
      </div>

      {/* Right side: auth form */}
      <div className="flex flex-col justify-center w-full md:w-1/2 items-center p-8">
        <div className="w-full max-w-md">
          {/* Logo / Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-800">GatheringGlobe</h2>
            <p className="text-gray-500 mt-1 text-sm">Your event platform</p>
          </div>

          {/* Tabs */}
          <div className="flex w-full rounded-lg overflow-hidden border border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                activeTab === "login"
                  ? "bg-white text-green-800 shadow"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-50"
              }`}
            >
              Log in
            </button>
            <Link
              to="/signup"
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-2.5 text-sm font-semibold text-center transition-colors ${
                activeTab === "signup"
                  ? "bg-white text-green-800 shadow"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-50"
              }`}
            >
              Sign Up
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h3 className="text-xl font-semibold text-center text-gray-800 mb-1">
              Sign in to GatheringGlobe
            </h3>
            <p className="text-center text-gray-500 text-sm mb-6">
              Discover, host, and buy event tickets with us
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-2.5 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-md transition-colors text-sm mt-2"
              >
                Sign in
              </button>
            </form>

            {/* Forgot password */}
            <p className="text-center mt-4 text-sm text-gray-500">
              <Link to="/forgot-password" className="text-blue-500 underline hover:text-blue-700">
                Forgot Password?
              </Link>
            </p>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-200" />
              <span className="mx-3 text-xs text-gray-400">OR</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            {/* Sign up link */}
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-green-700 font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
