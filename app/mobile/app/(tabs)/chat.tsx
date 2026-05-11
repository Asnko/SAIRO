import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ListRenderItem,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants';
import { IconSymbol } from '@/components/ui';
import type { ChatMessage, ChatSource } from '@/types';

// ── Mock data ────────────────────────────────────────────────────────────────

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: '1', role: 'assistant', text: '안녕! 뭐 궁금한 거 있어? 학사·장학·시간표 다 물어봐도 돼 :)', timestamp: new Date() },
  { id: '2', role: 'user',      text: '복수전공 신청은 언제까지인가요?', timestamp: new Date() },
  {
    id: '3', role: 'assistant',
    text: '2026학년도 1학기 복수전공 신청은 5월 12일 09시 ~ 5월 16일 18시까지 가능합니다.',
    sources: [
      { tag: '학사규정', title: '2026학년도 학사력 §3.2' },
      { tag: '공지',     title: '복수·부전공 신청 안내 (4/29)' },
    ],
    timestamp: new Date(),
  },
  { id: '4', role: 'user',      text: '제 평점으로 가능한 전공이 뭐가 있나요?', timestamp: new Date() },
  { id: '5', role: 'assistant', text: '학생의 직전 학기 평점 3.62 기준으로 신청 가능한 학과를 정리하고 있어요…', isTyping: true, timestamp: new Date() },
];

const SUGGESTED_CHIPS = ['수강신청 정정', '졸업요건 확인', '도서관 좌석', '시험 일정', '장학금 종류'];

// ── Sub-components ───────────────────────────────────────────────────────────

