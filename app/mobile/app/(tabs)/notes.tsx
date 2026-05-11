import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { Card, IconSymbol } from '@/components/ui';
import type { Note } from '@/types';

const { width: SCREEN_W } = Dimensions.get('window');

// ── Mock data ────────────────────────────────────────────────────────────────

const NOTES: Note[] = [
  { id: '1', title: '역전파 알고리즘 정리',   course: '인공지능 개론', createdAt: '오늘',  tags: ['수식', '미분'],    linkedCount: 4, isWeak: true },
  { id: '2', title: 'Chain Rule 복습',         course: '인공지능 개론', createdAt: '오늘',  tags: ['미분'],            linkedCount: 3 },
  { id: '3', title: 'B-Tree vs B+Tree',         course: '데이터베이스',  createdAt: '어제',  tags: ['인덱스'],          linkedCount: 2 },
  { id: '4', title: 'TF-IDF 가중치 직관',      course: '자연어처리',    createdAt: '5/4',   tags: ['벡터', '검색'],    linkedCount: 5 },
  { id: '5', title: '다익스트라 vs A*',         course: '알고리즘 분석', createdAt: '5/3',   tags: ['그래프'],          linkedCount: 6 },
  { id: '6', title: '정규화 1NF~3NF',           course: '데이터베이스',  createdAt: '5/2',   tags: ['스키마'],          linkedCount: 2 },
];

// ── Graph view ───────────────────────────────────────────────────────────────

