import { useEffect, useState } from "react";

import Navbar from "../../components/common/Navbar";

import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../../api/service.api";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
  });

  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      duration: "",
    });

    setEditingId(null);
  };

  const loadServices = async () => {
    try {
      setLoading(true);

      const data = await getServices();

      setServices(data.services || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Service name is required");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      alert("Enter a valid price");
      return;
    }

    if (!form.duration || Number(form.duration) <= 0) {
      alert("Enter a valid duration");
      return;
    }

    try {
      setSaving(true);

      const serviceData = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        duration: Number(form.duration),
      };

      if (editingId) {
        await updateService(editingId, serviceData);
      } else {
        await createService(serviceData);
      }

      resetForm();
      await loadServices();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);

    setForm({
      name: service.name || "",
      description: service.description || "",
      price: service.price ?? "",
      duration: service.duration ?? "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;

    try {
      await deleteService(id);

      if (editingId === id) {
        resetForm();
      }

      await loadServices();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete service");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
              Admin Panel
            </p>

            <h1 className="mt-2 text-3xl font-bold text-stone-900">
              Manage Services
            </h1>

            <p className="mt-2 text-stone-500">
              Create, update and remove salon services.
            </p>
          </div>

          {/* Create / Edit Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-stone-900">
                {editingId ? "Edit Service" : "Add Service"}
              </h2>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm font-medium text-stone-500 hover:text-stone-900"
                >
                  Cancel editing
                </button>
              )}
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Service Name
                </label>

                <input
                  name="name"
                  placeholder="e.g. Haircut"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-stone-300 p-3 outline-none transition focus:border-stone-900"
                />
              </div>

              {/* Price */}
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Price
                </label>

                <input
                  name="price"
                  type="number"
                  min="1"
                  placeholder="e.g. 500"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-stone-300 p-3 outline-none transition focus:border-stone-900"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Duration
                </label>

                <input
                  name="duration"
                  type="number"
                  min="1"
                  placeholder="e.g. 45"
                  value={form.duration}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-stone-300 p-3 outline-none transition focus:border-stone-900"
                />

                <p className="mt-1 text-xs text-stone-400">
                  Duration in minutes
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Description
                </label>

                <input
                  name="description"
                  placeholder="Short description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stone-300 p-3 outline-none transition focus:border-stone-900"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-stone-900 px-6 py-3 font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Service"
                    : "Add Service"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-lg border border-stone-300 px-6 py-3 font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Services Table */}
          <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-stone-100 p-6">
              <h2 className="text-xl font-bold text-stone-900">
                Existing Services
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                {services.length} service
                {services.length !== 1 ? "s" : ""} available
              </p>
            </div>

            {loading ? (
              <div className="p-10 text-center text-stone-500">
                Loading services...
              </div>
            ) : services.length === 0 ? (
              <div className="p-10 text-center">
                <p className="font-semibold text-stone-700">
                  No services found
                </p>

                <p className="mt-1 text-sm text-stone-500">
                  Add your first salon service using the form above.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-stone-100">
                    <tr>
                      <th className="p-4 text-sm font-semibold text-stone-700">
                        Name
                      </th>

                      <th className="p-4 text-sm font-semibold text-stone-700">
                        Description
                      </th>

                      <th className="p-4 text-sm font-semibold text-stone-700">
                        Price
                      </th>

                      <th className="p-4 text-sm font-semibold text-stone-700">
                        Duration
                      </th>

                      <th className="p-4 text-sm font-semibold text-stone-700">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {services.map((service) => (
                      <tr
                        key={service.id}
                        className="border-t border-stone-100 hover:bg-stone-50"
                      >
                        <td className="p-4">
                          <p className="font-semibold text-stone-900">
                            {service.name}
                          </p>
                        </td>

                        <td className="max-w-xs p-4 text-sm text-stone-500">
                          {service.description || "No description"}
                        </td>

                        <td className="p-4 font-medium text-stone-800">
                          ₹{Number(service.price).toLocaleString("en-IN")}
                        </td>

                        <td className="p-4 text-stone-600">
                          {service.duration} min
                        </td>

                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(service)}
                              className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium hover:bg-stone-100"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(service.id)}
                              className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
