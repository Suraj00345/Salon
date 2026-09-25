import { useState } from "react";

import Navbar from "../components/common/Navbar";
import useAuthStore from "../store/auth.store";

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Connect this to your update-profile API.
    alert("Profile update API should be connected here.");
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <section className="px-6 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h1 className="text-3xl font-bold">My Profile</h1>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">Name</label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Email
                </label>

                <input
                  value={user?.email || ""}
                  disabled
                  className="w-full rounded-xl border border-stone-200 bg-stone-100 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Phone
                </label>

                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-4 py-3"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-stone-900 py-3 font-semibold text-white"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
