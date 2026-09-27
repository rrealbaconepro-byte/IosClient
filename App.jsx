import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AuthScreen from "./components/AuthScreen";
import Home from "./components/Home";
import GameWorld from "./components/GameWorld";
import { api } from "./lib/api";

const emptyAvatar = {
  bodyColor: "#ffd323",
  shirt: "#2469a8",
  pants: "#222f5b",
  hat: false
};

export default function App() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(emptyAvatar);
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.me()
      .then(async (data) => {
        if (!data.authenticated) return;

        setUser(data.user);

        try {
          const savedAvatar = await api.avatar();
          if (savedAvatar) setAvatar(savedAvatar);
        } catch {}
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleLogin(nextUser) {
    setUser(nextUser);

    try {
      const savedAvatar = await api.avatar();
      if (savedAvatar) setAvatar(savedAvatar);
    } catch {}
  }

  async function logout() {
    try {
      await api.logout();
    } catch {}

    setUser(null);
    setGame(null);
    setAvatar(emptyAvatar);
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
          className="loading-logo"
        >
          R
        </motion.div>
        <span>Loading Rovival...</span>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  if (game) {
    return (
      <GameWorld
        game={game}
        avatar={avatar}
        username={user.username}
        onExit={() => setGame(null)}
      />
    );
  }

  return (
    <Home
      user={user}
      avatar={avatar}
      onPlay={setGame}
      onLogout={logout}
    />
  );
}
