import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Defs, Pattern, Path, Rect, Circle,
  Text as SvgText, RadialGradient, Stop,
} from 'react-native-svg';
import { Colors } from '@/constants';
import { IconSymbol } from '@/components/ui';
import type { RouteProfile, RouteInfo } from '@/types';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// ── Route data ───────────────────────────────────────────────────────────────

const ROUTES: Record<RouteProfile, RouteInfo> = {
  fast: {
    profile: 'fast', duration: '7분', stairs: 42, elevators: 0, slope: '↑8%', label: '최단',
    steps: [
      { icon: 'arrow',  description: '멘토관 1층 후문으로 나가세요',   time: '0분' },
      { icon: 'stairs', description: '계단 42단 하행',                  time: '+1분', isWarning: true },
      { icon: 'slope',  description: '향설로를 따라 동쪽으로 직진',     time: '4분' },
      { icon: 'check',  description: '유담관 정문 도착',                 time: '6분' },
      { icon: 'flag',   description: '4층 411호',                        time: '7분' },
    ],
  },
  balanced: {
    profile: 'balanced', duration: '9분', stairs: 18, elevators: 1, slope: '↑3%', label: '균형',
    steps: [
      { icon: 'arrow',    description: '멘토관 1층 후문으로 나가세요',          time: '0분' },
      { icon: 'stairs',   description: '계단 18단 하행 (대안: 엘리베이터)',     time: '+1분', isWarning: true },
      { icon: 'slope',    description: '향설로를 따라 동쪽으로 직진',           time: '4분' },
      { icon: 'check',    description: '유담관 정문 도착',                       time: '8분' },
      { icon: 'flag',     description: '4층 411호',                              time: '9분' },
    ],
  },
  accessible: {
    profile: 'accessible', duration: '12분', stairs: 0, elevators: 3, slope: '↑1%', label: '무계단',
    steps: [
      { icon: 'elevator', description: '멘토관 엘리베이터 1층으로 이동', time: '0분' },
      { icon: 'slope',    description: '완만한 경사로 이용',              time: '3분' },
      { icon: 'elevator', description: '유담관 엘리베이터 탑승',          time: '9분' },
      { icon: 'flag',     description: '4층 411호',                       time: '12분' },
    ],
  },
};

// ── Campus SVG Map ───────────────────────────────────────────────────────────

