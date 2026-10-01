import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import useAdminStaffApplicationStore from "../../store/adminStaffApplication.store";

export default function AdminStaffApplications() {
  const {
    applications,
    loading,
    updating,
    error,
    fetchApplications,
    approve,
    reject,
    clearError,
  } = useAdminStaffApplicationStore();

  const [status, setStatus] = useState("pending");
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchApplications({
      status,
    });
  }, [status, fetchApplications]);

  const handleApprove = async (application) => {
    const confirmed = window.confirm(
      `Approve ${application.user?.name} as a professional?`,
    );

    if (!confirmed) return;

    try {
      await approve(application.id);

      setSelectedApplication(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (application) => {
    const note = window.prompt(
      "Enter a reason for rejecting this application:",
    );

    if (note === null) return;

    try {
      await reject(application.id, note);

      setSelectedApplication(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/admin"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            ← Back to Admin Dashboard
          </Link>

          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Professional Applications
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Review users who want to join the salon as professionals.
              </p>
            </div>

            <button
              onClick={() => fetchApplications({ status })}
              disabled={loading}
              className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span>{error}</span>

            <button onClick={clearError}>✕</button>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            ["pending", "Pending"],
            ["approved", "Approved"],
            ["rejected", "Rejected"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setStatus(value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                status === value
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="rounded-xl bg-white py-16 text-center shadow-sm ring-1 ring-gray-200">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

            <p className="text-sm text-gray-500">Loading applications...</p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 md:block">
              <table className="w-full text-left">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                      Applicant
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                      Experience
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                      Skills
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {applications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-5">
                        <p className="font-medium text-gray-900">
                          {application.user?.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {application.user?.email}
                        </p>
                      </td>

                      <td className="max-w-xs px-6 py-5 text-sm text-gray-600">
                        <p className="line-clamp-2">{application.experience}</p>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex max-w-xs flex-wrap gap-1">
                          {(application.skills || []).map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                            application.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : application.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {application.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => setSelectedApplication(application)}
                          className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {applications.length === 0 && (
                <div className="py-16 text-center text-sm text-gray-500">
                  No {status} applications found.
                </div>
              )}
            </div>

            {/* Mobile */}
            <div className="space-y-4 md:hidden">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200"
                >
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {application.user?.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {application.user?.email}
                      </p>
                    </div>

                    <span className="h-fit rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium capitalize text-yellow-700">
                      {application.status}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1">
                    {(application.skills || []).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedApplication(application)}
                    className="mt-4 w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white"
                  >
                    Review Application
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Review Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Professional Application
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Review applicant details
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="text-xl text-gray-400 hover:text-gray-900"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-6 space-y-5">
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-500">
                      Applicant
                    </p>

                    <p className="mt-1 font-medium text-gray-900">
                      {selectedApplication.user?.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {selectedApplication.user?.email}
                    </p>

                    <p className="text-sm text-gray-500">
                      {selectedApplication.user?.phone || "No phone number"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-500">
                      Experience
                    </p>

                    <p className="mt-1 whitespace-pre-wrap text-gray-700">
                      {selectedApplication.experience || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-500">
                      Qualification
                    </p>

                    <p className="mt-1 text-gray-700">
                      {selectedApplication.qualification || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-500">
                      Professional Bio
                    </p>

                    <p className="mt-1 whitespace-pre-wrap text-gray-700">
                      {selectedApplication.bio || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-500">
                      Skills
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {(selectedApplication.skills || []).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedApplication.status === "pending" && (
                  <div className="mt-8 flex gap-3 border-t pt-6">
                    <button
                      onClick={() => handleReject(selectedApplication)}
                      disabled={updating}
                      className="flex-1 rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => handleApprove(selectedApplication)}
                      disabled={updating}
                      className="flex-1 rounded-lg bg-green-700 px-4 py-3 font-medium text-white hover:bg-green-800 disabled:opacity-50"
                    >
                      {updating ? "Processing..." : "Approve"}
                    </button>
                  </div>
                )}

                {selectedApplication.status !== "pending" && (
                  <div className="mt-8 border-t pt-6">
                    <button
                      onClick={() => setSelectedApplication(null)}
                      className="w-full rounded-lg bg-gray-900 px-4 py-3 font-medium text-white"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
