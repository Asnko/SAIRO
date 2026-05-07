// SCH Campus AI — Screens part 2: Schedule, Map, Notes

const SC2 = window.SCH.color;
const SF2 = window.SCH.font;

// ═══════════════════════════════════════════════════════
// 4. SCHEDULE — timetable + academic calendar
// ═══════════════════════════════════════════════════════
function ScreenSchedule({ go }) {
  const [view, setView] = React.useState('week'); // week | list

  const days = ['월', '화', '수', '목', '금'];
  const dates = [4, 5, 6, 7, 8];
  const today = 2;
  const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17];

  const courses = [
    { day: 0, start: 9,  dur: 1.25, name: '선형대수',          room: '향설관 304',  tone: 'blue' },
    { day: 0, start: 13, dur: 1.25, name: '데이터구조',        room: '유담관 215',  tone: 'sky' },
    { day: 1, start: 10.5, dur: 1.25, name: '알고리즘 분석',  room: '멘토관 412', tone: 'purple' },
    { day: 1, start: 14, dur: 1.25, name: '자료구조 실습',     room: '유담관 311',  tone: 'sky' },
    { day: 2, start: 10.5, dur: 1.25, name: '인공지능 개론',  room: '멘토관 503', tone: 'sky', live: true },
    { day: 2, start: 13, dur: 1.25, name: '데이터베이스',      room: '유담관 411', tone: 'blue' },
    { day: 3, start: 9,  dur: 1.25, name: '선형대수',          room: '향설관 304', tone: 'blue' },
    { day: 3, start: 15, dur: 1.25, name: '확률통계',          room: '향설관 209', tone: 'gold' },
    { day: 4, start: 10.5, dur: 1.25, name: '알고리즘 분석',  room: '멘토관 412', tone: 'purple' },
    { day: 4, start: 13, dur: 2.5, name: '캡스톤 디자인',      room: 'IT관 102', tone: 'gold' },
  ];

  const tonePalette = {
    blue:   { bg: 'rgba(38,83,156,0.10)',  bar: SC2.blue,    fg: SC2.blue },
    sky:    { bg: 'rgba(28,154,214,0.12)', bar: SC2.blueSky, fg: '#0E6FA8' },
    purple: { bg: 'rgba(77,32,122,0.10)',  bar: SC2.purple,  fg: SC2.purple },
    gold:   { bg: 'rgba(157,126,63,0.12)', bar: SC2.gold,    fg: SC2.gold },
  };

  const ROW_H = 56; // px per hour
  const HEAD = 36;
  const TIME_COL = 32;

  return (
    <div style={{ height: '100%', overflow: 'auto', background: SC2.bg, paddingBottom: 110 }}>
      <MiniStatusBar/>

      {/* Header */}
      <div style={{ padding: '8px 20px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, color: SC2.ink3, fontWeight: 600, letterSpacing: 1 }}>
            2026 SPRING · WEEK 10
          </div>
          <h1 style={{ margin: '4px 0 0', fontSize: 26, fontWeight: 700, color: SC2.ink, letterSpacing: -0.8 }}>
            <span style={{ fontFamily: SF2.serif, fontStyle: 'italic', color: SC2.blue, marginRight: 2 }}>S</span>
            chedule
          </h1>
        </div>
        <div style={{
          display: 'flex', padding: 3, background: SC2.cardSubtle, borderRadius: 10,
        }}>
          {[{ id: 'week', l: '주' }, { id: 'list', l: '목록' }].map(t => (
            <button key={t.id} onClick={() => setView(t.id)} style={{
              padding: '6px 14px', border: 0, borderRadius: 8,
              background: view === t.id ? SC2.card : 'transparent',
              color: view === t.id ? SC2.ink : SC2.ink3,
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              boxShadow: view === t.id ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
            }}>{t.l}</button>
          ))}
        </div>
      </div>

      {/* Date strip */}
      <div style={{ padding: '0 16px 14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `${TIME_COL}px repeat(5,1fr)`, gap: 4 }}>
          <div/>
          {days.map((d, i) => {
            const isToday = i === today;
            return (
              <div key={d} style={{
                textAlign: 'center', padding: '6px 0', borderRadius: 10,
                background: isToday ? SC2.blue : 'transparent',
                color: isToday ? '#fff' : SC2.ink3,
              }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.5,
                  opacity: isToday ? 0.9 : 1 }}>{d}</div>
                <div style={{ fontSize: 17, fontWeight: 700, marginTop: 2 }}>{dates[i]}</div>
              </div>
            );
          })}
        </div>
      </div>

      {view === 'week' ? (
        <div style={{ padding: '0 16px' }}>
          <div style={{
            background: SC2.card, borderRadius: 18, border: `0.5px solid ${SC2.line}`,
            position: 'relative', padding: '8px 6px',
          }}>
            <div style={{
              display: 'grid', gridTemplateColumns: `${TIME_COL}px repeat(5,1fr)`,
              position: 'relative',
            }}>
              {/* time col */}
              <div style={{ position: 'relative' }}>
                {hours.map((h, i) => (
                  <div key={h} style={{
                    height: ROW_H, fontSize: 9.5, fontWeight: 600,
                    color: SC2.ink4, textAlign: 'right', paddingRight: 6, paddingTop: 2,
                  }}>{h}:00</div>
                ))}
              </div>
              {/* day cols */}
              {days.map((_, di) => (
                <div key={di} style={{
                  position: 'relative',
                  borderLeft: `0.5px solid ${SC2.lineSoft}`,
                }}>
                  {hours.map((h, hi) => (
                    <div key={h} style={{
                      height: ROW_H,
                      borderTop: hi === 0 ? 'none' : `0.5px dashed ${SC2.lineSoft}`,
                    }}/>
                  ))}
                  {/* now line on today */}
                  {di === today && (
                    <div style={{
                      position: 'absolute', left: 0, right: 0,
                      top: (10.83 - 9) * ROW_H, // ~10:50
                      height: 2, background: SC2.danger, zIndex: 4,
                      boxShadow: `0 0 6px ${SC2.danger}55`,
                    }}>
                      <div style={{
                        position: 'absolute', left: -3, top: -3,
                        width: 8, height: 8, borderRadius: 4, background: SC2.danger,
                      }}/>
                    </div>
                  )}
                  {/* events */}
                  {courses.filter(c => c.day === di).map((c, ci) => {
                    const t = tonePalette[c.tone];
                    return (
                      <div key={ci} style={{
                        position: 'absolute', left: 3, right: 3,
                        top: (c.start - 9) * ROW_H + 1,
                        height: c.dur * ROW_H - 2,
                        background: t.bg, borderLeft: `2.5px solid ${t.bar}`,
                        borderRadius: 6, padding: '4px 5px',
                        overflow: 'hidden',
                        boxShadow: c.live ? `0 0 0 1.5px ${SC2.blueSky}` : 'none',
                      }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: t.fg,
                          letterSpacing: -0.2, lineHeight: 1.2 }}>
                          {c.name}
                        </div>
                        <div style={{ fontSize: 8.5, color: SC2.ink3, marginTop: 2,
                          letterSpacing: -0.1 }}>
                          {c.room}
                        </div>
                        {c.live && (
                          <div style={{
                            position: 'absolute', top: 4, right: 4,
                            width: 6, height: 6, borderRadius: 3, background: SC2.blueSky,
                            boxShadow: `0 0 0 2px ${SC2.blueSky}33`,
                          }}/>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Academic events strip */}
          <div style={{ padding: '20px 0 14px' }}>
            <SectionHeader title="Academic" action="더보기"/>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 16 }}>
            {[
              { d: '5/12', tag: '학사', tone: 'blue', t: '복수전공 신청 시작', sub: '평점 3.0 이상 신청 가능' },
              { d: '5/15', tag: '장학', tone: 'gold', t: '성적우수장학금 신청 마감', sub: '포털 → 장학 → 신청' },
              { d: '5/22', tag: '행사', tone: 'purple', t: '향림학술제 개막', sub: '본관광장 · 18:00' },
              { d: '6/15', tag: '시험', tone: 'warn', t: '기말고사 시작', sub: '수강 5과목 · 평균 부담도 중상' },
            ].map((e, i) => (
              <Card key={i} padding={12}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 50, textAlign: 'center', flexShrink: 0,
                    fontFamily: SF2.serif, fontStyle: 'italic',
                  }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: SC2.blue, lineHeight: 1 }}>{e.d}</div>
                  </div>
                  <div style={{ width: 1, height: 32, background: SC2.lineSoft }}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 2 }}>
                      <Tag tone={e.tone}>{e.tag}</Tag>
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: SC2.ink, letterSpacing: -0.2 }}>{e.t}</div>
                    <div style={{ fontSize: 11.5, color: SC2.ink3, marginTop: 1 }}>{e.sub}</div>
                  </div>
                  <Icon name="chev" size={14} color={SC2.ink4}/>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {courses.filter(c => c.day === today).map((c, i) => {
            const t = tonePalette[c.tone];
            return (
              <Card key={i} padding={0}>
                <div style={{ display: 'flex' }}>
                  <div style={{ width: 6, background: t.bar, borderRadius: '18px 0 0 18px' }}/>
                  <div style={{ flex: 1, padding: 14 }}>
                    <div style={{ fontSize: 12, color: t.fg, fontWeight: 700 }}>
                      {Math.floor(c.start)}:{c.start % 1 ? '30' : '00'}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: SC2.ink, marginTop: 2 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: SC2.ink3, marginTop: 2 }}>{c.room}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// 5. MAP — A* with terrain weights (stairs/elevator/slope)
// ═══════════════════════════════════════════════════════
function ScreenMap({ go }) {
  const [profile, setProfile] = React.useState('balanced'); // fast | balanced | accessible
  const [showSheet, setShowSheet] = React.useState(true);

  const profiles = {
    fast:       { time: '7분', stairs: 42, elev: 0, slope: '↑8%', label: '최단', icon: 'arrow' },
    balanced:   { time: '9분', stairs: 18, elev: 1, slope: '↑3%', label: '균형', icon: 'check' },
    accessible: { time: '12분', stairs: 0, elev: 3, slope: '↑1%', label: '무계단', icon: 'elevator' },
  };
  const p = profiles[profile];

  return (
    <div style={{ height: '100%', position: 'relative', background: '#E8EFF6', overflow: 'hidden' }}>
      {/* Map canvas */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {/* topographic background */}
        <svg width="100%" height="100%" viewBox="0 0 380 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0H0V32" fill="none" stroke="#CFD9E6" strokeWidth="0.5"/>
            </pattern>
            <radialGradient id="hill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D5DFEB"/>
              <stop offset="100%" stopColor="#E8EFF6"/>
            </radialGradient>
          </defs>
          <rect width="380" height="800" fill="url(#grid)"/>

          {/* contour hills (the campus is hilly) */}
          {[
            { cx: 90, cy: 220, r: 85, op: 0.5 },
            { cx: 90, cy: 220, r: 60, op: 0.7 },
            { cx: 90, cy: 220, r: 35, op: 0.9 },
            { cx: 290, cy: 540, r: 90, op: 0.4 },
            { cx: 290, cy: 540, r: 60, op: 0.6 },
            { cx: 290, cy: 540, r: 30, op: 0.85 },
          ].map((c, i) => (
            <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill="none"
              stroke="#9FB3CC" strokeWidth="1" strokeDasharray="3 3" opacity={c.op}/>
          ))}

          {/* roads */}
          <path d="M-10 380 Q 100 360 200 400 T 400 420" stroke="#fff" strokeWidth="14" fill="none"/>
          <path d="M-10 380 Q 100 360 200 400 T 400 420" stroke="#C9D4E2" strokeWidth="1" fill="none" strokeDasharray="0"/>
          <path d="M180 -10 Q 200 200 220 400 T 260 800" stroke="#fff" strokeWidth="11" fill="none"/>
          <path d="M180 -10 Q 200 200 220 400 T 260 800" stroke="#C9D4E2" strokeWidth="1" fill="none"/>

          {/* Buildings (rectangles) */}
          {[
            { x: 60, y: 200, w: 60, h: 38, l: '향설관' },
            { x: 150, y: 260, w: 70, h: 30, l: '본관' },
            { x: 70, y: 340, w: 50, h: 50, l: '멘토관', hi: true },
            { x: 240, y: 400, w: 60, h: 44, l: '유담관', hi: true },
            { x: 250, y: 530, w: 70, h: 38, l: 'IT관' },
            { x: 100, y: 540, w: 50, h: 36, l: '도서관' },
            { x: 280, y: 280, w: 50, h: 30, l: '학생회관' },
          ].map((b, i) => (
            <g key={i}>
              <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="3"
                fill={b.hi ? '#fff' : '#F0F2F7'}
                stroke={b.hi ? SC2.blue : '#B6C2D2'} strokeWidth={b.hi ? 1.5 : 0.6}/>
              <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 3.5} textAnchor="middle"
                fontSize="9" fontWeight="600" fill={b.hi ? SC2.blue : '#6B7587'}>{b.l}</text>
            </g>
          ))}

          {/* Optimal route — animated dashes */}
          <path
            d="M95 365 Q 130 360 165 365 Q 200 380 220 405 Q 240 420 260 422"
            stroke={SC2.blue} strokeWidth="4" fill="none"
            strokeLinecap="round"
          />
          <path
            d="M95 365 Q 130 360 165 365 Q 200 380 220 405 Q 240 420 260 422"
            stroke="#fff" strokeWidth="1.5" fill="none"
            strokeDasharray="4 6" strokeLinecap="round"
          >
            <animate attributeName="stroke-dashoffset" values="0;-20" dur="1s" repeatCount="indefinite"/>
          </path>

          {/* Alternate (faded) route */}
          <path
            d="M95 365 Q 90 420 110 470 Q 160 510 220 480 Q 250 450 260 422"
            stroke={SC2.silver} strokeWidth="3" fill="none"
            strokeDasharray="2 4" opacity="0.7"
          />

          {/* Terrain markers along route */}
          <circle cx="165" cy="365" r="9" fill="#fff" stroke={SC2.warn} strokeWidth="1.5"/>
          <text x="165" y="368" textAnchor="middle" fontSize="9" fontWeight="700" fill={SC2.warn}>≡</text>
          <circle cx="220" cy="405" r="9" fill="#fff" stroke={SC2.success} strokeWidth="1.5"/>
          <text x="220" y="409" textAnchor="middle" fontSize="9" fontWeight="700" fill={SC2.success}>↕</text>

          {/* Start */}
          <circle cx="95" cy="365" r="9" fill={SC2.blue}/>
          <circle cx="95" cy="365" r="5" fill="#fff"/>
          {/* End */}
          <circle cx="260" cy="422" r="11" fill="#fff" stroke={SC2.blue} strokeWidth="3"/>
          <circle cx="260" cy="422" r="5" fill={SC2.blue}/>
        </svg>

        {/* Pin labels */}
        <div style={{
          position: 'absolute', left: 'calc(95px / 380 * 100%)', top: 332,
          transform: 'translateX(-50%)',
        }}>
          <div style={{
            background: SC2.blue, color: '#fff', fontSize: 10, fontWeight: 700,
            padding: '3px 8px', borderRadius: 999, letterSpacing: -0.1,
            whiteSpace: 'nowrap',
          }}>현 위치 · 멘토관</div>
        </div>
      </div>

      {/* Top status bar overlay */}
      <div style={{ position: 'relative', zIndex: 5 }}>
        <MiniStatusBar/>
      </div>

      {/* Floating top controls */}
      <div style={{
        position: 'absolute', top: 60, left: 16, right: 16, zIndex: 6,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <button onClick={() => go('home')} style={{
          ...iconBtn, width: 38, height: 38,
          boxShadow: '0 2px 10px rgba(15,26,46,0.12)',
        }}>
          <Icon name="chev" size={18} color={SC2.ink} stroke={2}/>
        </button>
        <div style={{
          flex: 1, height: 38, borderRadius: 12, background: SC2.card,
          display: 'flex', alignItems: 'center', padding: '0 12px',
          boxShadow: '0 2px 10px rgba(15,26,46,0.12)',
          border: `0.5px solid ${SC2.line}`,
          gap: 8,
        }}>
          <Icon name="search" size={14} color={SC2.ink3}/>
          <span style={{ fontSize: 13, color: SC2.ink, fontWeight: 600, letterSpacing: -0.2 }}>
            유담관 411
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: SC2.ink4 }}>다음 강의</span>
        </div>
      </div>

      {/* Right floating controls */}
      <div style={{
        position: 'absolute', right: 16, top: 130, zIndex: 6,
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {[
          { icon: 'location', tone: SC2.blue },
          { icon: 'plus' },
        ].map((b, i) => (
          <button key={i} style={{
            width: 40, height: 40, borderRadius: 12, border: 0,
            background: SC2.card, color: b.tone || SC2.ink,
            boxShadow: '0 2px 10px rgba(15,26,46,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <Icon name={b.icon} size={18} color={b.tone || SC2.ink}/>
          </button>
        ))}
      </div>

      {/* Bottom sheet */}
      {showSheet && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
          background: SC2.card, borderRadius: '20px 20px 0 0',
          boxShadow: '0 -4px 24px rgba(15,26,46,0.10)',
          paddingBottom: 110, maxHeight: '62%', overflowY: 'auto',
        }}>
          {/* handle */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 4px' }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: SC2.line }}/>
          </div>

          <div style={{ padding: '4px 20px 4px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: SC2.blueSky, letterSpacing: 1.5 }}>
              CAMPUS · A* OPTIMAL
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: SC2.ink, letterSpacing: -0.8 }}>
                {p.time}
              </div>
              <div style={{ fontSize: 13, color: SC2.ink3 }}>· 멘토관 → 유담관 411</div>
            </div>
          </div>

          {/* terrain stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
            gap: 8, padding: '14px 16px',
          }}>
            {[
              { icon: 'stairs',   v: p.stairs, l: '계단' },
              { icon: 'elevator', v: p.elev,   l: '엘리베이터' },
              { icon: 'slope',    v: p.slope,  l: '경사도' },
            ].map((s, i) => (
              <div key={i} style={{
                background: SC2.bg, borderRadius: 12, padding: 10,
                display: 'flex', flexDirection: 'column', gap: 4,
              }}>
                <Icon name={s.icon} size={16} color={SC2.blue}/>
                <div style={{ fontSize: 18, fontWeight: 700, color: SC2.ink, letterSpacing: -0.5 }}>
                  {s.v}
                </div>
                <div style={{ fontSize: 10.5, color: SC2.ink3, fontWeight: 600 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* profile selector */}
          <div style={{ padding: '4px 16px 12px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: SC2.ink3, letterSpacing: 1, marginBottom: 8 }}>
              ROUTE PROFILE
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
              {[
                { id: 'fast', l: '최단', sub: '7분' },
                { id: 'balanced', l: '균형', sub: '9분' },
                { id: 'accessible', l: '무계단', sub: '12분' },
              ].map(o => {
                const sel = profile === o.id;
                return (
                  <button key={o.id} onClick={() => setProfile(o.id)} style={{
                    border: sel ? `1.5px solid ${SC2.blue}` : `1px solid ${SC2.line}`,
                    background: sel ? 'rgba(38,83,156,0.06)' : SC2.card,
                    borderRadius: 12, padding: '10px 4px', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700,
                      color: sel ? SC2.blue : SC2.ink, letterSpacing: -0.2 }}>{o.l}</div>
                    <div style={{ fontSize: 11, color: SC2.ink3 }}>{o.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* turn-by-turn */}
          <div style={{ padding: '0 16px 4px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: SC2.ink3, letterSpacing: 1, marginBottom: 8 }}>
              STEPS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { i: 'arrow',  t: '멘토관 1층 후문으로 나가세요',  m: '0분' },
                { i: 'stairs', t: '계단 18단 하행 (대안: 엘리베이터)', m: '+1분', warn: true },
                { i: 'slope',  t: '향설로를 따라 동쪽으로 직진',     m: '4분' },
                { i: 'check',  t: '유담관 정문 도착',                 m: '8분' },
                { i: 'flag',   t: '4층 411호',                        m: '9분' },
              ].map((s, idx, arr) => (
                <div key={idx} style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  padding: '10px 0',
                  borderBottom: idx === arr.length - 1 ? 'none' : `0.5px solid ${SC2.lineSoft}`,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: s.warn ? 'rgba(199,134,30,0.12)' : 'rgba(38,83,156,0.08)',
                    color: s.warn ? SC2.warn : SC2.blue,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon name={s.i} size={14} color={s.warn ? SC2.warn : SC2.blue}/>
                  </div>
                  <div style={{ flex: 1, fontSize: 13, color: SC2.ink, letterSpacing: -0.2 }}>
                    {s.t}
                  </div>
                  <div style={{ fontSize: 11, color: SC2.ink3, fontWeight: 600 }}>{s.m}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '12px 16px 0' }}>
            <button style={{
              width: '100%', height: 50, border: 0, borderRadius: 14,
              background: SC2.blue, color: '#fff',
              fontSize: 15, fontWeight: 700, letterSpacing: -0.3,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <Icon name="arrow" size={16} color="#fff" stroke={2.4}/>
              안내 시작
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// 6. NOTES — Context Chain memo graph
// ═══════════════════════════════════════════════════════
function ScreenNotes({ go }) {
  const [view, setView] = React.useState('list'); // list | graph

  const notes = [
    { t: '역전파 알고리즘 정리',         course: '인공지능 개론', day: '오늘', tags: ['수식', '미분'], links: 4, weak: true },
    { t: 'Chain Rule 복습',              course: '인공지능 개론', day: '오늘', tags: ['미분'], links: 3 },
    { t: 'B-Tree vs B+Tree',             course: '데이터베이스',  day: '어제', tags: ['인덱스'], links: 2 },
    { t: 'TF-IDF 가중치 직관',           course: '자연어처리',    day: '5/4',  tags: ['벡터', '검색'], links: 5 },
    { t: '다익스트라 vs A*',             course: '알고리즘 분석', day: '5/3',  tags: ['그래프'], links: 6 },
    { t: '정규화 1NF~3NF',               course: '데이터베이스',  day: '5/2',  tags: ['스키마'], links: 2 },
  ];

  return (
    <div style={{ height: '100%', overflow: 'auto', background: SC2.bg, paddingBottom: 110 }}>
      <MiniStatusBar/>

      <div style={{ padding: '8px 20px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, color: SC2.ink3, fontWeight: 600, letterSpacing: 1 }}>
            CONTEXT CHAIN · 47 NOTES
          </div>
          <h1 style={{ margin: '4px 0 0', fontSize: 26, fontWeight: 700, color: SC2.ink, letterSpacing: -0.8 }}>
            <span style={{ fontFamily: SF2.serif, fontStyle: 'italic', color: SC2.blue, marginRight: 2 }}>N</span>
            otes
          </h1>
        </div>
        <button style={{
          width: 38, height: 38, borderRadius: 12, border: 0,
          background: SC2.blue, color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="plus" size={20} color="#fff" stroke={2.4}/>
        </button>
      </div>

      {/* AI summary */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{
          background: `linear-gradient(135deg, ${SC2.purple}, #2D0F4F)`,
          borderRadius: 18, padding: 16, color: '#fff', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Icon name="sparkle" size={14} color="#fff"/>
            <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.5 }}>
              WEEKLY · CONTEXT SUMMARY
            </span>
          </div>
          <div style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.45, letterSpacing: -0.2 }}>
            이번 주 메모 12개에서 <span style={{ background: 'rgba(255,255,255,0.22)', padding: '1px 5px', borderRadius: 3 }}>역전파</span> · <span style={{ background: 'rgba(255,255,255,0.22)', padding: '1px 5px', borderRadius: 3 }}>최적화</span> 주제가 반복적으로 등장했어요.
          </div>
          <div style={{
            display: 'flex', gap: 6, marginTop: 12,
            fontSize: 11, color: 'rgba(255,255,255,0.7)',
          }}>
            <span style={{ flex: 1 }}>이해도 분석 · 5월 5일 자동 생성</span>
            <span style={{ fontWeight: 700, color: '#fff' }}>요약 보기 →</span>
          </div>
        </div>
      </div>

      {/* view toggle */}
      <div style={{
        display: 'flex', gap: 6, padding: '0 16px 14px',
      }}>
        {[{ id: 'list', l: '목록' }, { id: 'graph', l: '관계 그래프' }].map(t => (
          <button key={t.id} onClick={() => setView(t.id)} style={{
            padding: '7px 14px', border: `1px solid ${view === t.id ? SC2.blue : SC2.line}`,
            background: view === t.id ? 'rgba(38,83,156,0.06)' : SC2.card,
            color: view === t.id ? SC2.blue : SC2.ink2,
            borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}>{t.l}</button>
        ))}
      </div>

      {view === 'list' ? (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {notes.map((n, i) => (
            <Card key={i} padding={14}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: SC2.blue, fontWeight: 700, letterSpacing: -0.1 }}>
                      {n.course}
                    </span>
                    <span style={{ width: 3, height: 3, borderRadius: 2, background: SC2.ink4 }}/>
                    <span style={{ fontSize: 11, color: SC2.ink4, fontWeight: 500 }}>{n.day}</span>
                  </div>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: SC2.ink, letterSpacing: -0.2,
                    display: 'flex', alignItems: 'center', gap: 6 }}>
                    {n.t}
                    {n.weak && (
                      <span style={{ fontSize: 9, fontWeight: 800, color: SC2.warn,
                        background: 'rgba(199,134,30,0.12)', padding: '2px 5px', borderRadius: 4,
                        letterSpacing: 0.5 }}>이해 부족</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                    {n.tags.map(t => (
                      <span key={t} style={{
                        fontSize: 10.5, color: SC2.ink3, padding: '2px 7px',
                        borderRadius: 4, background: SC2.cardSubtle, fontWeight: 600,
                      }}>#{t}</span>
                    ))}
                  </div>
                </div>
                <div style={{
                  fontSize: 10.5, color: SC2.ink3, fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 3,
                  background: SC2.cardSubtle, padding: '3px 7px', borderRadius: 6,
                  whiteSpace: 'nowrap',
                }}>
                  <Icon name="link" size={10} color={SC2.ink3}/> {n.links}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div style={{ padding: '0 16px' }}>
          <Card padding={0} style={{ overflow: 'hidden' }}>
            <svg viewBox="0 0 320 380" width="100%" height="380">
              {/* edges */}
              {[
                ['c', 'n1'], ['c', 'n2'], ['c', 'n3'], ['c', 'n4'], ['c', 'n5'], ['c', 'n6'],
                ['n1', 'n2'], ['n1', 'n3'], ['n4', 'n5'], ['n2', 'n6'],
              ].map(([a, b], i) => null)}
              {/* helper coords */}
              {(() => {
                const N = {
                  c:  { x: 160, y: 190, r: 30, l: '역전파', main: true },
                  n1: { x: 70,  y: 100, r: 22, l: 'Chain Rule' },
                  n2: { x: 250, y: 90,  r: 22, l: 'Gradient' },
                  n3: { x: 60,  y: 250, r: 18, l: 'TF-IDF' },
                  n4: { x: 270, y: 250, r: 22, l: '최적화' },
                  n5: { x: 200, y: 320, r: 18, l: 'Adam' },
                  n6: { x: 100, y: 330, r: 16, l: '미분' },
                };
                const edges = [
                  ['c', 'n1', 1], ['c', 'n2', 1], ['c', 'n3', 0.5],
                  ['c', 'n4', 1], ['n4', 'n5', 0.8], ['n1', 'n6', 0.7], ['n1', 'n2', 0.5],
                ];
                return (
                  <>
                    {edges.map(([a, b, w], i) => (
                      <line key={i}
                        x1={N[a].x} y1={N[a].y}
                        x2={N[b].x} y2={N[b].y}
                        stroke={SC2.purple} strokeWidth={w * 1.5} opacity={0.25 + w * 0.3}/>
                    ))}
                    {Object.entries(N).map(([k, n]) => (
                      <g key={k}>
                        <circle cx={n.x} cy={n.y} r={n.r}
                          fill={n.main ? SC2.purple : '#fff'}
                          stroke={n.main ? SC2.purple : SC2.purple}
                          strokeWidth={n.main ? 0 : 1.5}/>
                        <text x={n.x} y={n.y + 3} textAnchor="middle"
                          fontSize={n.main ? 12 : 10}
                          fontWeight={n.main ? 700 : 600}
                          fill={n.main ? '#fff' : SC2.purple}
                          style={{ fontFamily: SF2.sans, letterSpacing: -0.2 }}>{n.l}</text>
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>
            <div style={{ padding: '12px 16px 16px', borderTop: `0.5px solid ${SC2.lineSoft}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: SC2.ink3, letterSpacing: 1, marginBottom: 4 }}>
                FOCUS NODE
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: SC2.ink }}>역전파</div>
              <div style={{ fontSize: 12, color: SC2.ink3, marginTop: 2 }}>
                7개 노드와 연결 · 평균 이해도 0.62
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { ScreenSchedule, ScreenMap, ScreenNotes });
