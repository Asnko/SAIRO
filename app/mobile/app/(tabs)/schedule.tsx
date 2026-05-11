import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { Card, Tag, SectionHeader } from '@/components/ui';
import type { Course, AcademicEvent } from '@/types';

const { width: SCREEN_W } = Dimensions.get('window');

// ── Mock data ────────────────────────────────────────────────────────────────

const COURSES: Course[] = [
  { id: '1',  name: '선형대수',       room: '향설관 304', professor: '이교수', day: 0, startHour: 9,    duration: 1.25, tone: 'blue',   type: '전공필수' },
  { id: '2',  name: '데이터구조',     room: '유담관 215', professor: '김교수', day: 0, startHour: 13,   duration: 1.25, tone: 'sky',    type: '전공선택' },
  { id: '3',  name: '알고리즘 분석',  room: '멘토관 412', professor: '박교수', day: 1, startHour: 10.5, duration: 1.25, tone: 'purple', type: '전공필수' },
  { id: '4',  name: '자료구조 실습',  room: '유담관 311', professor: '최교수', day: 1, startHour: 14,   duration: 1.25, tone: 'sky',    type: '전공선택' },
  { id: '5',  name: '인공지능 개론',  room: '멘토관 503', professor: '박지민', day: 2, startHour: 10.5, duration: 1.25, tone: 'sky',    type: '전공필수', isLive: true },
  { id: '6',  name: '데이터베이스',   room: '유담관 411', professor: '정교수', day: 2, startHour: 13,   duration: 1.25, tone: 'blue',   type: '전공선택' },
  { id: '7',  name: '선형대수',       room: '향설관 304', professor: '이교수', day: 3, startHour: 9,    duration: 1.25, tone: 'blue',   type: '전공필수' },
  { id: '8',  name: '확률통계',       room: '향설관 209', professor: '한교수', day: 3, startHour: 15,   duration: 1.25, tone: 'gold',   type: '교양필수' },
  { id: '9',  name: '알고리즘 분석',  room: '멘토관 412', professor: '박교수', day: 4, startHour: 10.5, duration: 1.25, tone: 'purple', type: '전공필수' },
  { id: '10', name: '캡스톤 디자인',  room: 'IT관 102',   professor: '오교수', day: 4, startHour: 13,   duration: 2.5,  tone: 'gold',   type: '전공필수' },
];

const ACADEMIC_EVENTS: AcademicEvent[] = [
  { id: '1', date: '5/12', tag: '학사',  tone: 'blue',   title: '복수전공 신청 시작',       subtitle: '평점 3.0 이상 신청 가능' },
  { id: '2', date: '5/15', tag: '장학',  tone: 'gold',   title: '성적우수장학금 신청 마감', subtitle: '포털 → 장학 → 신청' },
  { id: '3', date: '5/22', tag: '행사',  tone: 'purple', title: '향림학술제 개막',          subtitle: '본관광장 · 18:00' },
  { id: '4', date: '6/15', tag: '시험',  tone: 'warn',   title: '기말고사 시작',            subtitle: '수강 5과목 · 평균 부담도 중상' },
];

const DAYS = ['월', '화', '수', '목', '금'];
const DATES = [4, 5, 6, 7, 8];
const TODAY_IDX = 2;
const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17];
const ROW_H = 56;
const TIME_COL_W = 32;

const TONE_PALETTE = {
  blue:   { bg: 'rgba(38,83,156,0.10)',  bar: Colors.blue,    fg: Colors.blue },
  sky:    { bg: 'rgba(28,154,214,0.12)', bar: Colors.blueSky, fg: '#0E6FA8' },
  purple: { bg: 'rgba(77,32,122,0.10)',  bar: Colors.purple,  fg: Colors.purple },
  gold:   { bg: 'rgba(157,126,63,0.12)', bar: Colors.gold,    fg: Colors.gold },
};

// ── Sub-components ───────────────────────────────────────────────────────────

