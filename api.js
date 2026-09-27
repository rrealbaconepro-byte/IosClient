const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://rovival.onrender.com/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const text = await response.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }

  return data;
}

export const api = {
  base: API_BASE,

  health: () => request("/health"),

  signup: (username, password) =>
    request("/signup", {
      method: "POST",
      body: JSON.stringify({ username, password })
    }),

  login: (username, password) =>
    request("/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    }),

  logout: () =>
    request("/logout", { method: "POST" }),

  me: () => request("/me"),

  games: () => request("/games"),

  game: (id) => request(`/games/${encodeURIComponent(id)}`),

  avatar: () => request("/avatar"),

  saveAvatar: (avatar) =>
    request("/avatar", {
      method: "POST",
      body: JSON.stringify(avatar)
    }),

  inventory: () => request("/inventory"),

  catalog: () => request("/catalog"),

  players: () => request("/players"),

  // These endpoints are optional on older Rovival servers.
  friends: () => request("/friends"),

  friendRequests: () => request("/friends/requests"),

  sendFriendRequest: (userId) =>
    request("/friends/request", {
      method: "POST",
      body: JSON.stringify({ userId })
    }),

  worldState: (gameId) => request(`/world/${encodeURIComponent(gameId)}`),

  updatePosition: (gameId, position) =>
    request(`/world/${encodeURIComponent(gameId)}/position`, {
      method: "POST",
      body: JSON.stringify(position)
    }),

  chat: (gameId) => request(`/chat/${encodeURIComponent(gameId)}`),

  sendChat: (gameId, message) =>
    request(`/chat/${encodeURIComponent(gameId)}`, {
      method: "POST",
      body: JSON.stringify({ message })
    })
};

export { API_BASE };
