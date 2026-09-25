import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth.store";
import { loginUser } from "../api/auth.api";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const response = await loginUser(data);
      login(response.user, response.token);
      // Redirect after successful login
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-stone-100 flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-stone-200/80 p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-700 mb-2">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-serif text-stone-900">Welcome Back</h2>

          <p className="text-sm text-stone-500">
            Sign in to manage your appointments and services
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Register */}
        <div className="text-center pt-4 border-t border-stone-100">
          <p className="text-sm text-stone-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-amber-600 font-semibold hover:underline"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