function SourceItem({ source }: { source: ChatSource }) {
  return (
    <View className="flex-row items-center gap-1.5">
      <View className="py-0.5 px-1.5 rounded" style={{ backgroundColor: 'rgba(38,83,156,0.08)' }}>
        <Text className="text-xs font-bold" style={{ fontSize: 9, color: Colors.blue }}>
          {source.tag}
        </Text>
      </View>
      <Text className="flex-1 text-sch-ink2" style={{ fontSize: 11.5, letterSpacing: -0.1 }} numberOfLines={1}>
        {source.title}
      </Text>
      <IconSymbol name="link" size={11} color={Colors.ink4} />
    </View>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === 'user') {
    return (
      <View className="items-end self-end" style={{ maxWidth: '78%' }}>
        <View
          className="py-2.5 px-3.5"
          style={{ backgroundColor: Colors.blue, borderRadius: 18, borderBottomRightRadius: 4 }}
        >
          <Text className="text-sm text-white" style={{ lineHeight: 20, letterSpacing: -0.2 }}>
            {message.text}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="self-start" style={{ maxWidth: '88%' }}>
      <View
        className="py-3 px-3.5 bg-sch-card border border-sch-line"
        style={{ borderRadius: 18, borderBottomLeftRadius: 4 }}
      >
        <Text className="text-sm text-sch-ink" style={{ lineHeight: 21, letterSpacing: -0.2 }}>
          {message.text}
        </Text>
        {message.isTyping && (
          <View className="flex-row gap-1 mt-1.5 items-center">
            {[0, 1, 2].map((i) => (
              <View key={i} className="w-1.5 h-1.5 rounded-full bg-sch-ink4" style={{ width: 5, height: 5 }} />
            ))}
          </View>
        )}
        {message.sources && message.sources.length > 0 && (
          <View
            className="mt-2.5 pt-2.5 gap-1.5"
            style={{ borderTopWidth: 0.5, borderTopColor: Colors.lineSoft }}
          >
            <Text className="font-bold text-sch-ink4" style={{ fontSize: 10, letterSpacing: 1, marginBottom: 2 }}>
              SOURCES
            </Text>
            {message.sources.map((s, i) => <SourceItem key={i} source={s} />)}
          </View>
        )}
      </View>
    </View>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────────

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList>(null);

  const sendMessage = useCallback(() => {
    const text = draft.trim();
    if (!text) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text, timestamp: new Date() };
    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text: '관련 학사 자료 4건을 참고하여 정리해드릴게요. 평점 3.62 기준, 다음 학과가 신청 가능합니다: AI빅데이터학과, 산업경영공학과, 미디어커뮤니케이션학과.',
      sources: [{ tag: '내신가능학과', title: '복수전공 가능학과 매트릭스 2026-1' }],
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setDraft('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, [draft]);

  const renderItem: ListRenderItem<ChatMessage> = useCallback(
    ({ item }) => <MessageBubble message={item} />,
    [],
  );

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-sch-bg"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View
        className="flex-row items-center gap-2.5 px-base pb-3 bg-sch-card"
        style={{ paddingTop: insets.top + 8, borderBottomWidth: 0.5, borderBottomColor: Colors.line }}
      >
        <TouchableOpacity
          className="items-center justify-center bg-sch-card border border-sch-line rounded-xl"
          style={{ width: 34, height: 34, borderWidth: 0.5 }}
          onPress={() => router.push('/(tabs)/home')}
        >
          <IconSymbol name="back" size={18} color={Colors.ink} />
        </TouchableOpacity>

        <View className="w-9 h-9 rounded-xl bg-sch-blue items-center justify-center">
          <IconSymbol name="sparkle" size={18} color="#fff" />
        </View>

        <View className="flex-1">
          <Text className="text-sm font-bold text-sch-ink" style={{ letterSpacing: -0.3 }}>SCH-AI</Text>
          <View className="flex-row items-center gap-1">
            <View className="w-1.5 h-1.5 rounded-full bg-sch-success" />
            <Text className="text-xs font-semibold text-sch-success">RAG · 학사규정 v2026.1</Text>
          </View>
        </View>

        <TouchableOpacity
          className="items-center justify-center bg-sch-card border border-sch-line rounded-xl"
          style={{ width: 38, height: 38, borderWidth: 0.5 }}
        >
          <IconSymbol name="settings" size={18} color={Colors.ink2} />
        </TouchableOpacity>
      </View>

      {/* Suggested chips */}
      <FlatList
        horizontal
        data={SUGGESTED_CHIPS}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="border border-sch-line bg-sch-bg py-1.5 px-3 rounded-full"
            style={{ borderWidth: 1 }}
          >
            <Text className="text-xs font-semibold text-sch-ink2">{item}</Text>
          </TouchableOpacity>
        )}
        style={{ backgroundColor: Colors.card, borderBottomWidth: 0.5, borderBottomColor: Colors.line }}
      />

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Composer */}
      <View
        className="flex-row items-center gap-2 px-3 pt-2 bg-sch-card"
        style={{ paddingBottom: insets.bottom + 8, borderTopWidth: 0.5, borderTopColor: Colors.line }}
      >
        <TouchableOpacity
          className="items-center justify-center bg-sch-card border border-sch-line rounded-xl"
          style={{ width: 38, height: 38, borderWidth: 0.5 }}
        >
          <IconSymbol name="plus" size={20} color={Colors.ink2} />
        </TouchableOpacity>

        <View
          className="flex-1 flex-row items-center pl-4 pr-1.5 bg-sch-bg border border-sch-line"
          style={{ height: 42, borderRadius: 21, borderWidth: 0.5 }}
        >
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={sendMessage}
            placeholder="SCH-AI에게 물어보기"
            placeholderTextColor={Colors.ink4}
            returnKeyType="send"
            className="flex-1 text-sm text-sch-ink"
            style={{ letterSpacing: -0.2 }}
            multiline={false}
          />
          <TouchableOpacity
            className="w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: draft.trim() ? Colors.blue : Colors.cardSubtle }}
            onPress={sendMessage}
          >
            <IconSymbol name="arrow" size={16} color={draft.trim() ? '#fff' : Colors.ink4} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="items-center justify-center bg-sch-card border border-sch-line rounded-xl"
          style={{ width: 38, height: 38, borderWidth: 0.5 }}
        >
          <IconSymbol name="mic" size={20} color={Colors.ink2} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