function WeekView() {
  const dayColW = (SCREEN_W - 32 - TIME_COL_W - 12) / 5;

  return (
    <View
      className="bg-sch-card rounded-xl overflow-hidden p-2"
      style={{ borderWidth: 0.5, borderColor: Colors.line }}
    >
      <View className="flex-row">
        {/* Time labels */}
        <View style={{ width: TIME_COL_W }}>
          {HOURS.map((h) => (
            <View key={h} style={{ height: ROW_H, justifyContent: 'flex-start', paddingTop: 2 }}>
              <Text
                className="text-sch-ink4 font-semibold text-right pr-1.5"
                style={{ fontSize: 9.5 }}
              >
                {h}:00
              </Text>
            </View>
          ))}
        </View>

        {/* Day columns */}
        {DAYS.map((_, di) => (
          <View
            key={di}
            style={[
              { width: dayColW, position: 'relative', flex: 1 },
              di > 0 && { borderLeftWidth: 0.5, borderLeftColor: Colors.lineSoft },
            ]}
          >
            {HOURS.map((h, hi) => (
              <View
                key={h}
                style={[
                  { height: ROW_H },
                  hi > 0 && { borderTopWidth: 0.5, borderTopColor: Colors.lineSoft, borderStyle: 'dashed' },
                ]}
              />
            ))}

            {di === TODAY_IDX && (
              <View
                style={{
                  position: 'absolute', left: 0, right: 0,
                  top: (10.83 - 9) * ROW_H, height: 2,
                  backgroundColor: Colors.danger, zIndex: 4,
                }}
              >
                <View style={{
                  position: 'absolute', left: -3, top: -3,
                  width: 8, height: 8, borderRadius: 4,
                  backgroundColor: Colors.danger,
                }} />
              </View>
            )}

            {COURSES.filter((c) => c.day === di).map((c) => {
              const t = TONE_PALETTE[c.tone];
              return (
                <View
                  key={c.id}
                  style={{
                    position: 'absolute',
                    left: 3, right: 3,
                    top: (c.startHour - 9) * ROW_H + 1,
                    height: c.duration * ROW_H - 2,
                    backgroundColor: t.bg,
                    borderLeftWidth: 2.5,
                    borderLeftColor: t.bar,
                    borderRadius: 6,
                    padding: 4,
                    overflow: 'hidden',
                    ...(c.isLive && { borderWidth: 1.5, borderColor: Colors.blueSky }),
                  }}
                >
                  <Text style={{ fontSize: 9, fontWeight: '700', color: t.fg, letterSpacing: -0.2, lineHeight: 12 }} numberOfLines={2}>
                    {c.name}
                  </Text>
                  <Text style={{ fontSize: 8, color: Colors.ink3, marginTop: 2, letterSpacing: -0.1 }} numberOfLines={1}>
                    {c.room}
                  </Text>
                  {c.isLive && (
                    <View style={{
                      position: 'absolute', top: 4, right: 4,
                      width: 6, height: 6, borderRadius: 3,
                      backgroundColor: Colors.blueSky,
                    }} />
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

function ListView() {
  const todayCourses = COURSES.filter((c) => c.day === TODAY_IDX);

  return (
    <View className="gap-2">
      {todayCourses.map((c) => {
        const t = TONE_PALETTE[c.tone];
        const startH = Math.floor(c.startHour);
        const startM = c.startHour % 1 ? '30' : '00';
        return (
          <Card key={c.id} padding={0}>
            <View className="flex-row">
              <View style={{ width: 6, backgroundColor: t.bar, borderTopLeftRadius: 18, borderBottomLeftRadius: 18 }} />
              <View className="flex-1 p-3.5">
                <Text style={{ fontSize: 12, color: t.fg, fontWeight: '700' }}>{startH}:{startM}</Text>
                <Text className="text-base font-bold text-sch-ink mt-0.5">{c.name}</Text>
                <Text className="text-xs text-sch-ink3 mt-0.5">{c.room}</Text>
              </View>
            </View>
          </Card>
        );
      })}
    </View>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────────

export default function ScheduleScreen() {
  const insets = useSafeAreaInsets();
  const [view, setView] = useState<'week' | 'list'>('week');

  return (
    <ScrollView
      className="flex-1 bg-sch-bg"
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-lg pb-3.5"
        style={{ paddingTop: insets.top + 8 }}
      >
        <View>
          <Text className="text-xs text-sch-ink3 font-semibold" style={{ letterSpacing: 1 }}>
            2026 SPRING · WEEK 10
          </Text>
          <Text className="mt-1 font-bold text-sch-ink" style={{ fontSize: 26, letterSpacing: -0.8 }}>
            Schedule
          </Text>
        </View>
        <View className="flex-row p-0.5 bg-sch-card-subtle rounded-xl">
          {[{ id: 'week', l: '주' }, { id: 'list', l: '목록' }].map((t) => (
            <TouchableOpacity
              key={t.id}
              onPress={() => setView(t.id as 'week' | 'list')}
              className="py-1.5 px-3.5 rounded-lg"
              style={view === t.id ? {
                backgroundColor: Colors.card,
                shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08, shadowRadius: 2, elevation: 1,
              } : undefined}
            >
              <Text
                className="text-xs font-bold"
                style={{ color: view === t.id ? Colors.ink : Colors.ink3 }}
              >
                {t.l}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Date strip */}
      <View className="flex-row px-base pb-3.5 gap-1 items-center">
        <View style={{ width: TIME_COL_W }} />
        {DAYS.map((d, i) => (
          <View
            key={d}
            className="flex-1 items-center py-1.5 rounded-xl"
            style={i === TODAY_IDX ? { backgroundColor: Colors.blue } : undefined}
          >
            <Text
              className="text-xs font-semibold"
              style={{ letterSpacing: 0.5, color: i === TODAY_IDX ? 'rgba(255,255,255,0.9)' : Colors.ink3 }}
            >
              {d}
            </Text>
            <Text
              className="font-bold mt-0.5"
              style={{ fontSize: 17, color: i === TODAY_IDX ? '#fff' : Colors.ink }}
            >
              {DATES[i]}
            </Text>
          </View>
        ))}
      </View>

      {/* Timetable / List */}
      <View className="px-base">
        {view === 'week' ? <WeekView /> : <ListView />}
      </View>

      {/* Academic events */}
      <View className="mt-2">
        <SectionHeader title="Academic" action="더보기" />
        <View className="px-base gap-2">
          {ACADEMIC_EVENTS.map((e) => (
            <Card key={e.id} padding={12}>
              <View className="flex-row items-center gap-3">
                <View className="w-12 items-center">
                  <Text className="font-bold text-sch-blue" style={{ fontSize: 18, lineHeight: 22 }}>
                    {e.date}
                  </Text>
                </View>
                <View className="w-px h-8 bg-sch-line-soft" />
                <View className="flex-1">
                  <Tag tone={e.tone}>{e.tag}</Tag>
                  <Text className="text-sm font-semibold text-sch-ink mt-0.5" style={{ letterSpacing: -0.2 }}>
                    {e.title}
                  </Text>
                  <Text className="text-xs text-sch-ink3 mt-0.5">{e.subtitle}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
