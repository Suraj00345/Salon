import { useEffect, useState } from "react";

import Navbar from "../../components/common/Navbar";

import {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../../api/staff.api";

export default function AdminStaff() {
  const [staff, setStaff] = useState([]);

  const [form, setForm] = useState({
    name: "",
    specialization: "",
  });

  const [editingId, setEditingId] = useState(null);

  const loadStaff = async () => {
    try {
      const data = await getStaff();

      setStaff(data.staff || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load staff");
    }
  };

  useEffect(() => {
    loadStaff();
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
        await updateStaff(editingId, form);
      } else {
        await createStaff(form);
      }

      setForm({
        name: "",
        specialization: "",
      });

      setEditingId(null);

      loadStaff();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save staff");
    }
  };

  const handleEdit = (member) => {
    setEditingId(member.id);

    setForm({
      name: member.name || "",
      specialization: member.specialization || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete staff member?")) return;

    try {
      await deleteStaff(id);

      loadStaff();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete staff");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">Manage Staff</h1>

          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl bg-white p-6 shadow"
          >
            <h2 className="text-xl font-bold">
              {editingId ? "Edit Staff" : "Add Staff"}
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <input
                name="name"
                placeholder="Staff name"
                value={form.name}
                onChange={handleChange}
                required
                className="rounded-lg border p-3"
              />

              <input
                name="specialization"
                placeholder="Specialization"
                value={form.specialization}
                onChange={handleChange}
                className="rounded-lg border p-3"
              />
            </div>

            <button
              type="submit"
              className="mt-5 rounded-lg bg-stone-900 px-6 py-3 font-semibold text-white"
            >
              {editingId ? "Update Staff" : "Add Staff"}
            </button>
          </form>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {staff.map((member) => (
              <div key={member.id} className="rounded-2xl bg-white p-6 shadow">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-900 text-xl text-white">
                  {member.name?.charAt(0)}
                </div>

                <h3 className="mt-4 text-xl font-bold">{member.name}</h3>

                <p className="mt-1 text-stone-500">
                  {member.specialization || "Professional Stylist"}
                </p>

                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="rounded-lg border px-4 py-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(member.id)}
                    className="rounded-lg border border-red-200 px-4 py-2 text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
