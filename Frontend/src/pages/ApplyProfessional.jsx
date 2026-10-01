import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/common/Navbar";

import useStaffApplicationStore from "../store/staffApplication.store";

const skillOptions = [
  "Hair Cutting",
  "Hair Styling",
  "Hair Coloring",
  "Beard Styling",
  "Facial",
  "Makeup",
  "Bridal Makeup",
  "Nail Care",
  "Manicure",
  "Pedicure",
  "Massage",
];

export default function ApplyProfessional() {
  const navigate = useNavigate();

  const {
    application,
    loading,
    submitting,
    error,
    fetchMyApplication,
    submitApplication,
  } = useStaffApplicationStore();

  const [formData, setFormData] = useState({
    experience: "",
    qualification: "",
    bio: "",
    skills: [],
    requestedServices: [],
  });

  useEffect(() => {
    fetchMyApplication();
  }, [fetchMyApplication]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleSkill = (skill) => {
    setFormData((prev) => {
      const alreadySelected = prev.skills.includes(skill);

      return {
        ...prev,
        skills: alreadySelected
          ? prev.skills.filter((item) => item !== skill)
          : [...prev.skills, skill],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.skills.length === 0) {
      alert("Please select at least one skill.");
      return;
    }

    try {
      await submitApplication(formData);

      alert("Your professional application has been submitted.");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  // Existing application
  if (!loading && application) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-3xl px-4 py-10">
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Professional Application
            </h1>

            <p className="mt-2 text-gray-500">Your application status</p>

            <div className="mt-8">
              {application.status === "pending" && (
                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
                  <div className="text-3xl">🟡</div>

                  <h2 className="mt-3 text-lg font-semibold text-yellow-900">
                    Application Pending
                  </h2>

                  <p className="mt-2 text-sm text-yellow-800">
                    Your professional application is currently under review by
                    the administrator.
                  </p>
                </div>
              )}

              {application.status === "approved" && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-6">
                  <div className="text-3xl">🟢</div>

                  <h2 className="mt-3 text-lg font-semibold text-green-900">
                    Application Approved
                  </h2>

                  <p className="mt-2 text-sm text-green-800">
                    Your professional account has been approved.
                  </p>

                  <button
                    onClick={() => navigate("/staff")}
                    className="mt-5 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800"
                  >
                    Go to Staff Dashboard
                  </button>
                </div>
              )}

              {application.status === "rejected" && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                  <div className="text-3xl">🔴</div>

                  <h2 className="mt-3 text-lg font-semibold text-red-900">
                    Application Rejected
                  </h2>

                  <p className="mt-2 text-sm text-red-800">
                    {application.adminNote ||
                      "Your application was not approved."}
                  </p>

                  <button
                    onClick={() => window.location.reload()}
                    className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Apply Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Apply as a Professional
          </h1>

          <p className="mt-2 text-gray-500">
            Tell us about your professional experience and skills. Your
            application will be reviewed by an administrator.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            Loading...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Experience */}
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Professional Information
              </h2>

              <div className="mt-5 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Experience
                  </label>

                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your professional experience..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Qualification
                  </label>

                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    placeholder="Example: Professional Hair Styling Certificate"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Professional Bio
                  </label>

                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell customers about yourself..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Your Skills
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Select all professional skills you have.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                {skillOptions.map((skill) => {
                  const selected = formData.skills.includes(skill);

                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        selected
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-500"
                      }`}
                    >
                      {selected ? "✓ " : ""}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
