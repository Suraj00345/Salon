import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/common/Navbar";

import {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  assignService,
  // If your staff API has an unassign method, import it:
  // removeService,
} from "../../api/staff.api";

import { getServices } from "../../api/service.api";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  specialization: "",
  experience: "",
};

export default function AdminStaff() {
  const [staff, setStaff] = useState([]);
  const [services, setServices] = useState([]);

  const [form, setForm] = useState(INITIAL_FORM);
  const [selectedServices, setSelectedServices] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(true);

  // ==========================================
  // LOAD DATA
  // ==========================================

  const loadStaff = async () => {
    try {
      const data = await getStaff();
      setStaff(data.staff || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load staff");
    }
  };

  const loadServices = async () => {
    try {
      setServicesLoading(true);
      const data = await getServices();
      setServices(data.services || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load services");
    } finally {
      setServicesLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
    loadServices();
  }, []);

  // ==========================================
  // INPUT & TOGGLE HANDLERS
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId],
    );
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setSelectedServices([]);
    setEditingId(null);
  };

  // ==========================================
  // SUBMIT (CREATE / UPDATE)
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Name is required");
      return;
    }

    if (!form.email.trim()) {
      alert("Email is required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        specialization: form.specialization.trim(),
        experience: form.experience === "" ? null : Number(form.experience),
      };

      if (editingId) {
        // 1. Update Staff Details
        await updateStaff(editingId, payload);

        // 2. Sync Services (Assign added services)
        const currentMember = staff.find((m) => m.id === editingId);
        const originalServiceIds =
          currentMember?.Services?.map((s) => s.id) || [];

        const addedServices = selectedServices.filter(
          (id) => !originalServiceIds.includes(id),
        );

        if (addedServices.length > 0) {
          await Promise.allSettled(
            addedServices.map((serviceId) =>
              assignService(editingId, serviceId),
            ),
          );
        }

        alert("Staff updated successfully");
      } else {
        // 1. Create Staff
        const response = await createStaff(payload);
        const createdStaff = response?.staff || response?.data?.staff;

        // 2. Assign Initial Services
        if (createdStaff?.id && selectedServices.length > 0) {
          await Promise.allSettled(
            selectedServices.map((serviceId) =>
              assignService(createdStaff.id, serviceId),
            ),
          );
        }

        alert("Staff created successfully");
      }

      resetForm();
      await loadStaff();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save staff");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // EDIT & DELETE
  // ==========================================

  const handleEdit = (member) => {
    setEditingId(member.id);

    setForm({
      name: member.name || "",
      email: member.email || "",
      phone: member.phone || "",
      specialization: member.specialization || "",
      experience: member.experience ?? "",
    });

    const assignedServiceIds =
      member.Services?.map((service) => service.id) || [];
    setSelectedServices(assignedServiceIds);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) {
      return;
    }

    try {
      setLoading(true);
      await deleteStaff(id);
      if (editingId === id) resetForm();
      await loadStaff();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
                Admin
              </p>
              <h1 className="mt-2 text-3xl font-bold text-stone-900">
                Manage Staff
              </h1>
              <p className="mt-1 text-stone-500">
                Manage salon staff members and assign their services.
              </p>
            </div>

            <Link
              to="/admin/working-hours"
              className="inline-flex items-center justify-center rounded-lg bg-stone-900 px-5 py-3 font-semibold text-white transition hover:bg-stone-800"
            >
              Manage Working Hours
            </Link>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-stone-900">
                  {editingId ? "Edit Staff" : "Add Staff"}
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  {editingId
                    ? "Update staff profile and assigned capabilities."
                    : "Add a new stylist to your salon roster."}
                </p>
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm font-medium text-stone-500 hover:text-stone-900"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {/* INPUT FIELDS */}
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Name *
                </label>
                <input
                  name="name"
                  placeholder="Staff name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-stone-300 p-3 outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Email *
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="staff@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-stone-300 p-3 outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Phone
                </label>
                <input
                  name="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-stone-300 p-3 outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Specialization
                </label>
                <input
                  name="specialization"
                  placeholder="Hair Styling, Coloring"
                  value={form.specialization}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-stone-300 p-3 outline-none focus:border-stone-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Experience
                </label>
                <div className="relative max-w-xs">
                  <input
                    name="experience"
                    type="number"
                    min="0"
                    placeholder="3"
                    value={form.experience}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-stone-300 p-3 pr-20 outline-none focus:border-stone-900"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-400">
                    years
                  </span>
                </div>
              </div>
            </div>

            {/* ASSIGN SERVICES (VISIBLE IN BOTH CREATE & EDIT) */}
            <div className="mt-8 border-t border-stone-200 pt-6">
              <h3 className="font-bold text-stone-900">Assign Services</h3>
              <p className="mt-1 text-sm text-stone-500">
                Select the services this staff member can provide.
              </p>

              {servicesLoading ? (
                <p className="mt-4 text-sm text-stone-500">
                  Loading services...
                </p>
              ) : services.length === 0 ? (
                <p className="mt-4 rounded-xl bg-stone-50 p-4 text-sm text-stone-500">
                  No services available.
                </p>
              ) : (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {services.map((service) => {
                    const isSelected = selectedServices.includes(service.id);

                    return (
                      <label
                        key={service.id}
                        className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                          isSelected
                            ? "border-stone-900 bg-stone-50 ring-1 ring-stone-900"
                            : "border-stone-200 hover:border-stone-300"
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
                          checked={isSelected}
                          onChange={() => handleServiceToggle(service.id)}
                          className="h-5 w-5 accent-stone-900"
                        />
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="mt-8 rounded-xl bg-stone-900 px-6 py-3 font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving..." : editingId ? "Update Staff" : "Add Staff"}
            </button>
          </form>

          {/* STAFF LIST */}
          <div className="mt-10">
            <h2 className="text-xl font-bold text-stone-900">Staff Members</h2>

            {staff.length === 0 ? (
              <div className="mt-5 rounded-2xl bg-white p-8 text-center shadow-sm">
                <p className="text-stone-500">No staff members found.</p>
              </div>
            ) : (
              <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {staff.map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm"
                  >
                    <div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-900 text-lg font-bold text-white">
                        {member.name?.charAt(0).toUpperCase()}
                      </div>

                      <h3 className="mt-4 text-xl font-bold text-stone-900">
                        {member.name}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-stone-600">
                        {member.specialization || "Professional Stylist"}
                      </p>

                      <p className="mt-2 text-sm text-stone-500">
                        {member.email}
                      </p>

                      {member.phone && (
                        <p className="text-sm text-stone-500">{member.phone}</p>
                      )}

                      {member.experience !== null &&
                        member.experience !== undefined && (
                          <p className="mt-1 text-sm text-stone-400">
                            {member.experience} years experience
                          </p>
                        )}

                      {member.Services?.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                            Assigned Services
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {member.Services.map((service) => (
                              <span
                                key={service.id}
                                className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700"
                              >
                                {service.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex gap-2 border-t border-stone-100 pt-4">
                      <button
                        type="button"
                        onClick={() => handleEdit(member)}
                        className="flex-1 rounded-lg border border-stone-300 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(member.id)}
                        disabled={loading}
                        className="flex-1 rounded-lg border border-red-200 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
