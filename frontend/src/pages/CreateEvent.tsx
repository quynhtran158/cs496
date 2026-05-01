// ported from gbthang - event creation validation + toast - 2026-04-17
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { api, ApiError } from "../lib/api";

interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  location?: string;
  capacity?: string;
}

const CreateEvent = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(formData.date + "T00:00:00");
      if (selected < today) {
        newErrors.date = "Date cannot be in the past";
      }
    }

    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";

    if (!formData.capacity) {
      newErrors.capacity = "Capacity is required";
    } else if (Number(formData.capacity) < 1) {
      newErrors.capacity = "Capacity must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof FormErrors]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
    setServerError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError("");

    try {
      await api("/api/events", {
        method: "POST",
        token,
        body: JSON.stringify(formData),
        silent: true,
      });
      toast.success("Event published!");
      await queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate("/discover");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fieldErrors) setErrors(err.fieldErrors as FormErrors);
        setServerError(err.message);
        toast.error(err.message);
      } else {
        setServerError("Network error. Please try again.");
        toast.error("Network error. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent";

  return (
    <div className="min-h-screen bg-root py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create an Event</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Fill in the details below to publish your event.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-8">
          {serverError && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Startup Networking Night"
                className={inputClass}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Tell attendees what your event is about... (min 20 characters)"
                className={`${inputClass} resize-none`}
              />
              <div className="flex justify-between mt-1">
                {errors.description ? (
                  <p className="text-xs text-red-500">{errors.description}</p>
                ) : (
                  <p className="text-xs text-gray-400">Minimum 20 characters.</p>
                )}
                <p
                  className={`text-xs ${
                    formData.description.trim().length >= 20
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {formData.description.trim().length}/20
                </p>
              </div>
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  name="date"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.date}
                  onChange={handleChange}
                  className={inputClass}
                />
                {errors.date && (
                  <p className="mt-1 text-xs text-red-500">{errors.date}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={inputClass}
                />
                {errors.time && (
                  <p className="mt-1 text-xs text-red-500">{errors.time}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. New York, NY"
                className={inputClass}
              />
              {errors.location && (
                <p className="mt-1 text-xs text-red-500">{errors.location}</p>
              )}
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity <span className="text-red-500">*</span>
              </label>
              <input
                name="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Max number of attendees"
                className={inputClass}
              />
              {errors.capacity && (
                <p className="mt-1 text-xs text-red-500">{errors.capacity}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                {submitting ? "Publishing..." : "Publish Event"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/discover")}
                className="px-6 py-2.5 border border-gray-300 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
