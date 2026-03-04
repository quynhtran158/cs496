import { useState } from "react";
import { Link } from "react-router-dom";

interface SignupFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
}

const Signup = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "This field is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    } else if (formData.email.length < 8) {
      newErrors.email = "Email must be at least 8 characters";
    }

    if (!formData.username) {
      newErrors.username = "This field is required";
    } else if (formData.username.length < 4) {
      newErrors.username = "Username must be at least 4 characters";
    }

    if (!formData.password) {
      newErrors.password = "This field is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "This field is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Your passwords do not match";
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
      setSubmitted(true);
    }
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: "#cce7c9" }}>
      {/* Left side: decorative panel */}
      <div className="hidden md:flex w-1/2 h-full bg-gradient-to-br from-green-400 to-green-700 items-center justify-center">
        <div className="text-center text-white px-10">
          <h1 className="text-5xl font-bold mb-4">CS496</h1>
          <p className="text-xl opacity-90">
            Join us to unlock exclusive features now
          </p>
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
            <Link
              to="/login"
              className="flex-1 py-2.5 text-sm font-semibold text-center bg-gray-100 text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Log in
            </Link>
            <button
              className="flex-1 py-2.5 text-sm font-semibold bg-white text-green-800 shadow transition-colors"
            >
              Sign Up
            </button>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl shadow-md p-8">
            {submitted ? (
              <div className="text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Account Created!</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Welcome to GatheringGlobe, {formData.username}!
                </p>
                <Link
                  to="/login"
                  className="inline-block py-2.5 px-6 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-md transition-colors text-sm"
                >
                  Go to Login
                </Link>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">New user?</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Join us to unlock exclusive features now
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Enter your email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Username */}
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Enter your username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="johndoe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    {errors.username && (
                      <p className="mt-1 text-xs text-red-500">{errors.username}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Enter your password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min. 8 characters"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Confirm your password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-md transition-colors text-sm mt-2"
                  >
                    Sign Up
                  </button>
                </form>

                {/* Login link */}
                <p className="text-center text-sm text-gray-600 mt-4">
                  Already have an account?{" "}
                  <Link to="/login" className="text-green-700 font-semibold hover:underline">
                    Log in
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
