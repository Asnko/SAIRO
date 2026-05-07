// Shared UI atoms for SCH Campus AI

const C = window.SCH.color;
const F = window.SCH.font;

// ─────────── SCH wordmark logotype (original) ───────────
function SCHMark({ color = C.blue, size = 28 }) {
  // Custom SCH-style block monogram (not a copy of the official logo)
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      fontFamily: F.sans, fontWeight: 800, fontSize: size,
      color, letterSpacing: -1,
    }}>
      <div style={{
        width: size * 1.05, height: size * 0.95,
        background: color, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.5, fontWeight: 900, letterSpacing: -0.5,
        borderRadius: 4,
      }}>SCH</div>
    </div>
  );
}

// ─────────── Generic icon set (stroke-based, original) ───────────
function Icon({ name, size = 22, color = 'currentColor', stroke = 1.7 }) {
  const p = { fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    home:    <><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1v-9z" {...p}/></>,
    chat:    <><path d="M21 12a8 8 0 01-12.5 6.6L3 20l1.4-5.5A8 8 0 1121 12z" {...p}/></>,
    map:     <><path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" {...p}/></>,
    cal:     <><rect x="3" y="5" width="18" height="16" rx="2" {...p}/><path d="M3 10h18M8 3v4M16 3v4" {...p}/></>,
    note:    <><path d="M5 4h11l4 4v12a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1zM16 4v4h4M8 12h8M8 16h5" {...p}/></>,
    user:    <><circle cx="12" cy="8" r="4" {...p}/><path d="M4 21c1.5-4.5 5-7 8-7s6.5 2.5 8 7" {...p}/></>,
    bell:    <><path d="M6 8a6 6 0 1112 0c0 7 3 7 3 9H3c0-2 3-2 3-9zM10 21a2 2 0 004 0" {...p}/></>,
    search:  <><circle cx="11" cy="11" r="7" {...p}/><path d="M20 20l-3.5-3.5" {...p}/></>,
    arrow:   <><path d="M5 12h14M13 6l6 6-6 6" {...p}/></>,
    chev:    <><path d="M9 6l6 6-6 6" {...p}/></>,
    chevD:   <><path d="M6 9l6 6 6-6" {...p}/></>,
    plus:    <><path d="M12 5v14M5 12h14" {...p}/></>,
    sparkle: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" {...p}/></>,
    mic:     <><rect x="9" y="3" width="6" height="11" rx="3" {...p}/><path d="M5 11a7 7 0 0014 0M12 18v3" {...p}/></>,
    location:<><path d="M12 22s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z" {...p}/><circle cx="12" cy="10" r="2.5" {...p}/></>,
    stairs:  <><path d="M3 20h4v-4h4v-4h4V8h4V4" {...p}/></>,
    elevator:<><rect x="5" y="3" width="14" height="18" rx="2" {...p}/><path d="M9 9l3-3 3 3M9 15l3 3 3-3" {...p}/></>,
    slope:   <><path d="M3 20L21 6M3 20h18" {...p}/></>,
    book:    <><path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5z" {...p}/><path d="M4 19a2 2 0 012-2h13" {...p}/></>,
    clock:   <><circle cx="12" cy="12" r="9" {...p}/><path d="M12 7v5l3 2" {...p}/></>,
    link:    <><path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1" {...p}/></>,
    flag:    <><path d="M5 21V4M5 4h12l-2 4 2 4H5" {...p}/></>,
    check:   <><path d="M5 12l5 5 9-11" {...p}/></>,
    send:    <><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" {...p}/></>,
    image:   <><rect x="3" y="4" width="18" height="16" rx="2" {...p}/><circle cx="9" cy="10" r="2" {...p}/><path d="M21 17l-5-5-9 9" {...p}/></>,
    settings:<><circle cx="12" cy="12" r="3" {...p}/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" {...p}/></>,
    graph:   <><path d="M3 20h18M6 16V8M11 20V4M16 16v-6M21 20v-3" {...p}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>
      {paths[name] || null}
    </svg>
  );
}

// ─────────── Status bar (mini, white text on blue) ───────────
function MiniStatusBar({ dark = false, time = '9:41' }) {
  const c = dark ? '#fff' : '#0F1A2E';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 28px 0', height: 54, boxSizing: 'border-box',
      fontFamily: F.sans, color: c,
    }}>
      <div style={{ fontWeight: 600, fontSize: 16 }}>{time}</div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="7" width="3" height="4" rx="0.6" fill={c}/><rect x="4.5" y="5" width="3" height="6" rx="0.6" fill={c}/><rect x="9" y="2.5" width="3" height="8.5" rx="0.6" fill={c}/><rect x="13.5" y="0" width="3" height="11" rx="0.6" fill={c}/></svg>
        <svg width="15" height="11" viewBox="0 0 15 11"><path d="M7.5 2.8C9.5 2.8 11.4 3.6 12.7 4.9L13.6 4C12 2.4 9.8 1.4 7.5 1.4C5.2 1.4 3 2.4 1.4 4L2.3 4.9C3.6 3.6 5.5 2.8 7.5 2.8Z" fill={c}/><circle cx="7.5" cy="9" r="1.4" fill={c}/></svg>
        <svg width="24" height="12" viewBox="0 0 24 12"><rect x="0.5" y="0.5" width="20" height="11" rx="3" stroke={c} strokeOpacity="0.4" fill="none"/><rect x="2" y="2" width="17" height="8" rx="1.5" fill={c}/><path d="M22 4v4c.7-.3 1.3-1.1 1.3-2S22.7 4.3 22 4z" fill={c} fillOpacity="0.4"/></svg>
      </div>
    </div>
  );
}

