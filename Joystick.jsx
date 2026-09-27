import React, { useEffect, useRef, useState } from "react";

export default function Joystick({ onMove }) {
  const zoneRef = useRef(null);
  const [active, setActive] = useState(false);
  const [stick, setStick] = useState({ x: 0, y: 0 });

  function move(clientX, clientY) {
    const zone = zoneRef.current;
    if (!zone) return;

    const rect = zone.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const max = rect.width * 0.32;

    let dx = clientX - cx;
    let dy = clientY - cy;
    const length = Math.hypot(dx, dy);

    if (length > max) {
      dx = (dx / length) * max;
      dy = (dy / length) * max;
    }

    const x = dx / max;
    const y = dy / max;

    setStick({ x, y });
    onMove?.({ x, y });
  }

  function end() {
    setActive(false);
    setStick({ x: 0, y: 0 });
    onMove?.({ x: 0, y: 0 });
  }

  useEffect(() => {
    const handleMove = (event) => {
      if (!active) return;
      const touch = event.touches[0];
      if (touch) move(touch.clientX, touch.clientY);
    };

    const handleEnd = () => {
      if (active) end();
    };

    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [active]);

  return (
    <div
      ref={zoneRef}
      className="joystick-zone"
      onTouchStart={(e) => {
        setActive(true);
        const touch = e.touches[0];
        move(touch.clientX, touch.clientY);
      }}
      onMouseDown={(e) => {
        setActive(true);
        move(e.clientX, e.clientY);
      }}
    >
      <div
        className="joystick-stick"
        style={{
          transform: `translate(calc(-50% + ${stick.x * 32}px), calc(-50% + ${stick.y * 32}px))`
        }}
      />
    </div>
  );
}
