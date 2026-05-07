// SCH Campus AI — Screens part 1: Onboarding, Home, Chat (RAG)

const SC = window.SCH.color;
const SF = window.SCH.font;

// ═══════════════════════════════════════════════════════
// 1. ONBOARDING
// ═══════════════════════════════════════════════════════
function ScreenOnboarding({ onDone, aiTone }) {
  const [step, setStep] = React.useState(0);
  const [id, setId] = React.useState('20221234');
  const [pw, setPw] = React.useState('');

  const slides = [
    {
      title: '캠퍼스 라이프를\n초밀착으로.',
      sub: '전공·시간표·학습 데이터·캠퍼스 지형까지\n하나의 흐름으로 연결합니다.',
      art: 'pulse',
    },
    {
      title: '능동형 AI 비서.',
      sub: '묻기 전에 먼저 안내합니다.\nSCH-AI가 다음 강의·이동·과제를 미리 짚어드립니다.',
      art: 'orbit',
    },
    {
      title: '학번으로 시작',
      sub: '순천향대학교 통합인증으로 로그인합니다.',
      art: 'login',
    },
  ];
  const s = slides[step];
  const last = step === slides.length - 1;

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: `linear-gradient(180deg, ${SC.blueDeep} 0%, ${SC.blue} 50%, #2D5FB0 100%)`,
      display: 'flex', flexDirection: 'column',
      color: '#fff', fontFamily: SF.sans, overflow: 'hidden',
    }}>
      {/* decorative grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.08,
        backgroundImage: `linear-gradient(${SC.blueLight} 1px, transparent 1px), linear-gradient(90deg, ${SC.blueLight} 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
      }}/>
      <MiniStatusBar dark/>

      {/* art area */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', minHeight: 240,
      }}>
        {s.art === 'pulse' && (
          <div style={{ position: 'relative', width: 220, height: 220 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{
                position: 'absolute', inset: i * 22, borderRadius: '50%',
                border: `1px solid ${SC.blueLight}`, opacity: 0.3 + i * 0.1,
              }}/>
            ))}
            <div style={{
              position: 'absolute', inset: 80, borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, ${SC.blueLight}, ${SC.blue})`,
              boxShadow: `0 0 40px ${SC.blueLight}`,
            }}/>
          </div>
        )}
        {s.art === 'orbit' && (
          <div style={{ position: 'relative', width: 240, height: 240 }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 200, height: 100, transform: 'translate(-50%, -50%) rotate(-20deg)',
              border: `1px solid ${SC.blueLight}`, borderRadius: '50%', opacity: 0.5,
            }}/>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 200, height: 100, transform: 'translate(-50%, -50%) rotate(40deg)',
              border: `1px solid ${SC.blueLight}`, borderRadius: '50%', opacity: 0.5,
            }}/>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 80, height: 80, transform: 'translate(-50%,-50%)',
              borderRadius: '50%', background: '#fff', color: SC.blue,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 22, letterSpacing: -0.5,
            }}>AI</div>
            {[
              { t: '12%', l: '8%' },
              { t: '70%', l: '88%' },
              { t: '85%', l: '20%' },
            ].map((p, i) => (
              <div key={i} style={{
                position: 'absolute', top: p.t, left: p.l,
                width: 14, height: 14, borderRadius: '50%',
                background: SC.blueLight, transform: 'translate(-50%,-50%)',
                boxShadow: `0 0 16px ${SC.blueLight}`,
              }}/>
            ))}
          </div>
        )}
        {s.art === 'login' && (
          <div style={{ width: 200, height: 200, position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: 0,
              border: `2px solid ${SC.blueLight}`, borderRadius: 24, opacity: 0.4,
              transform: 'rotate(-6deg)',
            }}/>
            <div style={{
              position: 'absolute', inset: 12,
              background: '#fff', color: SC.blue, borderRadius: 20,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 12, padding: 20,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: SC.ink3 }}>STUDENT ID</div>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1 }}>2026·1234</div>
              <div style={{ fontSize: 11, color: SC.ink3 }}>SOON CHUN HYANG UNIV.</div>
            </div>
          </div>
        )}
      </div>

      {/* text + form */}
      <div style={{ padding: '0 28px 28px' }}>
        <div style={{
          fontFamily: SF.serif, fontStyle: 'italic', fontSize: 14,
          color: SC.blueLight, marginBottom: 8, letterSpacing: 1,
        }}>{['Welcome', 'Proactive', 'Begin'][step]}</div>
        <h1 style={{
          margin: 0, fontSize: 32, fontWeight: 700, lineHeight: 1.15,
          letterSpacing: -1, whiteSpace: 'pre-line',
        }}>{s.title}</h1>
        <p style={{
          marginTop: 14, marginBottom: 22, fontSize: 14, lineHeight: 1.55,
          color: 'rgba(255,255,255,0.7)', whiteSpace: 'pre-line', letterSpacing: -0.2,
        }}>{s.sub}</p>

        {last && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            <input value={id} onChange={e => setId(e.target.value)} placeholder="학번" style={inputDark}/>
            <input value={pw} onChange={e => setPw(e.target.value)} type="password" placeholder="비밀번호" style={inputDark}/>
          </div>
        )}

        {/* dots */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {slides.map((_, i) => (
            <div key={i} style={{
              height: 4, borderRadius: 2,
              flex: i === step ? 3 : 1,
              background: i === step ? '#fff' : 'rgba(255,255,255,0.3)',
              transition: 'all 0.3s',
            }}/>
          ))}
        </div>

        <button
          onClick={() => last ? onDone() : setStep(step + 1)}
          style={{
            width: '100%', height: 54, border: 0, borderRadius: 14,
            background: '#fff', color: SC.blue,
            fontFamily: SF.sans, fontSize: 16, fontWeight: 700,
            letterSpacing: -0.3, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {last ? '로그인하고 시작하기' : '다음'}
          <Icon name="arrow" size={18} color={SC.blue}/>
        </button>

        {!last && (
          <button onClick={onDone} style={{
            width: '100%', marginTop: 10, height: 38, border: 0,
            background: 'transparent', color: 'rgba(255,255,255,0.6)',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}>건너뛰기</button>
        )}
      </div>
    </div>
  );
}

const inputDark = {
  height: 50, borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)',
  background: 'rgba(255,255,255,0.1)', color: '#fff',
  padding: '0 16px', fontSize: 15, outline: 'none',
  fontFamily: SF.sans, letterSpacing: -0.2,
};

// ═══════════════════════════════════════════════════════
// 2. HOME — Proactive AI briefing
// ═══════════════════════════════════════════════════════
function ScreenHome({ go, aiTone }) {
  const greeting = aiTone === 'casual'
    ? '재훈아, 오늘 하루 미리 정리했어 ✦'
    : '재훈 학생, 오늘의 브리핑입니다.';
  const aiSubtext = aiTone === 'casual'
    ? '비 와서 멘토관 가는 길 좀 미끄러울 듯. 5분만 일찍 나가자.'
    : '강수 예보로 인해 멘토관 외부 동선의 마찰이 증가합니다. 평소 대비 +5분의 이동 여유를 권장합니다.';

  return (
    <div style={{
      height: '100%', overflow: 'auto', background: SC.bg,
      paddingBottom: 110,
    }}>
      <MiniStatusBar/>

      {/* Header */}
      <div style={{ padding: '8px 20px 20px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, color: SC.ink3, fontWeight: 600, letterSpacing: 0.5 }}>
            {new Date(2026, 4, 6).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' }).toUpperCase()}
          </div>
          <h1 style={{
            margin: '4px 0 0', fontSize: 26, fontWeight: 700,
            color: SC.ink, letterSpacing: -0.8,
          }}>안녕하세요,<br/>김재훈 <span style={{ color: SC.ink3, fontWeight: 500 }}>학생</span></h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={iconBtn}><Icon name="bell" size={20} color={SC.ink}/></button>
          <button style={iconBtn}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: `linear-gradient(135deg, ${SC.blueSky}, ${SC.blue})`,
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700,
            }}>JH</div>
          </button>
        </div>
      </div>

      {/* HERO — AI proactive card */}
      <div style={{ padding: '0 16px 16px' }}>
        <div onClick={() => go('chat')} style={{
          background: `linear-gradient(135deg, ${SC.blueDeep}, ${SC.blue} 60%, ${SC.purple})`,
          borderRadius: 22, padding: 20, color: '#fff',
          position: 'relative', overflow: 'hidden', cursor: 'pointer',
        }}>
          {/* decorative orb */}
          <div style={{
            position: 'absolute', right: -40, top: -40,
            width: 180, height: 180, borderRadius: '50%',
            background: `radial-gradient(circle, ${SC.blueLight}33, transparent 70%)`,
          }}/>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6,
              background: 'rgba(255,255,255,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="sparkle" size={14} color="#fff"/>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>SCH·AI BRIEFING</span>
          </div>

          <div style={{
            fontSize: 19, fontWeight: 700, lineHeight: 1.35, letterSpacing: -0.4,
            marginBottom: 8,
          }}>{greeting}</div>
          <p style={{
            margin: 0, fontSize: 13.5, lineHeight: 1.55,
            color: 'rgba(255,255,255,0.85)', letterSpacing: -0.2,
          }}>{aiSubtext}</p>

          {/* signal pills */}
          <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
            {['☂️ 강수 70%', '🚶 +5분', '📍 멘토관 → 유담관'].map(t => (
              <span key={t} style={{
                fontSize: 11, fontWeight: 600,
                padding: '5px 9px', borderRadius: 999,
                background: 'rgba(255,255,255,0.15)', color: '#fff',
                backdropFilter: 'blur(8px)',
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        gap: 8, padding: '0 16px 22px',
      }}>
        {[
          { id: 'chat',  label: 'AI 상담', icon: 'chat', go: 'chat' },
          { id: 'map',   label: '경로',    icon: 'location', go: 'map' },
          { id: 'sched', label: '시간표', icon: 'cal', go: 'sched' },
          { id: 'note',  label: '메모',   icon: 'note', go: 'note' },
        ].map(a => (
          <button key={a.id} onClick={() => go(a.go)} style={{
            border: `0.5px solid ${SC.line}`, background: SC.card,
            borderRadius: 16, padding: '14px 6px',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 6, cursor: 'pointer',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(38,83,156,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name={a.icon} size={20} color={SC.blue}/>
            </div>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: SC.ink, letterSpacing: -0.2 }}>
              {a.label}
            </span>
          </button>
        ))}
      </div>

      {/* NEXT UP */}
      <SectionHeader title="Next" action="시간표 전체"/>
      <div style={{ padding: '0 16px 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Card padding={0}>
          <div style={{ display: 'flex' }}>
            <div style={{
              width: 6, background: SC.blueSky, borderRadius: '18px 0 0 18px',
            }}/>
            <div style={{ flex: 1, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <Tag tone="sky">전공필수 · 진행중</Tag>
                <span style={{ fontSize: 12, fontWeight: 600, color: SC.blueSky }}>10:30 → 11:45</span>
              </div>
              <div style={{ fontSize: 15.5, fontWeight: 700, color: SC.ink, letterSpacing: -0.3 }}>
                인공지능 개론
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 12, color: SC.ink3 }}>
                <Icon name="location" size={12} color={SC.ink3}/> 멘토관 503 · 박지민 교수
              </div>
            </div>
          </div>
        </Card>
        <Card padding={14}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <Tag tone="neutral">전공선택 · 다음</Tag>
            <span style={{ fontSize: 12, fontWeight: 600, color: SC.ink3 }}>13:00 → 14:15</span>
          </div>
          <div style={{ fontSize: 15.5, fontWeight: 700, color: SC.ink, letterSpacing: -0.3 }}>
            데이터베이스 시스템
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 12, color: SC.ink3 }}>
            <Icon name="location" size={12} color={SC.ink3}/> 유담관 411 · 도보 8분 (계단 36)
          </div>
        </Card>
      </div>

      {/* NOTICES */}
      <SectionHeader title="Notice" action="모두 보기"/>
      <div style={{ padding: '0 16px 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { tag: '장학', tone: 'gold', date: '5월 6일', title: '2026-1 성적우수장학금 신청 (~5/15)', sum: '직전 학기 평점 3.8 이상 대상. 포털에서 신청서 제출.' },
          { tag: '학사', tone: 'blue', date: '5월 5일', title: '수강신청 정정기간 안내', sum: '5월 11일 09:00 부터 5월 13일 18:00 까지' },
          { tag: '행사', tone: 'purple', date: '5월 4일', title: '향(向)림 학술제 부스 참가 모집', sum: 'IT융합대 학생회 주관, 5/22-23' },
        ].map((n, i) => (
          <Card key={i} padding={14}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <Tag tone={n.tone}>{n.tag}</Tag>
                <span style={{ fontSize: 11, color: SC.ink4, fontWeight: 500 }}>{n.date}</span>
              </div>
              <Icon name="chev" size={14} color={SC.ink4}/>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: SC.ink, letterSpacing: -0.2 }}>{n.title}</div>
            <div style={{ fontSize: 12, color: SC.ink3, marginTop: 3, lineHeight: 1.45 }}>{n.sum}</div>
          </Card>
        ))}
      </div>

      {/* CONTEXT INSIGHT */}
      <SectionHeader title="Insight"/>
      <div style={{ padding: '0 16px' }}>
        <Card padding={16}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Icon name="graph" size={16} color={SC.purple}/>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: SC.purple }}>
              CONTEXT CHAIN
            </span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: SC.ink, letterSpacing: -0.2, marginBottom: 8 }}>
            지난 주 메모 12개에서 <span style={{ color: SC.purple }}>'역전파'</span> 이해도가 낮아요.
          </div>
          <div style={{ fontSize: 12, color: SC.ink3, lineHeight: 1.5, marginBottom: 12 }}>
            관련 강의 자료 3개와 작성하신 메모 5개를 묶어 복습 카드로 정리했습니다.
          </div>
          <button style={{
            border: `1px solid ${SC.purple}33`, background: 'rgba(77,32,122,0.06)',
            color: SC.purple, padding: '8px 14px', borderRadius: 10,
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}>복습 카드 열기 →</button>
        </Card>
      </div>
    </div>
  );
}

const iconBtn = {
  width: 38, height: 38, borderRadius: 12,
  border: `0.5px solid ${SC.line}`, background: SC.card,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
};

// ═══════════════════════════════════════════════════════
// 3. CHAT — RAG-grounded SCH-AI assistant
// ═══════════════════════════════════════════════════════
function ScreenChat({ go, aiTone }) {
  const initialBot = aiTone === 'casual'
    ? '안녕! 뭐 궁금한 거 있어? 학사·장학·시간표 다 물어봐도 돼 :)'
    : '안녕하세요. SCH-AI입니다. 학사 규정과 공지를 근거로 답변드립니다.';

  const [messages, setMessages] = React.useState([
    { who: 'bot', text: initialBot },
    { who: 'me', text: '복수전공 신청은 언제까지인가요?' },
    {
      who: 'bot',
      text: '2026학년도 1학기 복수전공 신청은 5월 12일 09시 ~ 5월 16일 18시까지 가능합니다.',
      cites: [
        { tag: '학사규정', title: '2026학년도 학사력 §3.2' },
        { tag: '공지', title: '복수·부전공 신청 안내 (4/29)' },
      ],
    },
    { who: 'me', text: '제 평점으로 가능한 전공이 뭐가 있나요?' },
    {
      who: 'bot', typing: true,
      text: '학생의 직전 학기 평점 3.62 기준으로 신청 가능한 학과를 정리하고 있어요…',
    },
  ]);
  const [draft, setDraft] = React.useState('');
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = () => {
    if (!draft.trim()) return;
    setMessages(m => [...m, { who: 'me', text: draft }, {
      who: 'bot',
      text: '관련 학사 자료 4건을 참고하여 정리해드릴게요. 평점 3.62 기준, 다음 학과가 신청 가능합니다: AI빅데이터학과, 산업경영공학과, 미디어커뮤니케이션학과.',
      cites: [{ tag: '내신가능학과', title: '복수전공 가능학과 매트릭스 2026-1' }],
    }]);
    setDraft('');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: SC.bg }}>
      <MiniStatusBar/>

      {/* Top */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 16px 12px', borderBottom: `0.5px solid ${SC.line}`,
        background: SC.card,
      }}>
        <button onClick={() => go('home')} style={{ ...iconBtn, width: 34, height: 34, transform: 'rotate(180deg)' }}>
          <Icon name="chev" size={18} color={SC.ink} stroke={2}/>
          <span style={{ display: 'none' }}>back</span>
        </button>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `linear-gradient(135deg, ${SC.blue}, ${SC.purple})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="sparkle" size={18} color="#fff"/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: SC.ink, letterSpacing: -0.3 }}>SCH-AI</div>
          <div style={{ fontSize: 11, color: SC.success, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: SC.success }}/>
            RAG · 학사규정 v2026.1
          </div>
        </div>
        <button style={iconBtn}><Icon name="settings" size={18} color={SC.ink2}/></button>
      </div>

      {/* Suggested chips */}
      <div style={{
        display: 'flex', gap: 8, padding: '12px 16px 6px', overflowX: 'auto',
        background: SC.card,
      }}>
        {['수강신청 정정', '졸업요건 확인', '도서관 좌석', '시험 일정', '장학금 종류'].map(c => (
          <button key={c} style={{
            border: `1px solid ${SC.line}`, background: SC.bg,
            padding: '7px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
            color: SC.ink2, whiteSpace: 'nowrap', cursor: 'pointer',
          }}>{c}</button>
        ))}
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{
        flex: 1, overflowY: 'auto', padding: '16px 16px 8px',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        {messages.map((m, i) => (
          <ChatBubble key={i} m={m}/>
        ))}
      </div>

      {/* Composer */}
      <div style={{
        padding: '8px 12px 28px', borderTop: `0.5px solid ${SC.line}`,
        background: SC.card,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <button style={iconBtn}><Icon name="plus" size={20} color={SC.ink2}/></button>
        <div style={{
          flex: 1, height: 42, borderRadius: 21,
          background: SC.bg, display: 'flex', alignItems: 'center',
          padding: '0 6px 0 16px', border: `0.5px solid ${SC.line}`,
        }}>
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="SCH-AI에게 물어보기"
            style={{
              flex: 1, border: 0, background: 'transparent', outline: 'none',
              fontFamily: SF.sans, fontSize: 14, color: SC.ink, letterSpacing: -0.2,
            }}/>
          <button onClick={send} style={{
            width: 32, height: 32, borderRadius: 16, border: 0,
            background: draft.trim() ? SC.blue : SC.cardSubtle,
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="arrow" size={16} color={draft.trim() ? '#fff' : SC.ink4} stroke={2.4}/>
          </button>
        </div>
        <button style={iconBtn}><Icon name="mic" size={20} color={SC.ink2}/></button>
      </div>
    </div>
  );
}

function ChatBubble({ m }) {
  if (m.who === 'me') {
    return (
      <div style={{ alignSelf: 'flex-end', maxWidth: '78%' }}>
        <div style={{
          background: SC.blue, color: '#fff',
          padding: '10px 14px', borderRadius: '18px 18px 4px 18px',
          fontSize: 14, lineHeight: 1.45, letterSpacing: -0.2,
        }}>{m.text}</div>
      </div>
    );
  }
  return (
    <div style={{ alignSelf: 'flex-start', maxWidth: '88%' }}>
      <div style={{
        background: SC.card, color: SC.ink, border: `0.5px solid ${SC.line}`,
        padding: '12px 14px', borderRadius: '18px 18px 18px 4px',
        fontSize: 14, lineHeight: 1.5, letterSpacing: -0.2,
      }}>
        {m.text}
        {m.typing && <TypingDots/>}
        {m.cites && (
          <div style={{
            marginTop: 10, paddingTop: 10, borderTop: `0.5px solid ${SC.lineSoft}`,
            display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: SC.ink4 }}>
              SOURCES
            </div>
            {m.cites.map((c, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 11.5, color: SC.ink2,
              }}>
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: '2px 6px',
                  borderRadius: 4, background: 'rgba(38,83,156,0.08)', color: SC.blue,
                }}>{c.tag}</span>
                <span style={{ flex: 1, letterSpacing: -0.1 }}>{c.title}</span>
                <Icon name="link" size={11} color={SC.ink4}/>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: 'inline-flex', gap: 4, marginLeft: 6, alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 5, height: 5, borderRadius: 3, background: SC.ink4,
          animation: `bounce 1.2s ${i * 0.15}s infinite ease-in-out`,
        }}/>
      ))}
      <style>{`@keyframes bounce { 0%,80%,100% { transform: translateY(0); opacity: 0.4 } 40% { transform: translateY(-3px); opacity: 1 } }`}</style>
    </div>
  );
}

Object.assign(window, { ScreenOnboarding, ScreenHome, ScreenChat });
