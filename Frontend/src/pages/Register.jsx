import { useState } from "react";
import { User, Mail, Lock, Phone, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api";
import Loader from "../components/common/Loader";

export default function Register() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer", // Default role
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await registerUser(data);
      console.log("Registration successful:", response);
      setSuccess("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.errors?.join(", ") ||
          err.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-stone-100 flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-stone-200/80 p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-700 mb-2">
            <User className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-serif text-stone-900">Create Account</h2>

          <p className="text-sm text-stone-500">
            Join Lumière to schedule & manage appointments
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl px-4 py-3">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection - Segmented Toggle */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Register As
            </label>

            <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100/80 border border-stone-200 rounded-xl">
              <button
                type="button"
                onClick={() => setData({ ...data, role: "customer" })}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-medium transition-all ${
                  data.role === "customer"
                    ? "bg-white text-stone-900 shadow-sm border border-stone-200/60 font-semibold"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                <User
                  className={`w-4 h-4 ${data.role === "customer" ? "text-amber-600" : "text-stone-400"}`}
                />
                Customer
              </button>

              <button
                type="button"
                onClick={() => setData({ ...data, role: "staff" })}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-medium transition-all ${
                  data.role === "staff"
                    ? "bg-white text-stone-900 shadow-sm border border-stone-200/60 font-semibold"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                <ShieldCheck
                  className={`w-4 h-4 ${data.role === "staff" ? "text-amber-600" : "text-stone-400"}`}
                />
                Staff Member
              </button>
            </div>
          </div>
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Full Name
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <User className="h-5 w-5" />
              </div>

              <input
                type="text"
                required
                placeholder="Jane Doe"
                value={data.name}
                onChange={(e) =>
                  setData({
                    ...data,
                    name: e.target.value,
                  })
                }
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm outline-none transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Email Address
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Mail className="h-5 w-5" />
              </div>

              <input
                type="email"
                required
                placeholder="you@example.com"
                value={data.email}
                onChange={(e) =>
                  setData({
                    ...data,
                    email: e.target.value,
                  })
                }
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm outline-none transition-all"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Phone Number
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Phone className="h-5 w-5" />
              </div>

              <input
                type="tel"
                required
                placeholder="+1 (555) 000-0000"
                value={data.phone}
                onChange={(e) =>
                  setData({
                    ...data,
                    phone: e.target.value,
                  })
                }
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm outline-none transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Password
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Lock className="h-5 w-5" />
              </div>

              <input
                type="password"
                required
                placeholder="••••••••"
                value={data.password}
                onChange={(e) =>
                  setData({
                    ...data,
                    password: e.target.value,
                  })
                }
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm outline-none transition-all"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-500 text-amber-300 font-semibold rounded-xl shadow-md transition-colors text-sm"
          >
            {loading ? "Creating Account..." : "Register & Continue"}
          </button>
        </form>

        {/* Login */}
        <div className="text-center pt-4 border-t border-stone-100">
          <p className="text-sm text-stone-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-amber-600 font-semibold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
