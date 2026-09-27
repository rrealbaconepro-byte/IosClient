import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Compass,
  Gamepad2,
  Home as HomeIcon,
  Search,
  ShoppingBag,
  UserRound,
  Users,
  Play,
  LogOut,
  Coins,
  ChevronRight
} from "lucide-react";
import { api } from "../lib/api";
import Avatar from "./Avatar";

const fallbackGames = [
  { id: "escape-iphone", name: "Escape the iPhone", description: "Run, jump and survive!", visits: 0 },
  { id: "natural-disaster", name: "Natural Disaster Survival", description: "Can you survive?", visits: 0 },
  { id: "rovival-obby", name: "Rovival Obby", description: "Beat the classic obstacle course.", visits: 0 },
  { id: "brick-battle", name: "Brick Battle", description: "Classic block battles.", visits: 0 },
  { id: "build-house", name: "Build Your House", description: "Build your dream home.", visits: 0 },
  { id: "hide-seek", name: "Hide and Seek", description: "Hide before they find you.", visits: 0 }
];

const gradients = [
  "thumb-blue", "thumb-orange", "thumb-purple",
  "thumb-green", "thumb-pink", "thumb-red"
];

function GameCard({ game, index, onPlay }) {
  return (
    <motion.button
      className="game-card"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onPlay(game)}
    >
      <div className={`game-thumb ${gradients[index % gradients.length]}`}>
        <div className="thumb-block block-a" />
        <div className="thumb-block block-b" />
        <div className="thumb-character">
          <span />
        </div>
        <div className="thumb-shine" />
      </div>
      <div className="game-card-body">
        <strong>{game.name}</strong>
        <span>{game.description || "Play on Rovival"}</span>
        <small>
          <Users size={12} />
          {game.visits ? `${game.visits.toLocaleString()} visits` : "New"}
        </small>
      </div>
    </motion.button>
  );
}

export default function Home({ user, avatar, onPlay, onLogout }) {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("home");
  const [online, setOnline] = useState(false);

  useEffect(() => {
    api.games()
      .then((data) => {
        setGames(Array.isArray(data) && data.length ? data : fallbackGames);
      })
      .catch(() => setGames(fallbackGames));

    api.health()
      .then(() => setOnline(true))
      .catch(() => setOnline(false));
  }, []);

  const displayedGames = useMemo(() => {
    const source = games.length ? games : fallbackGames;
    const query = search.trim().toLowerCase();

    if (!query) return source;

    return source.filter((game) =>
      `${game.name} ${game.description || ""}`.toLowerCase().includes(query)
    );
  }, [games, search]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="wordmark">ROVIVAL</div>

        <div className="search-box">
          <Search size={18} />
          <input
            value={search}
            placeholder="Search experiences, people and more"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="top-actions">
          <div className="robux-pill">
            <Coins size={17} />
            <span>0</span>
          </div>
          <button className="icon-button">
            <Bell size={20} />
          </button>
          <div className="user-mini">
            <Avatar avatar={avatar} size="tiny" />
            <span>{user.username}</span>
          </div>
        </div>
      </header>

      <aside className="sidebar">
        <NavItem icon={<HomeIcon />} text="Home" active={active === "home"} onClick={() => setActive("home")} />
        <NavItem icon={<Compass />} text="Discover" active={active === "discover"} onClick={() => setActive("discover")} />
        <NavItem icon={<ShoppingBag />} text="Avatar Shop" active={active === "shop"} onClick={() => setActive("shop")} />
        <NavItem icon={<UserRound />} text="Profile" active={active === "profile"} onClick={() => setActive("profile")} />
        <NavItem icon={<Gamepad2 />} text="Avatar" active={active === "avatar"} onClick={() => setActive("avatar")} />
      </aside>

      <main className="home-content">
        <AnimatePresence mode="wait">
          {active === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <section className="welcome">
                <div>
                  <h1>Home</h1>
                  <p>Recommended for you</p>
                </div>
                <div className={`server-status ${online ? "online" : ""}`}>
                  <span />
                  {online ? "Server online" : "Offline mode"}
                </div>
              </section>

              <section className="hero-card">
                <div className="hero-copy">
                  <span className="eyebrow">FEATURED EXPERIENCE</span>
                  <h2>{displayedGames[0]?.name || "Rovival"}</h2>
                  <p>{displayedGames[0]?.description || "Jump into the world of Rovival."}</p>
                  <div className="hero-buttons">
                    <button
                      className="play-button"
                      onClick={() => onPlay(displayedGames[0] || fallbackGames[0])}
                    >
                      <Play size={19} fill="currentColor" />
                      Play
                    </button>
                    <button className="details-button">
                      Details
                    </button>
                  </div>
                </div>
                <div className="hero-scene">
                  <div className="hero-sun" />
                  <div className="hero-mountain m1" />
                  <div className="hero-mountain m2" />
                  <div className="hero-water" />
                  <div className="hero-bridge" />
                  <div className="hero-house" />
                </div>
              </section>

              <SectionTitle title="Friends" action="See All" />
              <div className="friends-row">
                <div className="friend-add">
                  <div className="friend-circle add-circle">
                    <Users size={28} />
                  </div>
                  <span>Add Friends</span>
                </div>
                <div className="empty-friends">
                  <Users size={24} />
                  <div>
                    <strong>No friends yet</strong>
                    <span>Add friends to see them here.</span>
                  </div>
                </div>
              </div>

              <SectionTitle title="Continue" action="See All" />
              <div className="empty-section">
                <Gamepad2 size={28} />
                <div>
                  <strong>No recently played games</strong>
                  <span>Games you play will appear here.</span>
                </div>
              </div>

              <SectionTitle title="Recommended For You" />
              <div className="games-grid">
                {displayedGames.map((game, index) => (
                  <GameCard key={game.id || index} game={game} index={index} onPlay={onPlay} />
                ))}
              </div>
            </motion.div>
          )}

          {active !== "home" && (
            <motion.div
              key={active}
              className="placeholder-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1>{active === "shop" ? "Avatar Shop" : active[0].toUpperCase() + active.slice(1)}</h1>
              <p>This Rovival section is ready for the next feature.</p>
              <div className="placeholder-card">
                <Avatar avatar={avatar} size="large" />
                <div>
                  <strong>{user.username}</strong>
                  <span>0 Robux · New Rovival account</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <button className="mobile-logout" onClick={onLogout}>
        <LogOut size={18} />
      </button>
    </div>
  );
}

function NavItem({ icon, text, active, onClick }) {
  return (
    <button className={`nav-item ${active ? "active" : ""}`} onClick={onClick}>
      {React.cloneElement(icon, { size: 23 })}
      <span>{text}</span>
    </button>
  );
}

function SectionTitle({ title, action }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {action && (
        <button>
          {action}
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
