import React, { useEffect, useState } from "react";
import { Send, X } from "lucide-react";
import { api } from "../lib/api";

export default function ChatPanel({ gameId, username, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const data = await api.chat(gameId);
        if (alive) setMessages(Array.isArray(data) ? data : data.messages || []);
      } catch {
        // Older servers can simply have no chat endpoint yet.
      }
    }

    load();
    const timer = setInterval(load, 2000);

    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [gameId]);

  async function send() {
    const message = text.trim();
    if (!message) return;

    setText("");

    const optimistic = {
      id: crypto.randomUUID?.() || String(Date.now()),
      username: username || "Player",
      message,
      createdAt: new Date().toISOString()
    };

    setMessages((old) => [...old, optimistic]);

    try {
      await api.sendChat(gameId, message);
      setStatus("");
    } catch {
      setStatus("Chat server is not connected yet.");
    }
  }

  return (
    <aside className="chat-panel">
      <div className="chat-header">
        <div>
          <strong>Game Chat</strong>
          <span>Players in this server</span>
        </div>
        <button className="icon-button" onClick={onClose} aria-label="Close">
          <X size={19} />
        </button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-chat">
            No messages yet. Say hello!
          </div>
        )}

        {messages.map((message) => (
          <div className="chat-message" key={message.id || `${message.username}-${message.createdAt}`}>
            <strong>{message.username || "Player"}</strong>
            <p>{message.message}</p>
          </div>
        ))}
      </div>

      {status && <div className="chat-status">{status}</div>}

      <div className="chat-input">
        <input
          value={text}
          maxLength={200}
          placeholder="Say something..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
        />
        <button onClick={send} aria-label="Send">
          <Send size={18} />
        </button>
      </div>
    </aside>
  );
}
