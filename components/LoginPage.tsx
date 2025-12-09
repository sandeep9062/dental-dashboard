"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage({
  onLoginSuccess,
}: {
  onLoginSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLoginSuccess();
        router.push("/");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100 bg-center bg-cover"
      style={{ backgroundImage: "url('/dentist-login.jpg')" }}
    >
      <div className="w-full max-w-sm p-10 shadow-xl bg-white/30 backdrop-blur-md rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-900">
          Admin Login
        </h2>
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />

          <button
            type="submit"
            className="w-full p-3 text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-700">
          Forgot your password?{" "}
          <a href="#" className="text-indigo-600 hover:underline">
            Reset
          </a>
        </p>
      </div>
    </div>
  );
}
