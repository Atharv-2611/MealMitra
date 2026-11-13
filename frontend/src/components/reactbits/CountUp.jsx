import { animate, cubicBezier, useInView } from 'motion/react';
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';

const CELL = 1.2;
const STAGGER = 0.07;
const UNITS = [
  [1e12, 'T'],
  [1e9, 'B'],
  [1e6, 'M'],
  [1e3, 'K']
];
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const clamp01 = value => Math.min(1, Math.max(0, value));
const mod10 = value => ((value % 10) + 10) % 10;

const makeSpring = overshoot => {
  const log = Math.log(Math.min(0.5, Math.max(0.001, overshoot)));
  const zeta = -log / Math.sqrt(Math.PI * Math.PI + log * log);
  const damped = Math.PI / 0.52;
  const natural = damped / Math.sqrt(1 - zeta * zeta);
  const raw = t =>
    1 - Math.exp(-zeta * natural * t) * (Math.cos(damped * t) + ((zeta * natural) / damped) * Math.sin(damped * t));
  const residual = 1 - raw(1);
  return t => (t >= 1 ? 1 : raw(t) + residual * t * t * t);
};

const EASINGS = {
  linear: t => t,
  easeOut: cubicBezier(0.33, 1, 0.68, 1),
  expo: t => (t >= 1 ? 1 : (1 - Math.pow(2, -10 * t)) / (1 - Math.pow(2, -10))),
  spring: makeSpring(0.06)
};

const getDecimalPlaces = num => {
  const str = num.toString();
  if (str.includes('.')) {
    const decimals = str.split('.')[1];
    if (parseInt(decimals) !== 0) {
      return decimals.length;
    }
  }
  return 0;
};

const unitFor = value => UNITS.find(([size]) => Math.abs(value) >= size * 0.9995) || [1, ''];

const scaleFor = (value, compact, decimals, places) => {
  if (!compact) return { size: 1, label: '', digits: places };
  const [size, label] = unitFor(value);
  const digits = decimals ?? (label ? (Math.abs(value) / size < 100 ? 1 : 0) : places);
  return { size, label, digits };
};

const splitNumber = (value, digits, size) => {
  const fixed = (Math.abs(value) / size).toFixed(digits);
  const [int, frac = ''] = fixed.split('.');
  return { negative: value < 0 && Number(fixed) !== 0, int, frac };
};

const buildRoll = (a, b, spin, { compact, decimals, places, separator }) => {
  const { size, label, digits } = scaleFor(b, compact, decimals, places);
  const pa = splitNumber(a, digits, size);
  const pb = splitNumber(b, digits, size);
  const length = Math.max(pa.int.length, pb.int.length);
  const slots = [];
  const columns = [];
  if (pa.negative || pb.negative) slots.push({ char: '-', enter: !pa.negative, leave: !pb.negative });
  const digitAt = (parts, place) => {
    if (place < 0) return Number(parts.frac[-place - 1]);
    const index = parts.int.length - 1 - place;
    return index >= 0 ? Number(parts.int[index]) : null;
  };
  for (let place = length - 1; place >= -digits; place--) {
    if (place === -1) slots.push({ char: '.' });
    const start = digitAt(pa, place);
    const end = digitAt(pb, place);
    const column = {
      slot: slots.length,
      index: columns.length,
      place,
      from: start ?? 0,
      to: end ?? 0,
      enter: start === null,
      leave: end === null
    };
    slots.push(column);
    columns.push(column);
    if (separator && place > 0 && place % 3 === 0) slots.push({ char: separator, follow: column.index });
  }
  const up = spin || b >= a;
  columns.forEach((column, index) => {
    const rank = columns.length - 1 - index;
    const base = up ? mod10(column.to - column.from) : -mod10(column.from - column.to);
    const turns = spin
      ? Math.max(1, 3 - rank)
      : Math.min(Math.floor(Math.abs(b - a) / (size * 10 ** (column.place + 1))), Math.max(0, 3 - rank));
    column.delta = base + (up ? 10 : -10) * turns;
  });
  return { slots, columns, label };
};

