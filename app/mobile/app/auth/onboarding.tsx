import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants';
import { IconSymbol } from '@/components/ui';

const { width: W } = Dimensions.get('window');

// ── Slide data ────────────────────────────────────────────────────────────────

const SLIDES = [
  {
    eyebrow: 'Welcome',
    title: '캠퍼스 라이프를\n초밀착으로.',
    subtitle: '전공·시간표·학습 데이터·캠퍼스 지형까지\n하나의 흐름으로 연결합니다.',
    art: 'pulse' as const,
  },
  {
    eyebrow: 'Proactive',
    title: '능동형 AI 비서.',
    subtitle: '묻기 전에 먼저 안내합니다.\nSCH-AI가 다음 강의·이동·과제를 미리 짚어드립니다.',
    art: 'orbit' as const,
  },
  {
    eyebrow: 'Begin',
    title: '지금 시작하세요.',
    subtitle: '순천향대학교 구성원이라면\n누구나 무료로 사용할 수 있습니다.',
    art: 'login' as const,
  },
];

// ── Art components ────────────────────────────────────────────────────────────

function PulseArt() {
  return (
    <View className="w-56 h-56 relative items-center justify-center">
      {[0, 1, 2, 3].map((i) => (
        <View
          key={i}
          className="absolute rounded-full border border-sch-blue-light"
          style={{ top: i * 22, left: i * 22, right: i * 22, bottom: i * 22, opacity: 0.3 + i * 0.1 }}
        />
      ))}
      <View className="w-16 h-16 rounded-full bg-sch-blue-sky" />
    </View>
  );
}

function OrbitArt() {
  return (
    <View className="w-56 h-56 relative items-center justify-center">
      <View className="absolute w-48 h-24 rounded-full border border-sch-blue-light opacity-50"
        style={{ transform: [{ rotate: '-20deg' }] }} />
      <View className="absolute w-48 h-24 rounded-full border border-sch-blue-light opacity-50"
        style={{ transform: [{ rotate: '40deg' }] }} />
      <View className="w-20 h-20 rounded-full bg-white items-center justify-center">
        <Text className="text-2xl font-extrabold text-sch-blue" style={{ letterSpacing: -0.5 }}>AI</Text>
      </View>
      {[
        { top: '12%' as any, left: '8%' as any },
        { top: '70%' as any, left: '88%' as any },
        { top: '85%' as any, left: '20%' as any },
      ].map((pos, i) => (
        <View key={i} className="absolute w-3.5 h-3.5 rounded-full bg-sch-blue-light" style={pos} />
      ))}
    </View>
  );
}

function LoginArt() {
  return (
    <View className="w-56 h-56 items-center justify-center">
      <View
        className="w-48 bg-white rounded-2xl p-6 items-center gap-2"
        style={{
          shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12, shadowRadius: 20, elevation: 8,
        }}
      >
        <View className="w-14 h-14 rounded-xl bg-sch-blue items-center justify-center mb-1">
          <Text className="text-lg font-black text-white" style={{ letterSpacing: -0.5 }}>SCH</Text>
        </View>
        <Text className="text-lg font-extrabold text-sch-ink" style={{ letterSpacing: -0.5 }}>Campus AI</Text>
        <Text className="text-xs text-sch-ink3 font-medium">순천향대학교</Text>
        <View className="w-4/5 h-px bg-sch-line my-1" />
        <Text className="text-xs text-sch-blue font-semibold">학번으로 바로 시작</Text>
      </View>
    </View>
  );
}

const ART_MAP = { pulse: PulseArt, orbit: OrbitArt, login: LoginArt };

// ── Single slide ──────────────────────────────────────────────────────────────

function Slide({ item }: { item: typeof SLIDES[number] }) {
  const Art = ART_MAP[item.art];
  return (
    <View style={{ width: W, flex: 1 }}>
      <View className="flex-1 items-center justify-center" style={{ minHeight: 260 }}>
        <Art />
      </View>
      <View className="px-8 pb-4">
        <Text className="italic text-sm text-sch-blue-light mb-2" style={{ letterSpacing: 1 }}>
          {item.eyebrow}
        </Text>
        <Text className="text-4xl font-bold text-white mb-3" style={{ lineHeight: 38, letterSpacing: -1 }}>
          {item.title}
        </Text>
        <Text className="text-sm text-white/70" style={{ lineHeight: 22, letterSpacing: -0.2 }}>
          {item.subtitle}
        </Text>
      </View>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const isLast = index === SLIDES.length - 1;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / W);
    setIndex(newIndex);
  };

  const goNext = () => {
    if (isLast) return;
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  return (
    <>
      <StatusBar style="light" />
      <LinearGradient
        colors={[Colors.blueDeep, Colors.blue, '#2D5FB0']}
        style={{ flex: 1, paddingTop: insets.top }}
      >
        {/* 장식 그리드 */}
        <View className="absolute inset-0 opacity-5" pointerEvents="none" />

        <FlatList
          ref={listRef}
          data={SLIDES}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => <Slide item={item} />}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={{ flex: 1 }}
        />

        {/* 하단 컨트롤 */}
        <View className="px-7 pt-2 gap-4" style={{ paddingBottom: insets.bottom + 24 }}>
          {/* 점 인디케이터 */}
          <View className="flex-row gap-1.5">
            {SLIDES.map((_, i) => (
              <View
                key={i}
                className="h-1 rounded-full bg-white"
                style={{ flex: i === index ? 3 : 1, opacity: i === index ? 1 : 0.35 }}
              />
            ))}
          </View>

          {isLast ? (
            <View className="gap-2.5">
              <TouchableOpacity
                className="h-14 rounded-xl bg-white flex-row items-center justify-center gap-2"
                onPress={() => router.push('/auth/login')}
                activeOpacity={0.85}
              >
                <Text className="text-base font-bold text-sch-blue" style={{ letterSpacing: -0.3 }}>로그인</Text>
                <IconSymbol name="arrow" size={18} color={Colors.blue} />
              </TouchableOpacity>
              <TouchableOpacity
                className="h-12 rounded-xl items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }}
                onPress={() => router.push('/auth/register')}
                activeOpacity={0.85}
              >
                <Text className="text-base font-semibold text-white" style={{ letterSpacing: -0.2 }}>회원가입</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              className="h-14 rounded-xl bg-white flex-row items-center justify-center gap-2"
              onPress={goNext}
              activeOpacity={0.85}
            >
              <Text className="text-base font-bold text-sch-blue" style={{ letterSpacing: -0.3 }}>다음</Text>
              <IconSymbol name="arrow" size={18} color={Colors.blue} />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </>
  );
}
