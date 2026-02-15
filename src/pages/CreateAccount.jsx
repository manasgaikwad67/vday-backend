import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiHeart, FiUser, FiCalendar, FiLink } from "react-icons/fi";
import { registerCreator, checkSlug } from "../services/api";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [slugStatus, setSlugStatus] = useState(null); // null, 'checking', 'available', 'taken'

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    creatorName: "",
    partnerName: "",
    partnerPassword: "",
    slug: "",
    relationshipStartDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Check slug availability
    if (name === "slug" && value.length >= 3) {
      setSlugStatus("checking");
      const cleanSlug = value.toLowerCase().replace(/[^a-z0-9]/g, "");
      checkSlug(cleanSlug)
        .then(({ data }) => {
          setSlugStatus(data.available ? "available" : "taken");
        })
        .catch(() => setSlugStatus(null));
    } else if (name === "slug") {
      setSlugStatus(null);
    }
  };

  const handleStep1 = (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setStep(2);
  };

  const handleStep2 = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.partnerPassword) {
      setError("Please set a password for your partner");
      setLoading(false);
      return;
    }

    try {
      const { data } = await registerCreator({
        email: formData.email,
        password: formData.password,
        creatorName: formData.creatorName,
        partnerName: formData.partnerName,
        partnerPassword: formData.partnerPassword,
        slug: formData.slug || undefined,
        relationshipStartDate: formData.relationshipStartDate || undefined,
      });

      localStorage.setItem("creatorToken", data.token);
      localStorage.setItem("creatorUser", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-red-900 to-purple-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-white">
              Forever <span className="text-pink-400">Yours</span>
            </h1>
          </Link>
          <p className="text-pink-200 mt-2">Create your love page</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
          {/* Progress indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? "bg-pink-500" : "bg-white/20"} text-white font-bold`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? "bg-pink-500" : "bg-white/20"}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-pink-500" : "bg-white/20"} text-white font-bold`}>
              2
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4">Your Account</h2>

              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/10 rounded-xl text-white placeholder-pink-300/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/10 rounded-xl text-white placeholder-pink-300/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/10 rounded-xl text-white placeholder-pink-300/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-red-600 transition-all"
              >
                Continue
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4">Personalize Your Page</h2>

              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" />
                <input
                  type="text"
                  name="creatorName"
                  value={formData.creatorName}
                  onChange={handleChange}
                  placeholder="Your name (shown on the page)"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/10 rounded-xl text-white placeholder-pink-300/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="relative">
                <FiHeart className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" />
                <input
                  type="text"
                  name="partnerName"
                  value={formData.partnerName}
                  onChange={handleChange}
                  placeholder="Your partner's name"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/10 rounded-xl text-white placeholder-pink-300/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" />
                <input
                  type="text"
                  name="partnerPassword"
                  value={formData.partnerPassword}
                  onChange={handleChange}
                  placeholder="Password for your partner to enter"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/10 rounded-xl text-white placeholder-pink-300/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <p className="text-pink-300/70 text-xs mt-1 ml-1">This is what your partner will type to access the page</p>
              </div>

              <div className="relative">
                <FiLink className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" />
                <div className="flex items-center bg-white/10 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-pink-500">
                  <span className="pl-12 pr-1 text-pink-300">/love/</span>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="custom-link (optional)"
                    className="flex-1 py-3 pr-4 bg-transparent text-white placeholder-pink-300/50 focus:outline-none"
                  />
                </div>
                {slugStatus === "checking" && (
                  <p className="text-yellow-300 text-xs mt-1 ml-1">Checking availability...</p>
                )}
                {slugStatus === "available" && (
                  <p className="text-green-400 text-xs mt-1 ml-1">✓ This link is available!</p>
                )}
                {slugStatus === "taken" && (
                  <p className="text-red-400 text-xs mt-1 ml-1">✗ This link is already taken</p>
                )}
              </div>

              <div className="relative">
                <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" />
                <input
                  type="date"
                  name="relationshipStartDate"
                  value={formData.relationshipStartDate}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <p className="text-pink-300/70 text-xs mt-1 ml-1">When did your relationship start? (for love counter)</p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || slugStatus === "taken"}
                  className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-red-600 transition-all disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Page"}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-pink-200 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-pink-400 hover:text-pink-300 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
