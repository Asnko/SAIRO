import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants';
import { IconSymbol } from '@/components/ui';
import { useAuthStore } from '@/store/auth';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    setError('');
    setLoading(true);
    const result = await login(username.trim(), password);
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? '로그인에 실패했습니다.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <LinearGradient
        colors={[Colors.blueDeep, Colors.blue, '#2D5FB0']}
        style={{ flex: 1, paddingTop: insets.top }}
      >
        <View className="absolute inset-0 opacity-5" pointerEvents="none" />

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, paddingTop: 40, paddingBottom: insets.bottom + 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 로고 */}
          <View className="items-center mb-9 gap-2">
            <View
              className="w-18 h-18 rounded-2xl items-center justify-center mb-1"
              style={{
                width: 72, height: 72,
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
              }}
            >
              <Text className="text-3xl font-black text-white" style={{ letterSpacing: -1 }}>SCH</Text>
            </View>
            <Text className="text-3xl font-extrabold text-white" style={{ letterSpacing: -0.8 }}>Campus AI</Text>
            <Text className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>순천향대학교 캠퍼스 AI</Text>
          </View>

          {/* 카드 */}
          <View
            className="bg-sch-card rounded-3xl p-6"
            style={{
              shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15, shadowRadius: 24, elevation: 8,
            }}
          >
            <Text className="text-2xl font-bold text-sch-ink mb-1" style={{ letterSpacing: -0.5 }}>로그인</Text>
            <Text className="text-sm text-sch-ink3 mb-6">아이디와 비밀번호를 입력하세요</Text>

            {/* 아이디 */}
            <View className="mb-4">
              <Text className="text-xs font-semibold text-sch-ink2 mb-1.5" style={{ letterSpacing: 0.2 }}>아이디</Text>
              <View
                className="flex-row items-center gap-2.5 h-12 rounded-xl border border-sch-line bg-sch-bg px-3.5"
                style={{ height: 50 }}
              >
                <IconSymbol name="user" size={18} color={Colors.ink3} />
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder="아이디 입력"
                  placeholderTextColor={Colors.ink4}
                  keyboardType="default"
                  returnKeyType="next"
                  className="flex-1 text-base text-sch-ink"
                  style={{ letterSpacing: -0.2 }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* 비밀번호 */}
            <View className="mb-4">
              <Text className="text-xs font-semibold text-sch-ink2 mb-1.5" style={{ letterSpacing: 0.2 }}>비밀번호</Text>
              <View
                className="flex-row items-center gap-2.5 h-12 rounded-xl border border-sch-line bg-sch-bg px-3.5"
                style={{ height: 50 }}
              >
                <IconSymbol name="settings" size={18} color={Colors.ink3} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="비밀번호"
                  placeholderTextColor={Colors.ink4}
                  secureTextEntry={!showPw}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  className="flex-1 text-base text-sch-ink"
                />
                <TouchableOpacity onPress={() => setShowPw((v) => !v)}>
                  <IconSymbol name={showPw ? 'check' : 'close'} size={18} color={Colors.ink3} />
                </TouchableOpacity>
              </View>
            </View>

            {/* 에러 */}
            {!!error && (
              <View
                className="flex-row items-center gap-1.5 rounded-xl p-2.5 mb-4"
                style={{ backgroundColor: 'rgba(194,56,74,0.08)', borderWidth: 1, borderColor: 'rgba(194,56,74,0.2)' }}
              >
                <IconSymbol name="close" size={14} color={Colors.danger} />
                <Text className="flex-1 text-sm font-medium" style={{ color: Colors.danger }}>{error}</Text>
              </View>
            )}

            {/* 로그인 버튼 */}
            <TouchableOpacity
              className="h-12 rounded-xl bg-white border border-sch-blue flex-row items-center justify-center gap-2 mt-1"
              style={{ height: 52, borderWidth: 1.5, opacity: loading ? 0.6 : 1 }}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={Colors.blue} />
              ) : (
                <>
                  <Text className="text-base font-bold text-sch-blue" style={{ letterSpacing: -0.3 }}>로그인</Text>
                  <IconSymbol name="arrow" size={18} color={Colors.blue} />
                </>
              )}
            </TouchableOpacity>

            {/* 구분선 */}
            <View className="flex-row items-center gap-2.5 my-5">
              <View className="flex-1 h-px bg-sch-line" />
              <Text className="text-xs text-sch-ink3 font-medium">계정이 없으신가요?</Text>
              <View className="flex-1 h-px bg-sch-line" />
            </View>

            {/* 회원가입 */}
            <TouchableOpacity
              className="h-12 rounded-xl bg-sch-blue items-center justify-center"
              style={{ height: 50 }}
              onPress={() => router.push('/auth/register')}
              activeOpacity={0.8}
            >
              <Text className="text-base font-bold text-white" style={{ letterSpacing: -0.3 }}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
