import React, { useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Lock, UserRound } from "lucide-react";
import { api } from "../lib/api";

export default function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      const data =
        mode === "login"
          ? await api.login(username, password)
          : await api.signup(username, password);

      onLogin(
        data.user || {
          username,
          id: data.id || "local"
        }
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-screen">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
      >
        <div className="brand-mark">
          <Gamepad2 size={30} />
        </div>
        <h1>Rovival</h1>
        <p>Play. Create. Revive the classics.</p>

        <form onSubmit={submit}>
          <label>
            Username
            <div className="input-wrap">
              <UserRound size={18} />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
                minLength={3}
                required
              />
            </div>
          </label>

          <label>
            Password
            <div className="input-wrap">
              <Lock size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                minLength={6}
                required
              />
            </div>
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button className="primary-button" disabled={busy}>
            {busy
              ? "Connecting..."
              : mode === "login"
                ? "Log In"
                : "Create Account"}
          </button>
        </form>

        <button
          className="switch-auth"
          onClick={() => {
            setMode((value) => value === "login" ? "signup" : "login");
            setError("");
          }}
        >
          {mode === "login"
            ? "New to Rovival? Create an account"
            : "Already have an account? Log in"}
        </button>
      </motion.div>
    </main>
  );
}
