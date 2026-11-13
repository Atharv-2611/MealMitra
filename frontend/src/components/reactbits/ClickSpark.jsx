import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const EASINGS = {
  linear: t => t,
  'ease-in': t => t * t,
  'ease-out': t => 1 - Math.pow(1 - t, 3),
  'ease-in-out': t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const ClickSpark = forwardRef(
  (
    {
      sparkColor = '#533afd',
      sparkSize = 10,
      sparkRadius = 24,
      sparkCount = 6,
      sparkWidth = 1.8,
      duration = 400,
      easing = 'ease-out',
      disabled = false,
      className = '',
      style,
      children
    },
    ref
  ) => {
    const rootRef = useRef(null);
    const layerRef = useRef(null);
    const engineRef = useRef(null);

    useEffect(() => {
      const root = rootRef.current;
      const layer = layerRef.current;
      if (!root || !layer || disabled) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) return;

      const bursts = [];
      let raf = 0;

      const frame = now => {
        for (let i = bursts.length - 1; i >= 0; i--) {
          const b = bursts[i];
          const elapsed = now - b.start;
          const p = elapsed / duration;
          if (p >= 1) {
            b.canvas.remove();
            bursts.splice(i, 1);
            continue;
          }
          const ease = EASINGS[easing] ? EASINGS[easing](p) : p;
          const ctx = b.ctx;
          ctx.clearRect(0, 0, b.canvas.width, b.canvas.height);

          const alpha = 1 - p;
          ctx.strokeStyle = sparkColor;
          ctx.lineWidth = sparkWidth * b.ratio;
          ctx.lineCap = 'round';

          for (const s of b.sparks) {
            const dist = ease * sparkRadius * b.ratio;
            const x1 = b.cx + Math.cos(s.angle) * dist;
            const y1 = b.cy + Math.sin(s.angle) * dist;
            const x2 = b.cx + Math.cos(s.angle) * (dist + sparkSize * (1 - ease) * b.ratio);
            const y2 = b.cy + Math.sin(s.angle) * (dist + sparkSize * (1 - ease) * b.ratio);

            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }

        if (bursts.length > 0) {
          raf = requestAnimationFrame(frame);
        } else {
          raf = 0;
        }
      };

      const spawn = (clientX, clientY) => {
        const rect = root.getBoundingClientRect();
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        const canvas = document.createElement('canvas');
        const size = (sparkRadius + sparkSize) * 2 + 10;

        canvas.width = size * ratio;
        canvas.height = size * ratio;
        Object.assign(canvas.style, {
          position: 'absolute',
          left: `${clientX - rect.left - size / 2}px`,
          top: `${clientY - rect.top - size / 2}px`,
          width: `${size}px`,
          height: `${size}px`,
          pointerEvents: 'none'
        });
        layer.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const sparks = Array.from({ length: sparkCount }, (_, i) => ({
          angle: (i / sparkCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4
        }));

        bursts.push({
          start: performance.now(),
          canvas,
          ctx,
          ratio,
          cx: (size / 2) * ratio,
          cy: (size / 2) * ratio,
          sparks
        });

        if (!raf) raf = requestAnimationFrame(frame);
      };

      const onClick = e => {
        spawn(e.clientX, e.clientY);
      };

      root.addEventListener('click', onClick);

      return () => {
        cancelAnimationFrame(raf);
        root.removeEventListener('click', onClick);
        bursts.forEach(b => b.canvas.remove());
      };
    }, [disabled, duration, easing, sparkColor, sparkCount, sparkRadius, sparkSize, sparkWidth]);

    return (
      <div ref={rootRef} className={`relative isolate inline-block ${className}`.trim()} style={style}>
        {children}
        <span
          ref={layerRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-visible z-[1]"
        />
      </div>
    );
  }
);

ClickSpark.displayName = 'ClickSpark';

export default ClickSpark;

