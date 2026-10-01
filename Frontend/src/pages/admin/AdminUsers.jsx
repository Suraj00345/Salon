import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import useAdminUserStore from "../../store/adminUser.store";

export default function AdminUsers() {
  const {
    users,
    loading,
    updating,
    error,
    fetchUsers,
    updateStatus,
    clearError,
  } = useAdminUserStore();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        user.name?.toLowerCase().includes(searchValue) ||
        user.email?.toLowerCase().includes(searchValue) ||
        user.phone?.toLowerCase().includes(searchValue);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const handleStatusChange = async (user) => {
    const action = user.isActive ? "deactivate" : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${user.name}?`,
    );

    if (!confirmed) return;

    try {
      await updateStatus(user.id, !user.isActive);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const totalUsers = users.length;

  const activeUsers = users.filter((user) => user.isActive).length;

  const inactiveUsers = users.filter((user) => !user.isActive).length;

  const customerCount = users.filter((user) => user.role === "customer").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/admin"
              className="mb-2 inline-block text-sm text-gray-500 hover:text-gray-900"
            >
              ← Back to Admin Dashboard
            </Link>

            <h1 className="text-3xl font-bold text-gray-900">Users</h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage salon users and account status.
            </p>
          </div>

          <button
            onClick={() => {
              clearError();
              fetchUsers();
            }}
            disabled={loading}
            className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <p className="text-sm text-gray-500">Total Users</p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalUsers}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <p className="text-sm text-gray-500">Active Users</p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {activeUsers}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <p className="text-sm text-gray-500">Inactive Users</p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {inactiveUsers}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <p className="text-sm text-gray-500">Customers</p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {customerCount}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>

            <button
              onClick={clearError}
              className="font-semibold hover:text-red-900"
            >
              ✕
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Search
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email or phone..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>

            {/* Role */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Role
              </label>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              >
                <option value="all">All Roles</option>

                <option value="customer">Customer</option>

                <option value="staff">Staff</option>

                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-xl bg-white py-16 text-center shadow-sm ring-1 ring-gray-200">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

            <p className="text-sm text-gray-500">Loading users...</p>
          </div>
        )}

        {/* Desktop Table */}
        {!loading && (
          <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      User
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Phone
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Role
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Joined
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="transition hover:bg-gray-50">
                      {/* User */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name || "N/A"}
                          </p>

                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.phone || "N/A"}
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : user.role === "staff"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            user.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleStatusChange(user)}
                          disabled={updating}
                          className={`rounded-lg px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            user.isActive
                              ? "bg-red-50 text-red-700 hover:bg-red-100"
                              : "bg-green-50 text-green-700 hover:bg-green-100"
                          }`}
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty */}
            {filteredUsers.length === 0 && (
              <div className="py-16 text-center">
                <p className="font-medium text-gray-700">No users found</p>

                <p className="mt-1 text-sm text-gray-500">
                  Try changing your search or role filter.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Mobile Cards */}
        {!loading && (
          <div className="space-y-4 md:hidden">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {user.name || "N/A"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">{user.email}</p>

                    <p className="mt-1 text-sm text-gray-500">
                      {user.phone || "No phone number"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      user.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-700">
                    {user.role}
                  </span>

                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    Joined {formatDate(user.createdAt)}
                  </span>
                </div>

                <button
                  onClick={() => handleStatusChange(user)}
                  disabled={updating}
                  className={`mt-4 w-full rounded-lg px-4 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${
                    user.isActive
                      ? "bg-red-50 text-red-700 hover:bg-red-100"
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  {user.isActive ? "Deactivate User" : "Activate User"}
                </button>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="rounded-xl bg-white py-16 text-center shadow-sm ring-1 ring-gray-200">
                <p className="font-medium text-gray-700">No users found</p>

                <p className="mt-1 text-sm text-gray-500">
                  Try changing your search or role filter.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
