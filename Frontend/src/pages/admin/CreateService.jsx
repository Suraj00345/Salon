import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createService } from "../../api/service.api";

export default function CreateService() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Service name is required");
      return;
    }

    if (!formData.duration) {
      setError("Duration is required");
      return;
    }

    if (!formData.price) {
      setError("Price is required");
      return;
    }

    try {
      setLoading(true);

      const response = await createService({
        name: formData.name.trim(),
        description: formData.description.trim(),
        duration: Number(formData.duration),
        price: Number(formData.price),
      });

      setSuccess(response.message || "Service created successfully");

      setFormData({
        name: "",
        description: "",
        duration: "",
        price: "",
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        {/* Header */}

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
            Admin
          </p>

          <h1 className="mt-2 text-3xl font-bold text-stone-900">
            Create Service
          </h1>

          <p className="mt-2 text-stone-500">
            Add a new salon service to your booking system.
          </p>
        </div>

        {/* Form */}

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Name */}

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                Service Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Haircut"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
              />
            </div>

            {/* Description */}

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the service..."
                className="w-full resize-none rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
              />
            </div>

            {/* Duration + Price */}

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="duration"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Duration
                </label>

                <div className="relative">
                  <input
                    id="duration"
                    name="duration"
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="60"
                    className="w-full rounded-xl border border-stone-300 px-4 py-3 pr-16 outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-400">
                    min
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Price
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500">
                    ₹
                  </span>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="999"
                    className="w-full rounded-xl border border-stone-300 py-3 pl-9 pr-4 outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}

            <div className="flex flex-col gap-3 border-t border-stone-200 pt-6 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/admin/services")}
                className="rounded-xl border border-stone-300 px-6 py-3 font-semibold text-stone-700 transition hover:bg-stone-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-stone-900 px-6 py-3 font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Service"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
