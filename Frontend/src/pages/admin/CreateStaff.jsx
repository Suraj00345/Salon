import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createStaff, assignService } from "../../api/staff.api";

import { getServices } from "../../api/service.api";

export default function CreateStaff() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
  });

  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  const [loading, setLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // FETCH SERVICES
  // ==========================================

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setServicesLoading(true);

        const data = await getServices();

        setServices(data.services || []);
      } catch (error) {
        console.error("Failed to fetch services:", error);

        setError(error.response?.data?.message || "Failed to load services");
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // HANDLE SERVICE SELECTION
  // ==========================================

  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceId)) {
        return prev.filter((id) => id !== serviceId);
      }

      return [...prev, serviceId];
    });
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // ------------------------------------------
    // Validation
    // ------------------------------------------

    if (!formData.name.trim()) {
      setError("Staff name is required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    // ------------------------------------------
    // Email validation
    // ------------------------------------------

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      // ----------------------------------------
      // 1. Create staff
      // ----------------------------------------

      const staffResponse = await createStaff({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        specialization: formData.specialization.trim(),
        experience:
          formData.experience === "" ? null : Number(formData.experience),
      });

      const createdStaff = staffResponse.staff;

      if (!createdStaff) {
        throw new Error("Staff was created but staff data was not returned");
      }

      // ----------------------------------------
      // 2. Assign selected services
      // ----------------------------------------

      if (selectedServices.length > 0) {
        for (const serviceId of selectedServices) {
          await assignService(createdStaff.id, serviceId);
        }
      }

      // ----------------------------------------
      // 3. Success
      // ----------------------------------------

      setSuccess(
        selectedServices.length > 0
          ? "Staff created and services assigned successfully."
          : "Staff created successfully.",
      );

      // Reset form

      setFormData({
        name: "",
        email: "",
        phone: "",
        specialization: "",
        experience: "",
      });

      setSelectedServices([]);
    } catch (error) {
      console.error("Create Staff Error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create staff",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
            Admin
          </p>

          <h1 className="mt-2 text-3xl font-bold text-stone-900">
            Create Staff Member
          </h1>

          <p className="mt-2 text-stone-500">
            Add a stylist or staff member to your salon.
          </p>
        </div>

        {/* ================================= */}
        {/* FORM CARD */}
        {/* ================================= */}

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          {/* ERROR */}

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ================================= */}
            {/* BASIC INFORMATION */}
            {/* ================================= */}

            <div>
              <h2 className="text-lg font-bold text-stone-900">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Enter the staff member's personal details.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* NAME */}

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Full Name *
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Email *
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="rahul@example.com"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                />
              </div>

              {/* PHONE */}

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Phone
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                />
              </div>

              {/* SPECIALIZATION */}

              <div>
                <label
                  htmlFor="specialization"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Specialization
                </label>

                <input
                  id="specialization"
                  name="specialization"
                  type="text"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="e.g. Hair Styling"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                />
              </div>

              {/* EXPERIENCE */}

              <div>
                <label
                  htmlFor="experience"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Experience
                </label>

                <div className="relative">
                  <input
                    id="experience"
                    name="experience"
                    type="number"
                    min="0"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="3"
                    className="w-full rounded-xl border border-stone-300 px-4 py-3 pr-16 outline-none transition focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-400">
                    years
                  </span>
                </div>
              </div>
            </div>

            {/* ================================= */}
            {/* SERVICES */}
            {/* ================================= */}

            <div className="border-t border-stone-200 pt-8">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-stone-900">
                  Assign Services
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  Select the services this staff member can provide.
                </p>
              </div>

              {servicesLoading ? (
                <div className="rounded-xl bg-stone-50 p-6 text-center text-sm text-stone-500">
                  Loading services...
                </div>
              ) : services.length === 0 ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-700">
                  No active services are available. Create a service first.
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {services.map((service) => {
                    const selected = selectedServices.includes(service.id);

                    return (
                      <label
                        key={service.id}
                        className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                          selected
                            ? "border-stone-900 bg-stone-50"
                            : "border-stone-200 hover:border-stone-400"
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-stone-900">
                            {service.name}
                          </p>

                          <p className="mt-1 text-sm text-stone-500">
                            {service.duration} min · ₹{service.price}
                          </p>
                        </div>

                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => handleServiceToggle(service.id)}
                          className="h-5 w-5 accent-stone-900"
                        />
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ================================= */}
            {/* BUTTONS */}
            {/* ================================= */}

            <div className="flex flex-col gap-3 border-t border-stone-200 pt-6 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/admin/staff")}
                disabled={loading}
                className="rounded-xl border border-stone-300 px-6 py-3 font-semibold text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-stone-900 px-6 py-3 font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating Staff..." : "Create Staff"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