function GraphView() {
  const nodes = [
    { id: '1', x: 0.5,  y: 0.3,  label: '역전파',    size: 48, color: Colors.warn },
    { id: '2', x: 0.25, y: 0.55, label: 'Chain Rule', size: 38, color: Colors.blue },
    { id: '3', x: 0.75, y: 0.55, label: 'B-Tree',     size: 34, color: Colors.blueSky },
    { id: '4', x: 0.15, y: 0.8,  label: 'TF-IDF',     size: 40, color: Colors.purple },
    { id: '5', x: 0.5,  y: 0.75, label: 'A*',         size: 42, color: Colors.blue },
    { id: '6', x: 0.82, y: 0.8,  label: '정규화',     size: 32, color: Colors.blueSky },
  ];

  const graphW = SCREEN_W - 32;
  const graphH = 260;

  return (
    <View style={{ position: 'relative', width: graphW, height: graphH, marginTop: 12 }}>
      {[[0, 1], [0, 4], [1, 3], [2, 5], [4, 5]].map(([a, b], i) => {
        const na = nodes[a], nb = nodes[b];
        const x1 = na.x * graphW, y1 = na.y * graphH;
        const x2 = nb.x * graphW, y2 = nb.y * graphH;
        const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
        return (
          <View
            key={i}
            style={{
              position: 'absolute', left: x1, top: y1,
              width: len, height: 1,
              backgroundColor: Colors.line,
              transform: [{ rotate: `${angle}deg` }],
            }}
          />
        );
      })}
      {nodes.map((n) => (
        <TouchableOpacity
          key={n.id}
          style={{
            position: 'absolute',
            left: n.x * graphW - n.size / 2,
            top: n.y * graphH - n.size / 2,
            width: n.size, height: n.size,
            borderRadius: n.size / 2,
            backgroundColor: n.color + '18',
            borderWidth: 1.5, borderColor: n.color,
            alignItems: 'center', justifyContent: 'center',
            padding: 4,
          }}
        >
          <Text style={{ fontSize: 8, fontWeight: '700', color: n.color, textAlign: 'center', letterSpacing: -0.2 }} numberOfLines={1}>
            {n.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────────

export default function NotesScreen() {
  const insets = useSafeAreaInsets();
  const [view, setView] = useState<'list' | 'graph'>('list');

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
            CONTEXT CHAIN · 47 NOTES
          </Text>
          <Text className="mt-1 font-bold text-sch-ink" style={{ fontSize: 26, letterSpacing: -0.8 }}>
            Notes
          </Text>
        </View>
        <TouchableOpacity className="w-9.5 h-9.5 rounded-xl bg-sch-blue items-center justify-center"
          style={{ width: 38, height: 38 }}>
          <IconSymbol name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* AI Summary */}
      <View className="px-base mb-5">
        <LinearGradient
          colors={[Colors.purple, '#2D0F4F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 18, padding: 16, overflow: 'hidden' }}
        >
          <View className="flex-row items-center gap-1.5 mb-2">
            <IconSymbol name="sparkle" size={14} color="#fff" />
            <Text className="text-xs font-bold text-white" style={{ letterSpacing: 1.5 }}>
              WEEKLY · CONTEXT SUMMARY
            </Text>
          </View>
          <Text className="text-sm font-semibold text-white" style={{ lineHeight: 21, letterSpacing: -0.2 }}>
            이번 주 메모 12개에서{' '}
            <Text style={{ backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: 3, overflow: 'hidden', paddingHorizontal: 4 }}>역전파</Text>
            {' · '}
            <Text style={{ backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: 3, overflow: 'hidden', paddingHorizontal: 4 }}>최적화</Text>
            {' '}주제가 반복적으로 등장했어요.
          </Text>
          <View className="flex-row justify-between mt-3">
            <Text className="flex-1 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
              이해도 분석 · 5월 5일 자동 생성
            </Text>
            <Text className="text-xs font-bold text-white">요약 보기 →</Text>
          </View>
        </LinearGradient>
      </View>

      {/* View toggle */}
      <View className="flex-row gap-1.5 px-base mb-3.5">
        {[{ id: 'list', l: '목록' }, { id: 'graph', l: '관계 그래프' }].map((t) => (
          <TouchableOpacity
            key={t.id}
            onPress={() => setView(t.id as 'list' | 'graph')}
            className="py-1.5 px-3.5 border border-sch-line bg-sch-card rounded-full"
            style={view === t.id ? { borderColor: Colors.blue, backgroundColor: 'rgba(38,83,156,0.06)' } : undefined}
          >
            <Text
              className="text-xs font-bold"
              style={{ color: view === t.id ? Colors.blue : Colors.ink2 }}
            >
              {t.l}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View className="px-base mb-5">
        {view === 'list' ? (
          <View className="gap-2">
            {NOTES.map((note) => (
              <Card key={note.id} padding={14} onPress={() => {}}>
                <View className="flex-row items-start gap-2.5">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-1.5 mb-1">
                      <Text className="text-xs font-bold text-sch-blue" style={{ letterSpacing: -0.1 }}>
                        {note.course}
                      </Text>
                      <View className="w-0.5 h-0.5 rounded-full bg-sch-ink4" style={{ width: 3, height: 3 }} />
                      <Text className="text-xs text-sch-ink4 font-medium">{note.createdAt}</Text>
                    </View>
                    <View className="flex-row items-center gap-1.5 flex-wrap">
                      <Text className="text-sm font-semibold text-sch-ink" style={{ letterSpacing: -0.2 }}>
                        {note.title}
                      </Text>
                      {note.isWeak && (
                        <View className="py-0.5 px-1 rounded" style={{ backgroundColor: 'rgba(199,134,30,0.12)' }}>
                          <Text className="font-extrabold" style={{ fontSize: 9, color: Colors.warn, letterSpacing: 0.5 }}>
                            이해 부족
                          </Text>
                        </View>
                      )}
                    </View>
                    <View className="flex-row flex-wrap gap-1 mt-2">
                      {note.tags.map((tag) => (
                        <View key={tag} className="bg-sch-card-subtle py-0.5 px-1.5 rounded" style={{ paddingVertical: 2, paddingHorizontal: 7 }}>
                          <Text className="text-sch-ink3 font-semibold" style={{ fontSize: 10.5 }}>#{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View className="flex-row items-center gap-0.5 bg-sch-card-subtle rounded py-0.5 px-1.5"
                    style={{ paddingVertical: 3, paddingHorizontal: 7, borderRadius: 6 }}>
                    <IconSymbol name="link" size={10} color={Colors.ink3} />
                    <Text className="text-sch-ink3 font-semibold" style={{ fontSize: 10.5 }}>{note.linkedCount}</Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        ) : (
          <Card padding={16}>
            <Text className="text-sm font-bold text-sch-ink mb-0.5">관계 그래프</Text>
            <Text className="text-xs text-sch-ink3">노드 크기 = 연결 수 · 색상 = 이해도</Text>
            <GraphView />
          </Card>
        )}
      </View>
    </ScrollView>
  );
}
