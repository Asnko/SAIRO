import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants';
import { Card, Tag, SectionHeader, IconSymbol } from '@/components/ui';
import { ServerPingBanner } from '@/components/ServerPingBanner';
import { useAuthStore, logout } from '@/store/auth';
import type { IconName } from '@/components/ui';

// ── Mock data ────────────────────────────────────────────────────────────────

const QUICK_ACTIONS: { label: string; icon: IconName; route: string }[] = [
  { label: 'AI 상담',  icon: 'chat',     route: '/(tabs)/chat' },
  { label: '경로',     icon: 'location', route: '/(tabs)/map' },
  { label: '시간표',   icon: 'cal',      route: '/(tabs)/schedule' },
  { label: '메모',     icon: 'note',     route: '/(tabs)/notes' },
];

const NOTICES = [
  { tag: '장학', tone: 'gold'   as const, date: '5월 6일', title: '2026-1 성적우수장학금 신청 (~5/15)', summary: '직전 학기 평점 3.8 이상 대상. 포털에서 신청서 제출.' },
  { tag: '학사', tone: 'blue'   as const, date: '5월 5일', title: '수강신청 정정기간 안내',             summary: '5월 11일 09:00 부터 5월 13일 18:00 까지' },
  { tag: '행사', tone: 'purple' as const, date: '5월 4일', title: '향(向)림 학술제 부스 참가 모집',    summary: 'IT융합대 학생회 주관, 5/22-23' },
];

// ── Account Modal ─────────────────────────────────────────────────────────────

function AccountModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { user } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => { onClose(); await logout(); },
      },
    ]);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        className="flex-1 justify-end"
        style={{ backgroundColor: 'rgba(15,26,46,0.45)' }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          className="bg-sch-card rounded-t-3xl p-6 pb-10"
        >
          {/* 프로필 */}
          <View className="flex-row items-center gap-4 mb-5">
            <View className="w-14 h-14 rounded-full bg-sch-blue items-center justify-center">
              <Text className="text-xl font-bold text-white">{user?.initials ?? '??'}</Text>
            </View>
            <View className="flex-1 gap-0.5">
              <Text className="text-lg font-bold text-sch-ink" style={{ letterSpacing: -0.4 }}>
                {user?.first_name ?? '사용자'} 학생
              </Text>
              <Text className="text-sm text-sch-ink3 font-medium">{user?.username}</Text>
              <Text className="text-xs text-sch-ink4">{user?.department_display}</Text>
            </View>
          </View>

          <View className="h-px bg-sch-line my-4" />

          <View className="flex-row items-center gap-2.5 py-1.5">
            <IconSymbol name="link" size={16} color={Colors.ink3} />
            <Text className="text-sm text-sch-ink2 flex-1">{user?.email}</Text>
          </View>
          <View className="flex-row items-center gap-2.5 py-1.5">
            <IconSymbol name="graph" size={16} color={Colors.ink3} />
            <Text className="text-sm text-sch-ink2 flex-1">평점 {user?.gpa}</Text>
          </View>

          <View className="h-px bg-sch-line my-4" />

          <TouchableOpacity
            className="flex-row items-center gap-2.5 py-3 px-4 rounded-xl mt-1"
            style={{ backgroundColor: 'rgba(194,56,74,0.08)', borderWidth: 1, borderColor: 'rgba(194,56,74,0.2)' }}
            onPress={handleLogout}
          >
            <IconSymbol name="close" size={18} color={Colors.danger} />
            <Text className="text-base font-semibold" style={{ color: Colors.danger }}>로그아웃</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const [accountVisible, setAccountVisible] = useState(false);

  const displayName = user?.first_name ?? '학생';
  const initials    = user?.initials ?? '??';

  return (
    <>
      <ScrollView
        className="flex-1 bg-sch-bg"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          className="flex-row items-start justify-between px-lg pb-lg"
          style={{ paddingTop: insets.top + 8 }}
        >
          <View>
            <Text className="text-sm text-sch-ink3 font-semibold" style={{ letterSpacing: 0.5 }}>
              {new Date().toLocaleDateString('ko-KR', {
                month: 'long', day: 'numeric', weekday: 'long',
              }).toUpperCase()}
            </Text>
            <Text
              className="mt-1 text-3xl font-bold text-sch-ink"
              style={{ letterSpacing: -0.8, lineHeight: 34 }}
            >
              안녕하세요,{'\n'}
              <Text className="text-sch-ink font-bold">{displayName} </Text>
              <Text className="text-sch-ink3 font-medium">학생</Text>
            </Text>
          </View>
          <View className="flex-row gap-2 items-center mt-1">
            <TouchableOpacity className="w-9.5 h-9.5 rounded-xl border border-sch-line bg-sch-card items-center justify-center"
              style={{ width: 38, height: 38 }}>
              <IconSymbol name="bell" size={20} color={Colors.ink} />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-9.5 h-9.5 rounded-full bg-sch-blue items-center justify-center"
              style={{ width: 38, height: 38 }}
              onPress={() => setAccountVisible(true)}
              activeOpacity={0.8}
            >
              <Text className="text-sm font-bold text-white">{initials}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Server banner */}
        <ServerPingBanner />

        {/* AI Briefing Hero */}
        <View className="px-base mb-5">
          <TouchableOpacity onPress={() => router.push('/(tabs)/chat')} activeOpacity={0.9}>
            <LinearGradient
              colors={[Colors.blueDeep, Colors.blue, Colors.purple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 22, padding: 20, overflow: 'hidden' }}
            >
              <View className="flex-row items-center gap-2 mb-3.5">
                <View
                  className="w-5.5 h-5.5 rounded items-center justify-center"
                  style={{ width: 22, height: 22, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 6 }}
                >
                  <IconSymbol name="sparkle" size={14} color="#fff" />
                </View>
                <Text className="text-xs font-bold text-white" style={{ letterSpacing: 2 }}>
                  SCH·AI BRIEFING
                </Text>
              </View>
              <Text className="text-lg font-bold text-white mb-2" style={{ lineHeight: 26, letterSpacing: -0.4 }}>
                {displayName}아, 오늘 하루 미리 정리했어 ✦
              </Text>
              <Text className="text-sm text-white/85" style={{ lineHeight: 21, letterSpacing: -0.2 }}>
                비 와서 멘토관 가는 길 좀 미끄러울 듯. 5분만 일찍 나가자.
              </Text>
              <View className="flex-row flex-wrap gap-1.5 mt-3.5">
                {['☂️ 강수 70%', '🚶 +5분', '📍 멘토관 → 유담관'].map((t) => (
                  <View
                    key={t}
                    className="py-1 px-2 rounded-full"
                    style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                  >
                    <Text className="text-xs font-semibold text-white">{t}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View className="flex-row gap-2 px-base mb-5">
          {QUICK_ACTIONS.map((a) => (
            <TouchableOpacity
              key={a.label}
              className="flex-1 border border-sch-line bg-sch-card rounded-2xl py-3.5 px-1.5 items-center gap-1.5"
              style={{ borderWidth: 0.5 }}
              onPress={() => router.push(a.route as any)}
              activeOpacity={0.75}
            >
              <View
                className="w-9 h-9 rounded-xl items-center justify-center"
                style={{ backgroundColor: 'rgba(38,83,156,0.08)' }}
              >
                <IconSymbol name={a.icon} size={20} color={Colors.blue} />
              </View>
              <Text className="text-xs font-semibold text-sch-ink" style={{ letterSpacing: -0.2 }}>
                {a.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Next Up */}
        <SectionHeader title="Next" action="시간표 전체" onAction={() => router.push('/(tabs)/schedule')} />
        <View className="px-base mb-5 gap-2">
          <Card padding={0}>
            <View className="flex-row">
              <View className="w-1.5 rounded-tl-xl rounded-bl-xl" style={{ backgroundColor: Colors.blueSky }} />
              <View className="flex-1 p-3.5 gap-1">
                <View className="flex-row items-center justify-between mb-1">
                  <Tag tone="sky">전공필수 · 진행중</Tag>
                  <Text className="text-xs font-semibold" style={{ color: Colors.blueSky }}>10:30 → 11:45</Text>
                </View>
                <Text className="font-bold text-sch-ink" style={{ fontSize: 15.5, letterSpacing: -0.3 }}>인공지능 개론</Text>
                <View className="flex-row items-center gap-1.5 mt-1">
                  <IconSymbol name="location" size={12} color={Colors.ink3} />
                  <Text className="text-xs text-sch-ink3">멘토관 503 · 박지민 교수</Text>
                </View>
              </View>
            </View>
          </Card>
          <Card padding={14}>
            <View className="flex-row items-center justify-between mb-1">
              <Tag tone="neutral">전공선택 · 다음</Tag>
              <Text className="text-xs font-semibold text-sch-ink3">13:00 → 14:15</Text>
            </View>
            <Text className="font-bold text-sch-ink" style={{ fontSize: 15.5, letterSpacing: -0.3 }}>데이터베이스 시스템</Text>
            <View className="flex-row items-center gap-1.5 mt-1">
              <IconSymbol name="location" size={12} color={Colors.ink3} />
              <Text className="text-xs text-sch-ink3">유담관 411 · 도보 8분 (계단 36)</Text>
            </View>
          </Card>
        </View>

        {/* Notices */}
        <SectionHeader title="Notice" action="모두 보기" />
        <View className="px-base mb-5 gap-2">
          {NOTICES.map((n, i) => (
            <Card key={i} padding={14} onPress={() => {}}>
              <View className="flex-row items-center justify-between mb-1.5">
                <View className="flex-row items-center gap-1.5">
                  <Tag tone={n.tone}>{n.tag}</Tag>
                  <Text className="text-xs text-sch-ink4 font-medium">{n.date}</Text>
                </View>
                <IconSymbol name="chev" size={14} color={Colors.ink4} />
              </View>
              <Text className="text-sm font-semibold text-sch-ink" style={{ letterSpacing: -0.2 }}>{n.title}</Text>
              <Text className="text-xs text-sch-ink3 mt-0.5" style={{ lineHeight: 18 }}>{n.summary}</Text>
            </Card>
          ))}
        </View>

        {/* Insight */}
        <SectionHeader title="Insight" />
        <View className="px-base mb-5">
          <Card padding={16}>
            <View className="flex-row items-center gap-1.5 mb-2">
              <IconSymbol name="graph" size={16} color={Colors.purple} />
              <Text className="text-xs font-bold" style={{ letterSpacing: 1.5, color: Colors.purple }}>CONTEXT CHAIN</Text>
            </View>
            <Text className="text-sm font-semibold text-sch-ink mb-2" style={{ letterSpacing: -0.2 }}>
              지난 주 메모 12개에서{' '}
              <Text style={{ color: Colors.purple }}>'역전파'</Text> 이해도가 낮아요.
            </Text>
            <Text className="text-xs text-sch-ink3 mb-3" style={{ lineHeight: 18 }}>
              관련 강의 자료 3개와 작성하신 메모 5개를 묶어 복습 카드로 정리했습니다.
            </Text>
            <TouchableOpacity
              className="self-start py-2 px-3.5 rounded-xl"
              style={{ borderWidth: 1, borderColor: 'rgba(77,32,122,0.2)', backgroundColor: 'rgba(77,32,122,0.06)' }}
            >
              <Text className="text-xs font-bold" style={{ color: Colors.purple }}>복습 카드 열기 →</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </ScrollView>

      <AccountModal visible={accountVisible} onClose={() => setAccountVisible(false)} />
    </>
  );
}
