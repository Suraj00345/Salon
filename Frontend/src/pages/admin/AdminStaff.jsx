import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/common/Navbar";

import { getStaff, deleteStaff, assignService } from "../../api/staff.api";

import { getServices } from "../../api/service.api";

export default function AdminStaff() {
  const [staff, setStaff] = useState([]);
  const [services, setServices] = useState([]);

  // Modal State
  const [activeStaff, setActiveStaff] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

  const [loading, setLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [modalSaving, setModalSaving] = useState(false);

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
  // MODAL HANDLERS
  // ==========================================

  const handleOpenAssignModal = (member) => {
    setActiveStaff(member);
    const assignedIds = member.Services?.map((s) => s.id) || [];
    setSelectedServices(assignedIds);
  };

  const handleCloseModal = () => {
    if (modalSaving) return;
    setActiveStaff(null);
    setSelectedServices([]);
  };

  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId],
    );
  };

  const handleSaveAssignments = async () => {
    if (!activeStaff) return;

    try {
      setModalSaving(true);

      const originalServiceIds = activeStaff.Services?.map((s) => s.id) || [];

      // Determine which new services were checked
      const addedServices = selectedServices.filter(
        (id) => !originalServiceIds.includes(id),
      );

      if (addedServices.length > 0) {
        await Promise.allSettled(
          addedServices.map((serviceId) =>
            assignService(activeStaff.id, serviceId),
          ),
        );
      }

      await loadStaff();
      handleCloseModal();
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to update assigned services",
      );
    } finally {
      setModalSaving(false);
    }
  };

  // ==========================================
  // DELETE STAFF
  // ==========================================

  const handleDelete = async (e, id) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this staff member?")) {
      return;
    }

    try {
      setLoading(true);
      await deleteStaff(id);
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
                Click any staff member to view and assign services.
              </p>
            </div>

            <Link
              to="/admin/working-hours"
              className="inline-flex items-center justify-center rounded-lg bg-stone-900 px-5 py-3 font-semibold text-white transition hover:bg-stone-800"
            >
              Manage Working Hours
            </Link>
          </div>

          {/* STAFF LIST */}
          <div className="mt-10">
            {staff.length === 0 ? (
              <div className="mt-5 rounded-2xl bg-white p-8 text-center shadow-sm">
                <p className="text-stone-500">No staff members found.</p>
              </div>
            ) : (
              <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {staff.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => handleOpenAssignModal(member)}
                    className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-transparent bg-white p-6 shadow-sm transition hover:border-stone-300 hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-900 text-lg font-bold text-white transition group-hover:bg-amber-600">
                          {member.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
                          {member.Services?.length || 0} Services
                        </span>
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

                      {/* ASSIGNED SERVICES CHIPS */}
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

                    {/* CARD ACTIONS */}
                    <div className="mt-6 flex items-center gap-2 border-t border-stone-100 pt-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenAssignModal(member);
                        }}
                        className="flex-1 rounded-lg bg-stone-900 py-2 text-sm font-medium text-white transition hover:bg-stone-800"
                      >
                        Assign Services
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, member.id)}
                        disabled={loading}
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
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

      {/* ASSIGN SERVICES POPUP MODAL */}
      {activeStaff && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-200 p-6">
              <div>
                <h3 className="text-xl font-bold text-stone-900">
                  Assign Services
                </h3>
                <p className="text-sm text-stone-500">
                  Select services for{" "}
                  <span className="font-semibold text-stone-800">
                    {activeStaff.name}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={modalSaving}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Service Options */}
            <div className="flex-1 overflow-y-auto p-6">
              {servicesLoading ? (
                <p className="text-center text-sm text-stone-500">
                  Loading services...
                </p>
              ) : services.length === 0 ? (
                <p className="rounded-xl bg-stone-50 p-4 text-center text-sm text-stone-500">
                  No services available.
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
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
                        <div className="pr-2">
                          <p className="font-semibold text-stone-900">
                            {service.name}
                          </p>
                          <p className="mt-1 text-xs text-stone-500">
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

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-stone-200 p-6">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={modalSaving}
                className="rounded-xl border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAssignments}
                disabled={modalSaving}
                className="rounded-xl bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:opacity-50"
              >
                {modalSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