// ─────────── Tab bar ───────────
function TabBar({ current, onChange }) {
  const tabs = [
    { id: 'home',  icon: 'home',  label: '홈' },
    { id: 'chat',  icon: 'chat',  label: 'SCH-AI' },
    { id: 'sched', icon: 'cal',   label: '시간표' },
    { id: 'map',   icon: 'map',   label: '캠퍼스' },
    { id: 'note',  icon: 'note',  label: '메모' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
      paddingBottom: 22, paddingTop: 8,
      background: '#FFFFFF',
      borderTop: `0.5px solid ${C.line}`,
      boxShadow: '0 -2px 16px rgba(15,26,46,0.04)',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(5,1fr)',
        padding: '0 4px',
      }}>
        {tabs.map(t => {
          const active = current === t.id;
          return (
            <button key={t.id} onClick={() => onChange(t.id)} style={{
              border: 0, background: 'transparent', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, padding: '6px 0',
              color: active ? C.blue : C.ink3,
              fontFamily: F.sans, fontSize: 10.5, fontWeight: active ? 700 : 500,
              letterSpacing: -0.2,
            }}>
              <Icon name={t.icon} size={24} stroke={active ? 2 : 1.6}/>
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────── Card ───────────
function Card({ children, style = {}, padding = 16, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: C.card, borderRadius: 18,
      border: `0.5px solid ${C.line}`,
      boxShadow: '0 1px 2px rgba(15,26,46,0.04)',
      padding, cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>{children}</div>
  );
}

// ─────────── Tag / Pill ───────────
function Tag({ children, tone = 'neutral', size = 'sm' }) {
  const tones = {
    neutral: { bg: C.cardSubtle,             fg: C.ink2 },
    blue:    { bg: 'rgba(38,83,156,0.08)',   fg: C.blue },
    sky:     { bg: 'rgba(28,154,214,0.10)',  fg: '#0E6FA8' },
    purple:  { bg: 'rgba(77,32,122,0.08)',   fg: C.purple },
    gold:    { bg: 'rgba(157,126,63,0.10)',  fg: C.gold },
    success: { bg: 'rgba(31,138,91,0.10)',   fg: C.success },
    warn:    { bg: 'rgba(199,134,30,0.12)',  fg: C.warn },
  };
  const t = tones[tone] || tones.neutral;
  const sizes = { sm: { fs: 11, py: 3, px: 8 }, md: { fs: 12, py: 5, px: 10 } };
  const s = sizes[size];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: t.bg, color: t.fg,
      padding: `${s.py}px ${s.px}px`, borderRadius: 999,
      fontFamily: F.sans, fontSize: s.fs, fontWeight: 600,
      letterSpacing: -0.1, whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}

// ─────────── Section header ───────────
function SectionHeader({ title, action, accent = 'serif' }) {
  // Inspired by the homepage's italic-serif initial-letter treatment, abstracted.
  const first = String(title).charAt(0);
  const rest  = String(title).slice(1);
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      padding: '0 20px', marginBottom: 10,
    }}>
      <h3 style={{
        margin: 0, fontFamily: F.sans, fontSize: 19, fontWeight: 700,
        letterSpacing: -0.5, color: C.ink, display: 'flex', alignItems: 'baseline', gap: 1,
      }}>
        {accent === 'serif' ? (
          <>
            <span style={{
              fontFamily: F.serif, fontStyle: 'italic', fontWeight: 600,
              fontSize: 24, color: C.blue, lineHeight: 0.9, marginRight: 1,
            }}>{first}</span>
            <span>{rest}</span>
          </>
        ) : title}
      </h3>
      {action && (
        <button style={{
          border: 0, background: 'transparent', color: C.ink3,
          fontFamily: F.sans, fontSize: 12, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 2,
        }}>
          {action} <Icon name="chev" size={12} color={C.ink3}/>
        </button>
      )}
    </div>
  );
}

// ─────────── Striped placeholder image ───────────
function ImagePlaceholder({ label, h = 120, tone = 'blue', radius = 12 }) {
  const tones = {
    blue:   { a: '#26539C', b: '#1A3F7A' },
    sky:    { a: '#1C9AD6', b: '#0E6FA8' },
    purple: { a: '#4D207A', b: '#36154E' },
    silver: { a: '#A6A8AB', b: '#7E8085' },
  };
  const t = tones[tone] || tones.blue;
  return (
    <div style={{
      height: h, borderRadius: radius, position: 'relative', overflow: 'hidden',
      background: `repeating-linear-gradient(135deg, ${t.a}, ${t.a} 14px, ${t.b} 14px, ${t.b} 28px)`,
      display: 'flex', alignItems: 'flex-end', padding: 10,
      fontFamily: F.mono, fontSize: 10, color: 'rgba(255,255,255,0.85)',
      letterSpacing: 0.3,
    }}>{label}</div>
  );
}

Object.assign(window, {
  SCHMark, Icon, MiniStatusBar, TabBar, Card, Tag, SectionHeader, ImagePlaceholder,
});
