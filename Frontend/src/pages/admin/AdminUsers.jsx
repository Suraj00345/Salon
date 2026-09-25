import { useEffect, useState } from "react";

import Navbar from "../../components/common/Navbar";

import { getAllUsers, updateUserStatus } from "../../api/admin.api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();

      setUsers(data.users || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await updateUserStatus(id, status);

      loadUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">Manage Users</h1>

          <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow">
            {loading ? (
              <p className="p-8">Loading users...</p>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-stone-100">
                  <tr>
                    <th className="p-4">Name</th>

                    <th className="p-4">Email</th>

                    <th className="p-4">Role</th>

                    <th className="p-4">Status</th>

                    <th className="p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="p-4">{user.name}</td>

                      <td className="p-4">{user.email}</td>

                      <td className="p-4">{user.role}</td>

                      <td className="p-4">{user.status || "active"}</td>

                      <td className="p-4">
                        <button
                          onClick={() =>
                            handleStatus(
                              user.id,
                              user.status === "active" ? "blocked" : "active",
                            )
                          }
                          className="rounded-lg border px-3 py-2 text-sm"
                        >
                          {user.status === "active" ? "Block" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
