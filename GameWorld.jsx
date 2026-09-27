import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { MessageCircle, X } from "lucide-react";
import Joystick from "./Joystick";
import ChatPanel from "./ChatPanel";
import Avatar from "./Avatar";
import { api } from "../lib/api";

function WorldCharacter({ position, color, username, local = false }) {
  const group = useRef();
  const [jump, setJump] = useState(0);

  useEffect(() => {
    if (!local) return;
    const listener = () => {
      setJump(0.01);
    };
    window.addEventListener("rovival-jump", listener);
    return () => window.removeEventListener("rovival-jump", listener);
  }, [local]);

  useFrame((_, delta) => {
    if (!group.current) return;
    if (jump > 0) {
      group.current.position.y += 6 * delta;
      setJump((value) => value - delta);
    } else if (group.current.position.y > 1) {
      group.current.position.y = Math.max(1, group.current.position.y - 8 * delta);
    }
  });

  return (
    <group ref={group} position={[position[0], 1, position[1]]}>
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[0.9, 1.1, 0.9]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[0.95, 0.95, 0.95]} />
        <meshStandardMaterial color="#ffd323" />
      </mesh>
      <mesh position={[0, 2.15, 0]}>
        <boxGeometry args={[1.05, 0.18, 0.22]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function Scene({ avatar, position, setPosition, remotePlayers }) {
  const treePositions = useMemo(
    () => [
      [-8, -5], [-5, 5], [0, -7], [6, -5], [9, 4], [3, 7]
    ],
    []
  );

  useEffect(() => {
    const listener = (event) => {
      const { x, y } = event.detail;
      setPosition((old) => [
        THREE.MathUtils.clamp(old[0] + x * 0.12, -11, 11),
        THREE.MathUtils.clamp(old[1] + y * 0.12, -8, 8)
      ]);
    };

    window.addEventListener("rovival-move", listener);
    return () => window.removeEventListener("rovival-move", listener);
  }, [setPosition]);

  return (
    <>
      <ambientLight intensity={1.8} />
      <directionalLight position={[5, 10, 4]} intensity={2.4} castShadow />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 24]} />
        <meshStandardMaterial color="#2f6f48" />
      </mesh>

      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[10, 0.12, 3]} />
        <meshStandardMaterial color="#525761" />
      </mesh>

      {treePositions.map(([x, z], index) => (
        <group key={index} position={[x, 0, z]}>
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.28, 0.38, 2, 8]} />
            <meshStandardMaterial color="#68462d" />
          </mesh>
          <mesh position={[0, 2.4, 0]} castShadow>
            <dodecahedronGeometry args={[1.3, 0]} />
            <meshStandardMaterial color="#1c9b57" />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 0.5, -4]} castShadow>
        <boxGeometry args={[3, 1, 2]} />
        <meshStandardMaterial color="#e66b52" />
      </mesh>

      <WorldCharacter
        position={position}
        color={avatar?.shirt || "#2469a8"}
        username="You"
        local
      />

      {remotePlayers.map((player) => (
        <WorldCharacter
          key={player.id}
          position={[player.x || 0, player.z || 0]}
          color={player.color || "#2469a8"}
          username={player.username}
        />
      ))}

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2.15}
        target={[0, 0, 0]}
      />
    </>
  );
}

export default function GameWorld({ game, avatar, username, onExit }) {
  const [position, setPosition] = useState([0, 0]);
  const [remotePlayers, setRemotePlayers] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const state = await api.worldState(game.id);
        const players = state.players || state || [];
        if (Array.isArray(players)) {
          setRemotePlayers(
            players.filter((p) => p.username !== username)
          );
        }
      } catch {
        // Keep the local world playable when the multiplayer endpoint is unavailable.
      }
    }, 1500);

    return () => clearInterval(timer);
  }, [game.id, username]);

  useEffect(() => {
    const timer = setInterval(() => {
      api.updatePosition(game.id, {
        x: position[0],
        z: position[1]
      }).catch(() => {});
    }, 1000);

    return () => clearInterval(timer);
  }, [game.id, position]);

  function move(value) {
    window.dispatchEvent(
      new CustomEvent("rovival-move", { detail: value })
    );
  }

  function jump() {
    window.dispatchEvent(new Event("rovival-jump"));
  }

  return (
    <div className="game-screen">
      <div className="game-topbar">
        <button className="game-exit" onClick={onExit}>
          <X size={20} />
        </button>
        <div className="game-title">
          <strong>{game.name}</strong>
          <span>Rovival server</span>
        </div>
        <button
          className="game-chat-button"
          onClick={() => setChatOpen((value) => !value)}
        >
          <MessageCircle size={20} />
          <span>Chat</span>
        </button>
      </div>

      <Canvas
        shadows
        camera={{ position: [0, 10, 14], fov: 48 }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#83c9e8"]} />
        <fog attach="fog" args={["#83c9e8", 18, 42]} />
        <Scene
          avatar={avatar}
          position={position}
          setPosition={setPosition}
          remotePlayers={remotePlayers}
        />
      </Canvas>

      <div className="mobile-controls">
        <Joystick onMove={move} />
        <button className="jump-button" onTouchStart={jump} onClick={jump}>
          <span>↑</span>
          Jump
        </button>
      </div>

      {chatOpen && (
        <ChatPanel
          gameId={game.id}
          username={username}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
}