function CampusMap() {
  const mapW = SCREEN_W;
  const mapH = SCREEN_H * 0.45;

  return (
    <Svg width={mapW} height={mapH} viewBox="0 0 380 480">
      <Defs>
        <Pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <Path d="M32 0H0V32" fill="none" stroke="#CFD9E6" strokeWidth="0.5" />
        </Pattern>
        <RadialGradient id="hill1" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#D5DFEB" />
          <Stop offset="100%" stopColor="#E8EFF6" />
        </RadialGradient>
      </Defs>
      <Rect width="380" height="480" fill="#E8EFF6" />
      <Rect width="380" height="480" fill="url(#grid)" />
      <Circle cx="90"  cy="180" r="70" fill="none" stroke="#9FB3CC" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
      <Circle cx="90"  cy="180" r="48" fill="none" stroke="#9FB3CC" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
      <Circle cx="90"  cy="180" r="28" fill="none" stroke="#9FB3CC" strokeWidth="1" strokeDasharray="3 3" opacity="0.9" />
      <Circle cx="290" cy="360" r="75" fill="none" stroke="#9FB3CC" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
      <Circle cx="290" cy="360" r="50" fill="none" stroke="#9FB3CC" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      <Circle cx="290" cy="360" r="25" fill="none" stroke="#9FB3CC" strokeWidth="1" strokeDasharray="3 3" opacity="0.85" />
      <Path d="M-10 260 Q 100 240 200 270 T 400 290" stroke="#fff" strokeWidth="14" fill="none" />
      <Path d="M180 -10 Q 200 130 220 270 T 260 500" stroke="#fff" strokeWidth="11" fill="none" />
      <Rect x="60"  y="140" width="60" height="38" rx="3" fill="#F0F2F7" stroke="#B6C2D2" strokeWidth="0.6" />
      <SvgText x="90"  y="163" textAnchor="middle" fontSize="9" fontWeight="600" fill="#6B7587">향설관</SvgText>
      <Rect x="150" y="170" width="70" height="30" rx="3" fill="#F0F2F7" stroke="#B6C2D2" strokeWidth="0.6" />
      <SvgText x="185" y="189" textAnchor="middle" fontSize="9" fontWeight="600" fill="#6B7587">본관</SvgText>
      <Rect x="70"  y="220" width="50" height="50" rx="3" fill="#fff" stroke={Colors.blue} strokeWidth="1.5" />
      <SvgText x="95"  y="249" textAnchor="middle" fontSize="9" fontWeight="600" fill={Colors.blue}>멘토관</SvgText>
      <Rect x="240" y="265" width="60" height="44" rx="3" fill="#fff" stroke={Colors.blue} strokeWidth="1.5" />
      <SvgText x="270" y="291" textAnchor="middle" fontSize="9" fontWeight="600" fill={Colors.blue}>유담관</SvgText>
      <Rect x="250" y="360" width="70" height="38" rx="3" fill="#F0F2F7" stroke="#B6C2D2" strokeWidth="0.6" />
      <SvgText x="285" y="383" textAnchor="middle" fontSize="9" fontWeight="600" fill="#6B7587">IT관</SvgText>
      <Rect x="100" y="360" width="50" height="36" rx="3" fill="#F0F2F7" stroke="#B6C2D2" strokeWidth="0.6" />
      <SvgText x="125" y="382" textAnchor="middle" fontSize="9" fontWeight="600" fill="#6B7587">도서관</SvgText>
      <Rect x="280" y="180" width="50" height="30" rx="3" fill="#F0F2F7" stroke="#B6C2D2" strokeWidth="0.6" />
      <SvgText x="305" y="199" textAnchor="middle" fontSize="9" fontWeight="600" fill="#6B7587">학생회관</SvgText>
      <Path d="M95 245 Q 130 240 165 245 Q 200 260 220 280 Q 240 295 260 297" stroke={Colors.blue} strokeWidth="4" fill="none" strokeLinecap="round" />
      <Path d="M95 245 Q 130 240 165 245 Q 200 260 220 280 Q 240 295 260 297" stroke="#fff" strokeWidth="1.5" fill="none" strokeDasharray="4 6" strokeLinecap="round" />
      <Path d="M95 245 Q 90 300 110 340 Q 160 380 220 355 Q 250 330 260 297" stroke={Colors.silver} strokeWidth="3" fill="none" strokeDasharray="2 4" opacity="0.7" />
      <Circle cx="165" cy="245" r="9" fill="#fff" stroke={Colors.warn} strokeWidth="1.5" />
      <SvgText x="165" y="249" textAnchor="middle" fontSize="9" fontWeight="700" fill={Colors.warn}>≡</SvgText>
      <Circle cx="220" cy="280" r="9" fill="#fff" stroke={Colors.success} strokeWidth="1.5" />
      <SvgText x="220" y="284" textAnchor="middle" fontSize="9" fontWeight="700" fill={Colors.success}>↕</SvgText>
      <Circle cx="95" cy="245" r="9" fill={Colors.blue} />
      <Circle cx="95" cy="245" r="5" fill="#fff" />
      <Circle cx="260" cy="297" r="11" fill="#fff" stroke={Colors.blue} strokeWidth="3" />
      <Circle cx="260" cy="297" r="5" fill={Colors.blue} />
    </Svg>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────────

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<RouteProfile>('balanced');
  const route = ROUTES[profile];

  return (
    <View className="flex-1" style={{ backgroundColor: '#E8EFF6' }}>
      {/* Map */}
      <View className="flex-1 relative">
        <CampusMap />

        {/* Search bar overlay */}
        <View className="absolute left-4 right-4" style={{ top: insets.top + 8 }}>
          <View
            className="h-9.5 rounded-xl bg-sch-card flex-row items-center px-3 gap-2"
            style={{
              height: 38, borderWidth: 0.5, borderColor: Colors.line,
              shadowColor: Colors.ink, shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.12, shadowRadius: 5, elevation: 3,
            }}
          >
            <IconSymbol name="search" size={14} color={Colors.ink3} />
            <Text className="flex-1 text-sm font-semibold text-sch-ink" style={{ letterSpacing: -0.2 }}>
              유담관 411
            </Text>
            <Text className="text-xs text-sch-ink4">다음 강의</Text>
          </View>
        </View>

        {/* Location pin */}
        <View className="absolute" style={{ top: '48%', left: '20%' }}>
          <View className="py-0.5 px-2 rounded-full bg-sch-blue" style={{ paddingVertical: 3, paddingHorizontal: 8 }}>
            <Text className="text-xs font-bold text-white" style={{ fontSize: 10, letterSpacing: -0.1 }}>
              현 위치 · 멘토관
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom sheet */}
      <View
        className="bg-sch-card rounded-t-2xl px-lg"
        style={{
          paddingBottom: insets.bottom + 16,
          maxHeight: SCREEN_H * 0.58,
          shadowColor: Colors.ink, shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1, shadowRadius: 12, elevation: 8,
        }}
      >
        {/* Handle */}
        <View className="w-9 h-1 rounded-full bg-sch-line self-center my-2" />

        {/* Route summary */}
        <View className="pb-1">
          <Text className="text-xs font-bold text-sch-blue-sky" style={{ letterSpacing: 1.5 }}>
            CAMPUS · A* OPTIMAL
          </Text>
          <View className="flex-row items-baseline gap-2 mt-1">
            <Text className="font-bold text-sch-ink" style={{ fontSize: 26, letterSpacing: -0.8 }}>
              {route.duration}
            </Text>
            <Text className="text-sm text-sch-ink3">· 멘토관 → 유담관 411</Text>
          </View>
        </View>

        {/* Terrain stats */}
        <View className="flex-row gap-2 py-3.5">
          {[
            { icon: 'stairs'   as const, value: route.stairs,    label: '계단' },
            { icon: 'elevator' as const, value: route.elevators, label: '엘리베이터' },
            { icon: 'slope'    as const, value: route.slope,     label: '경사도' },
          ].map((s, i) => (
            <View key={i} className="flex-1 bg-sch-bg rounded-xl p-2.5 gap-1">
              <IconSymbol name={s.icon} size={16} color={Colors.blue} />
              <Text className="font-bold text-sch-ink" style={{ fontSize: 18, letterSpacing: -0.5 }}>
                {String(s.value)}
              </Text>
              <Text className="text-sch-ink3 font-semibold" style={{ fontSize: 10.5 }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Profile selector */}
        <View className="mb-3">
          <Text className="text-xs font-bold text-sch-ink3 mb-2" style={{ letterSpacing: 1 }}>ROUTE PROFILE</Text>
          <View className="flex-row gap-1.5">
            {(['fast', 'balanced', 'accessible'] as RouteProfile[]).map((p) => {
              const r = ROUTES[p];
              const selected = profile === p;
              return (
                <TouchableOpacity
                  key={p}
                  onPress={() => setProfile(p)}
                  className="flex-1 border border-sch-line bg-sch-card rounded-xl py-2.5 px-1 items-center gap-0.5"
                  style={selected ? { borderWidth: 1.5, borderColor: Colors.blue, backgroundColor: 'rgba(38,83,156,0.06)' } : { borderWidth: 1 }}
                >
                  <Text className="text-xs font-bold" style={{ color: selected ? Colors.blue : Colors.ink, letterSpacing: -0.2 }}>
                    {r.label}
                  </Text>
                  <Text className="text-xs text-sch-ink3">{r.duration}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Steps */}
        <ScrollView style={{ maxHeight: 160, marginBottom: 12 }} showsVerticalScrollIndicator={false}>
          <Text className="text-xs font-bold text-sch-ink3 mb-2" style={{ letterSpacing: 1 }}>STEPS</Text>
          {route.steps.map((step, idx) => (
            <View
              key={idx}
              className="flex-row items-center gap-3 py-2.5"
              style={idx < route.steps.length - 1 ? { borderBottomWidth: 0.5, borderBottomColor: Colors.lineSoft } : undefined}
            >
              <View
                className="w-7 h-7 rounded-lg items-center justify-center"
                style={{ backgroundColor: step.isWarning ? 'rgba(199,134,30,0.12)' : 'rgba(38,83,156,0.08)' }}
              >
                <IconSymbol
                  name={step.icon as any}
                  size={14}
                  color={step.isWarning ? Colors.warn : Colors.blue}
                />
              </View>
              <Text className="flex-1 text-sm text-sch-ink" style={{ letterSpacing: -0.2 }}>
                {step.description}
              </Text>
              <Text className="text-xs text-sch-ink3 font-semibold">{step.time}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Start button */}
        <TouchableOpacity
          className="h-12 rounded-xl bg-sch-blue flex-row items-center justify-center gap-2"
          style={{ height: 50 }}
        >
          <IconSymbol name="arrow" size={16} color="#fff" />
          <Text className="text-base font-bold text-white" style={{ letterSpacing: -0.3 }}>안내 시작</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