export default function CountUp({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 2,
  className = '',
  style,
  startWhen = true,
  separator = '',
  decimals,
  compact = false,
  mode = 'roll',
  easing = 'easeOut',
  replayOnHover = false,
  prefix = '',
  suffix = '',
  onStart,
  onEnd
}) {
  const ref = useRef(null);
  const textRef = useRef(null);
  const slotRefs = useRef([]);
  const filterRefs = useRef([]);
  const startedRef = useRef(false);
  const runningRef = useRef(false);
  const valueRef = useRef(from);
  const uid = useId();

  const inView = useInView(ref, { once: true, margin: '0px' });
  const startValue = direction === 'down' ? to : from;
  const endValue = direction === 'down' ? from : to;
  const places = useMemo(() => decimals ?? getDecimalPlaces(to), [decimals, to]);

  const latestRef = useRef({ onStart, onEnd });
  latestRef.current = { onStart, onEnd };

  const [play, setPlay] = useState(null);

  const formatValue = useCallback(
    value => {
      const { size, label, digits } = scaleFor(value, compact, decimals, places);
      const { negative, int, frac } = splitNumber(value, digits, size);
      const whole = separator ? int.replace(/\B(?=(\d{3})+(?!\d))/g, separator) : int;
      const body = digits > 0 ? `${whole}.${frac}` : whole;
      return `${negative ? '-' : ''}${prefix}${body}${label}${suffix}`;
    },
    [compact, decimals, places, prefix, separator, suffix]
  );

  const initialText = useMemo(() => formatValue(startValue), [formatValue, startValue]);

  const model = useMemo(() => {
    if (mode !== 'roll') return null;
    const a = play ? play.from : startValue;
    const b = play ? play.to : endValue;
    return buildRoll(a, b, play?.spin ?? false, { compact, decimals, places, separator });
  }, [mode, play, startValue, endValue, compact, decimals, places, separator]);

  useEffect(() => {
    if (!startWhen || !inView || startedRef.current) return;
    startedRef.current = true;
    setPlay({ id: 1, from: startValue, to: endValue, spin: false, wait: delay > 0 });
  }, [startWhen, inView, startValue, endValue, delay]);

  useIsoLayoutEffect(() => {
    if (!play) return undefined;
    const easeFn = typeof easing === 'function' ? easing : EASINGS[easing] || EASINGS.easeOut;
    const total = Math.max(0.1, duration);
    const count = model ? model.columns.length : 0;
    const staggerTime = Math.min(STAGGER, (total * 0.5) / Math.max(1, count - 1));
    const live = {
      from: play.from,
      to: play.to,
      duration: total,
      delay: play.wait ? delay : 0,
      ease: easeFn
    };

    runningRef.current = true;
    if (typeof latestRef.current.onStart === 'function') latestRef.current.onStart();

    const render = progress => {
      if (!runningRef.current) return;
      if (model) {
        model.columns.forEach(column => {
          const rank = model.columns.length - 1 - column.index;
          const start = rank * staggerTime;
          const localDuration = total - (model.columns.length - 1) * staggerTime;
          const localProgress = clamp01((progress - start) / localDuration);
          const eased = live.ease(localProgress);
          const value = column.from + column.delta * eased;
          const slot = slotRefs.current[column.slot];
          if (slot) {
            const digitChild = slot.firstElementChild;
            if (digitChild) {
              digitChild.style.transform = `translateY(${-mod10(value) * CELL}em)`;
            }
          }
        });
      } else if (textRef.current) {
        const value = live.from + (live.to - live.from) * live.ease(clamp01(progress / total));
        textRef.current.textContent = formatValue(value);
      }
    };

    const finish = () => {
      render(Infinity);
      valueRef.current = play.to;
      runningRef.current = false;
      if (typeof latestRef.current.onEnd === 'function') latestRef.current.onEnd();
    };

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return undefined;
    }

    const controls = animate(0, total, {
      duration: total,
      delay: play.wait ? live.delay : 0,
      ease: 'linear',
      onUpdate: render,
      onComplete: finish
    });

    return () => {
      controls.stop();
      runningRef.current = false;
    };
  }, [play, uid]);

  const replay = () => {
    if (!replayOnHover || runningRef.current || !startedRef.current) return;
    setPlay(previous =>
      mode === 'roll'
        ? { id: (previous?.id || 0) + 1, from: valueRef.current, to: valueRef.current, spin: true }
        : { id: (previous?.id || 0) + 1, from: startValue, to: endValue, spin: false }
    );
  };

  const finalText = formatValue(play ? play.to : endValue);

  return (
    <span
      className={`tabular-nums ${className}`}
      ref={ref}
      style={style}
      onPointerEnter={replayOnHover ? replay : undefined}
    >
      {model ? (
        <>
          <span key={`roll-${play?.id || 0}`} aria-hidden="true" className="inline-flex whitespace-pre select-none">
            {prefix && <span className="inline-block h-[1.2em] leading-[1.2em]">{prefix}</span>}
            {model.slots.map((slot, index) => {
              const hidden =
                slot.char !== undefined
                  ? slot.enter || (slot.follow !== undefined && model.columns[slot.follow].enter)
                  : slot.enter;
              const collapsed = hidden ? { width: 0, opacity: 0 } : null;
              if (slot.char !== undefined) {
                return (
                  <span
                    key={index}
                    ref={node => {
                      slotRefs.current[index] = node;
                    }}
                    className="inline-block h-[1.2em] leading-[1.2em] overflow-hidden"
                    style={collapsed ?? undefined}
                  >
                    {slot.char}
                  </span>
                );
              }
              return (
                <span
                  key={index}
                  ref={node => {
                    slotRefs.current[index] = node;
                  }}
                  className="relative inline-block h-[1.2em] leading-[1.2em] overflow-hidden"
                  style={collapsed ?? undefined}
                >
                  <span className="flex flex-col" style={{ transform: `translateY(${-CELL}em)` }}>
                    {[-1, 0, 1, 2].map(offset => (
                      <span key={offset} className="h-[1.2em]">
                        {mod10(slot.from + offset)}
                      </span>
                    ))}
                  </span>
                </span>
              );
            })}
            {model.label && <span className="inline-block h-[1.2em] leading-[1.2em]">{model.label}</span>}
            {suffix && <span className="inline-block h-[1.2em] leading-[1.2em]">{suffix}</span>}
          </span>
          <span className="sr-only">{finalText}</span>
        </>
      ) : (
        <span key="count" ref={textRef}>
          {initialText}
        </span>
      )}
    </span>
  );
}

