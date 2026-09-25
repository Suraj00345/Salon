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

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
  });

  const [editingId, setEditingId] = useState(null);

  const loadServices = async () => {
    try {
      const data = await getServices();

      setServices(data.services || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load services");
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateService(editingId, form);
      } else {
        await createService(form);
      }

      setForm({
        name: "",
        description: "",
        price: "",
        duration: "",
      });

      setEditingId(null);

      loadServices();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save service");
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);

    setForm({
      name: service.name || "",
      description: service.description || "",
      price: service.price || "",
      duration: service.duration || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;

    try {
      await deleteService(id);

      loadServices();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete service");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">Manage Services</h1>

          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl bg-white p-6 shadow"
          >
            <h2 className="text-xl font-bold">
              {editingId ? "Edit Service" : "Add Service"}
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <input
                name="name"
                placeholder="Service name"
                value={form.name}
                onChange={handleChange}
                required
                className="rounded-lg border p-3"
              />

              <input
                name="price"
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                required
                className="rounded-lg border p-3"
              />

              <input
                name="duration"
                type="number"
                placeholder="Duration in minutes"
                value={form.duration}
                onChange={handleChange}
                required
                className="rounded-lg border p-3"
              />

              <input
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="rounded-lg border p-3"
              />
            </div>

            <button
              type="submit"
              className="mt-5 rounded-lg bg-stone-900 px-6 py-3 font-semibold text-white"
            >
              {editingId ? "Update Service" : "Add Service"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);

                  setForm({
                    name: "",
                    description: "",
                    price: "",
                    duration: "",
                  });
                }}
                className="ml-3 rounded-lg border px-6 py-3"
              >
                Cancel
              </button>
            )}
          </form>

          <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow">
            <table className="w-full text-left">
              <thead className="bg-stone-100">
                <tr>
                  <th className="p-4">Name</th>

                  <th className="p-4">Price</th>

                  <th className="p-4">Duration</th>

                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {services.map((service) => (
                  <tr key={service.id} className="border-t">
                    <td className="p-4 font-semibold">{service.name}</td>

                    <td className="p-4">₹{service.price}</td>

                    <td className="p-4">{service.duration} min</td>

                    <td className="p-4">
                      <button
                        onClick={() => handleEdit(service)}
                        className="mr-2 rounded-lg border px-3 py-2"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(service.id)}
                        className="rounded-lg border border-red-200 px-3 py-2 text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
