import { useEffect, useRef } from 'react';

const THEMES = {
  light: {
    surface: '#ffffff',
    border: 'rgba(227, 232, 238, 1)', // hairline #e3e8ee
    shadow: '0 1px 3px rgba(0, 55, 112, 0.08)',
    light: '#533afd',
    fill: 0.08,
    edge: 0.5
  },
  dark: {
    surface: '#1c1e54',
    border: 'rgba(255, 255, 255, 0.12)',
    shadow: '0 8px 24px rgba(0, 55, 112, 0.15)',
    light: '#665efd',
    fill: 0.15,
    edge: 0.8
  }
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const falloff = (color, softness) => {
  const soft = clamp(softness, 0, 1);
  const core = (1 - soft) ** 1.5 * 0.85;
  const stop = (alpha, at) =>
    `color-mix(in srgb, ${color} ${(alpha * 100).toFixed(2)}%, transparent) ${(at * 100).toFixed(2)}%`;
  const list = [stop(1, 0)];
  for (let i = 0; i <= 14; i++) {
    const t = core + ((1 - core) * i) / 14;
    const g = (t - core) / (1 - core);
    const smooth = 1 - g * g * (3 - 2 * g);
    const glow = Math.exp(-4.6 * g * g) * (1 - g ** 6);
    list.push(stop(smooth + (glow - smooth) * soft, t));
  }
  return list.join(', ');
};

const CARD =
  'relative isolate overflow-hidden rounded-xl p-6 transition-all duration-200 [background-color:var(--spotlight-card-surface)] [box-shadow:var(--spotlight-card-shadow)] border border-[#e3e8ee]';

const SpotlightCard = ({
  children,
  className = '',
  style,
  spotlightColor,
  intensity = 0.12,
  spotlightSize = 260,
  softness = 0.75,
  theme = 'light',
  ...rest
}) => {
  const rootRef = useRef(null);
  const lightRef = useRef(null);
  const edgeRef = useRef(null);
  const wakeRef = useRef(null);
  const palette = THEMES[theme] ?? THEMES.light;
  const color = spotlightColor ?? palette.light;

  const settings = {
    fill: falloff(color, softness),
    edge: falloff(color, 1),
    size: Math.max(20, spotlightSize),
    intensity: clamp(intensity, 0, 1) * palette.fill,
    borderGlow: 0.5 * palette.edge,
    proximity: 60,
    smoothing: 0.3
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    wakeRef.current?.();
  });

  useEffect(() => {
    const root = rootRef.current;
    const light = lightRef.current;
    const edge = edgeRef.current;
    if (!root || !light || !edge) return undefined;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const state = { x: 0, y: 0, presence: 0, time: 0, visible: true };
    const pointer = { x: 0, y: 0, active: false };
    let raf = 0;
    let alive = true;

    const gradient = (s, size, x, y, stops) => {
      return `radial-gradient(circle ${size.toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px, ${stops})`;
    };

    const paint = s => {
      const sx = state.x;
      const sy = state.y;
      const p = state.presence;
      if (p <= 0) {
        light.style.opacity = '0';
        edge.style.opacity = '0';
        return;
      }
      light.style.background = gradient(s, s.size, sx, sy, s.fill);
      light.style.opacity = (p * s.intensity).toFixed(3);
      edge.style.background = gradient(s, s.size * 0.8, sx, sy, s.edge);
      edge.style.opacity = (p * s.borderGlow).toFixed(3);
    };

    const tick = () => {
      if (!alive) return;
      const rect = root.getBoundingClientRect();
      const target = pointer.active && state.visible ? 1 : 0;
      state.presence += (target - state.presence) * 0.2;
      state.x += (pointer.x - rect.left - state.x) * 0.2;
      state.y += (pointer.y - rect.top - state.y) * 0.2;
      paint(settingsRef.current);

      if (Math.abs(target - state.presence) > 0.01) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const wake = () => {
      if (raf || !alive) return;
      raf = requestAnimationFrame(tick);
    };
    wakeRef.current = wake;

    const onMove = event => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
      wake();
    };

    const onLeave = () => {
      pointer.active = false;
      wake();
    };

    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', onLeave);
    wake();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`${CARD} ${className}`.trim()}
      style={{
        '--spotlight-card-surface': palette.surface,
        '--spotlight-card-border': palette.border,
        '--spotlight-card-shadow': palette.shadow,
        ...style
      }}
      {...rest}
    >
      <span
        ref={lightRef}
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-0 transition-opacity duration-300"
        aria-hidden="true"
      />
      {children}
      <span
        ref={edgeRef}
        className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] p-px opacity-0 transition-opacity duration-300"
        aria-hidden="true"
      />
    </div>
  );
};

export default SpotlightCard;

