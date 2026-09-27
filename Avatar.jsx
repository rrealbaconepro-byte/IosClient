import React from "react";

export default function Avatar({ avatar = {}, size = "normal" }) {
  const body = avatar.bodyColor || "#ffd323";
  const shirt = avatar.shirt || "#2469a8";
  const pants = avatar.pants || "#263b75";

  return (
    <div className={`avatar avatar-${size}`} aria-label="Rovival avatar">
      <div className="avatar-head" style={{ background: body }}>
        <span className="avatar-face">
          <i />
          <i />
        </span>
      </div>
      <div className="avatar-torso" style={{ background: shirt }} />
      <div className="avatar-arm left" style={{ background: shirt }} />
      <div className="avatar-arm right" style={{ background: shirt }} />
      <div className="avatar-leg left" style={{ background: pants }} />
      <div className="avatar-leg right" style={{ background: pants }} />
      {avatar.hat && <div className="avatar-hat" />}
    </div>
  );
}
