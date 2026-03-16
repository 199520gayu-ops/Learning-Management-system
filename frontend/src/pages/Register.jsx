import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "learner",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await API.post("/auth/register", formData);

      const { user, token } = res.data;

      login({ ...user, token });

      setSuccess("Account created successfully!");

      setTimeout(() => {
        const roleRedirects = {
          educator: "/educator-dashboard",
          coordinator: "/coordinator-dashboard",
          learner: "/dashboard",
        };

        navigate(roleRedirects[user.role]);
      }, 1500);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Backend not connected!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-96 space-y-4"
      >
        <h2 className="text-xl font-bold">Register</h2>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          onChange={handleChange}
          className="w-full border p-2"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
          className="w-full border p-2"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          className="w-full border p-2"
        />

        <select
          name="role"
          onChange={handleChange}
          className="w-full border p-2"
        >
          <option value="learner">Learner</option>
          <option value="educator">Educator</option>
          <option value="coordinator">Coordinator</option>
        </select>

        <button
          disabled={loading}
          className="bg-blue-500 text-white w-full p-2"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="text-sm">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}