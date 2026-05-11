import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants';
import { IconSymbol } from '@/components/ui';
import { register } from '@/store/auth';
import { api } from '@/lib/api/client';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Department { value: string; label: string; }

interface FormState {
  name: string;
  username: string;
  department: string;
  departmentLabel: string;
  email: string;
  verifyCode: string;
  password: string;
  passwordConfirm: string;
}

type Step = 'form' | 'verify';

const SCH_DOMAINS = ['@sch.ac.kr', '@asan.sch.ac.kr', '@mail.sch.ac.kr'];

// ── 전공 선택 모달 ────────────────────────────────────────────────────────────

function DeptModal({
  visible, departments, onSelect, onClose,
}: {
  visible: boolean; departments: Department[];
  onSelect: (dept: Department) => void; onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const filtered = departments.filter((d) =>
    d.label.includes(search) || d.value.includes(search.toLowerCase()),
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(15,26,46,0.5)' }}>
        <View className="bg-sch-card rounded-t-3xl p-5 pb-10">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-sch-ink" style={{ letterSpacing: -0.4 }}>전공 선택</Text>
            <TouchableOpacity
              className="w-8 h-8 rounded-xl bg-sch-card-subtle items-center justify-center"
              onPress={onClose}
            >
              <IconSymbol name="close" size={20} color={Colors.ink2} />
            </TouchableOpacity>
          </View>
          <View
            className="flex-row items-center gap-2 h-11 rounded-xl border border-sch-line bg-sch-bg px-3 mb-3"
            style={{ height: 44 }}
          >
            <IconSymbol name="search" size={16} color={Colors.ink3} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="전공 검색"
              placeholderTextColor={Colors.ink4}
              className="flex-1 text-sm text-sch-ink"
              autoCorrect={false}
            />
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex-row items-center justify-between py-3.5 px-1"
                onPress={() => { onSelect(item); onClose(); setSearch(''); }}
                activeOpacity={0.7}
              >
                <Text className="text-base text-sch-ink" style={{ letterSpacing: -0.2 }}>{item.label}</Text>
                <IconSymbol name="chev" size={14} color={Colors.ink4} />
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View className="h-px bg-sch-line-soft" />}
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 400 }}
          />
        </View>
      </View>
    </Modal>
  );
}

// ── 이메일 인증 단계 ──────────────────────────────────────────────────────────

function VerifyStep({
  email, onVerified, onBack,
}: {
  email: string; onVerified: () => void; onBack: () => void;
}) {
  const [code, setCode]           = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [sending, setSending]     = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => { sendCode(); }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const sendCode = async () => {
    setSending(true); setError('');
    const { error: err } = await api.post('/api/v1/auth/email/send-code/', { email });
    setSending(false);
    if (err) { setError(err); return; }
    setCountdown(60);
  };

  const verify = async () => {
    if (code.length !== 6) { setError('6자리 인증번호를 입력해주세요.'); return; }
    setLoading(true); setError('');
    const { error: err } = await api.post('/api/v1/auth/email/verify-code/', { email, code });
    setLoading(false);
    if (err) { setError(err); return; }
    onVerified();
  };

  return (
    <View className="items-center py-2">
      <View
        className="w-16 h-16 rounded-full items-center justify-center mb-4"
        style={{ backgroundColor: 'rgba(38,83,156,0.08)' }}
      >
        <Text style={{ fontSize: 28 }}>📧</Text>
      </View>
      <Text className="text-xl font-bold text-sch-ink mb-2" style={{ letterSpacing: -0.5 }}>이메일 인증</Text>
      <Text className="text-sm text-sch-ink3 text-center mb-6" style={{ lineHeight: 20 }}>
        <Text style={{ color: Colors.blue, fontWeight: '700' }}>{email}</Text>
        {'\n'}으로 발송된 6자리 코드를 입력하세요.
      </Text>

      <TextInput
        value={code}
        onChangeText={(v) => { setCode(v.replace(/\D/g, '').slice(0, 6)); setError(''); }}
        placeholder="000000"
        placeholderTextColor={Colors.ink4}
        keyboardType="number-pad"
        maxLength={6}
        className="w-full h-16 rounded-xl border bg-sch-bg text-sch-blue font-bold text-center mb-2"
        style={{
          height: 60, borderWidth: 1.5, borderColor: Colors.blue,
          fontSize: 28, letterSpacing: 8,
        }}
        textAlign="center"
      />

      {!!error && (
        <Text className="text-xs text-center mb-2" style={{ color: Colors.danger }}>{error}</Text>
      )}

      <TouchableOpacity
        onPress={sendCode}
        disabled={countdown > 0 || sending}
        className="py-2 mb-4"
      >
        <Text
          className="text-sm font-semibold"
          style={{ color: countdown > 0 ? Colors.ink4 : Colors.blue }}
        >
          {sending ? '발송 중…' : countdown > 0 ? `재발송 (${countdown}s)` : '인증번호 재발송'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-full h-12 rounded-xl bg-sch-blue items-center justify-center mb-3"
        style={{ height: 50, opacity: loading ? 0.6 : 1 }}
        onPress={verify}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-base font-bold text-white">인증 확인</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={onBack} className="py-2">
        <Text className="text-sm text-sch-ink3">← 이전으로</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── 필드 래퍼 ─────────────────────────────────────────────────────────────────

function Field({ label, hint, error, children }: {
  label: string; hint?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <View className="mb-4">
      <Text className="text-xs font-semibold text-sch-ink2 mb-1" style={{ letterSpacing: 0.2 }}>{label}</Text>
      {hint && <Text className="text-xs text-sch-ink3 mb-1.5" style={{ lineHeight: 16 }}>{hint}</Text>}
      {children}
      {!!error && <Text className="text-xs mt-1" style={{ color: Colors.danger, lineHeight: 16 }}>{error}</Text>}
    </View>
  );
}

// ── 메인 화면 ─────────────────────────────────────────────────────────────────

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();

  const [form, setForm] = useState<FormState>({
    name: '', username: '', department: '', departmentLabel: '',
    email: '', verifyCode: '', password: '', passwordConfirm: '',
  });
  const [errors, setErrors]       = useState<Partial<Record<keyof FormState, string>>>({});
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [step, setStep]           = useState<Step>('form');
  const [deptModal, setDeptModal] = useState(false);
  const [departments, setDepts]   = useState<Department[]>([]);

  useEffect(() => {
    api.get<Department[]>('/api/v1/auth/departments/').then(({ data }) => {
      if (data) setDepts(data);
    });
  }, []);

  const setField = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim())     e.name     = '이름을 입력해주세요.';
    if (!form.username.trim()) e.username = '아이디를 입력해주세요.';
    else if (!/^[a-zA-Z0-9_]{4,20}$/.test(form.username))
      e.username = '영문·숫자·밑줄 4~20자로 입력해주세요.';
    if (!form.department)      e.department = '전공을 선택해주세요.';
    if (!form.email.trim())    e.email = '이메일을 입력해주세요.';
    else if (!SCH_DOMAINS.some((d) => form.email.toLowerCase().endsWith(d)))
      e.email = '순천향대 이메일만 가능합니다.\n(@sch.ac.kr / @asan.sch.ac.kr / @mail.sch.ac.kr)';
    if (!form.password)        e.password = '비밀번호를 입력해주세요.';
    else if (form.password.length < 8) e.password = '8자 이상 입력해주세요.';
    if (form.password !== form.passwordConfirm)
      e.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goToVerify = () => { if (!validate()) return; setStep('verify'); };

  const handleRegister = async () => {
    setLoading(true);
    const result = await register({
      name:       form.name.trim(),
      username:   form.username.trim().toLowerCase(),
      department: form.department,
      email:      form.email.trim().toLowerCase(),
      password:   form.password,
    });
    setLoading(false);

    if (result.success) {
      setSuccess(true);
    } else if (result.fieldErrors) {
      const mapped: Partial<Record<keyof FormState, string>> = {};
      for (const [k, v] of Object.entries(result.fieldErrors)) {
        mapped[k as keyof FormState] = Array.isArray(v) ? v[0] : String(v);
      }
      setErrors(mapped);
      setStep('form');
    } else {
      setErrors({ name: result.error });
      setStep('form');
    }
  };

  // ── 가입 완료 ──────────────────────────────────────────────────────────────
  if (success) {
    return (
      <LinearGradient
        colors={[Colors.blueDeep, Colors.blue, '#2D5FB0']}
        style={{ flex: 1, paddingTop: insets.top }}
      >
        <View className="flex-1 items-center justify-center px-8 gap-4">
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-2"
            style={{ backgroundColor: 'rgba(31,138,91,0.15)', borderWidth: 2, borderColor: Colors.success }}
          >
            <IconSymbol name="check" size={36} color={Colors.success} />
          </View>
          <Text className="text-3xl font-bold text-white" style={{ letterSpacing: -0.8 }}>가입 완료!</Text>
          <Text className="text-base text-center" style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 22 }}>
            아이디와 비밀번호로{'\n'}로그인할 수 있습니다.
          </Text>
          <TouchableOpacity
            className="mt-4 h-14 rounded-xl bg-white flex-row items-center justify-center gap-2 px-8"
            style={{ height: 52 }}
            onPress={() => router.replace('/auth/login')}
          >
            <Text className="text-base font-bold text-sch-blue" style={{ letterSpacing: -0.3 }}>로그인하러 가기</Text>
            <IconSymbol name="arrow" size={18} color={Colors.blue} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  const inputBase = 'h-12 rounded-xl border border-sch-line bg-sch-bg px-3.5 text-base text-sch-ink';
  const inputError = { borderColor: Colors.danger, backgroundColor: 'rgba(194,56,74,0.04)' };

  return (
    <>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar style="light" />
        <LinearGradient
          colors={[Colors.blueDeep, Colors.blue, '#2D5FB0']}
          style={{ flex: 1, paddingTop: insets.top }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, paddingTop: 16, paddingBottom: insets.bottom + 24 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* 상단 바 */}
            <View className="flex-row items-center justify-between mb-6">
              <TouchableOpacity
                className="w-9 h-9 rounded-xl items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                onPress={() => step === 'verify' ? setStep('form') : router.back()}
              >
                <IconSymbol name="back" size={20} color="#fff" />
              </TouchableOpacity>
              <Text className="text-base font-bold text-white" style={{ letterSpacing: -0.3 }}>회원가입</Text>
              <View style={{ width: 36 }} />
            </View>

            {/* 카드 */}
            <View
              className="bg-sch-card rounded-3xl p-6"
              style={{
                shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15, shadowRadius: 24, elevation: 8,
              }}
            >
              {step === 'form' ? (
                <>
                  <Text className="text-2xl font-bold text-sch-ink mb-1" style={{ letterSpacing: -0.5 }}>계정 만들기</Text>
                  <Text className="text-sm text-sch-ink3 mb-6" style={{ lineHeight: 18 }}>
                    순천향대학교 구성원만 가입할 수 있습니다.
                  </Text>

                  <Field label="이름" error={errors.name}>
                    <TextInput
                      value={form.name} onChangeText={(v) => setField('name', v)}
                      placeholder="홍길동" placeholderTextColor={Colors.ink4}
                      className={inputBase} style={[{ height: 50, letterSpacing: -0.2 }, !!errors.name && inputError]}
                    />
                  </Field>

                  <Field label="아이디" hint="영문·숫자·밑줄(_) 4~20자" error={errors.username}>
                    <TextInput
                      value={form.username} onChangeText={(v) => setField('username', v)}
                      placeholder="예) sch_user01" placeholderTextColor={Colors.ink4}
                      autoCapitalize="none" autoCorrect={false}
                      className={inputBase} style={[{ height: 50, letterSpacing: -0.2 }, !!errors.username && inputError]}
                    />
                  </Field>

                  <Field label="전공" error={errors.department}>
                    <TouchableOpacity
                      className="h-12 rounded-xl border border-sch-line bg-sch-bg px-3.5 flex-row items-center justify-between"
                      style={[{ height: 50 }, !!errors.department && inputError]}
                      onPress={() => setDeptModal(true)}
                      activeOpacity={0.8}
                    >
                      <Text
                        className="text-base"
                        style={{ color: form.departmentLabel ? Colors.ink : Colors.ink4, letterSpacing: -0.2 }}
                      >
                        {form.departmentLabel || '전공을 선택하세요'}
                      </Text>
                      <IconSymbol name="chevD" size={16} color={Colors.ink3} />
                    </TouchableOpacity>
                  </Field>

                  <Field label="학교 이메일" hint="@sch.ac.kr · @asan.sch.ac.kr · @mail.sch.ac.kr" error={errors.email}>
                    <TextInput
                      value={form.email} onChangeText={(v) => setField('email', v)}
                      placeholder="example@sch.ac.kr" placeholderTextColor={Colors.ink4}
                      keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
                      className={inputBase} style={[{ height: 50, letterSpacing: -0.2 }, !!errors.email && inputError]}
                    />
                  </Field>

                  <Field label="비밀번호" hint="8자 이상" error={errors.password}>
                    <TextInput
                      value={form.password} onChangeText={(v) => setField('password', v)}
                      placeholder="비밀번호" placeholderTextColor={Colors.ink4}
                      secureTextEntry autoCapitalize="none"
                      className={inputBase} style={[{ height: 50, letterSpacing: -0.2 }, !!errors.password && inputError]}
                    />
                  </Field>

                  <Field label="비밀번호 확인" error={errors.passwordConfirm}>
                    <TextInput
                      value={form.passwordConfirm} onChangeText={(v) => setField('passwordConfirm', v)}
                      placeholder="비밀번호 재입력" placeholderTextColor={Colors.ink4}
                      secureTextEntry autoCapitalize="none"
                      className={inputBase} style={[{ height: 50, letterSpacing: -0.2 }, !!errors.passwordConfirm && inputError]}
                    />
                  </Field>

                  <TouchableOpacity
                    className="h-14 rounded-xl bg-sch-blue flex-row items-center justify-center gap-2 mt-2"
                    style={{ height: 52 }}
                    onPress={goToVerify}
                    activeOpacity={0.85}
                  >
                    <Text className="text-base font-bold text-white" style={{ letterSpacing: -0.3 }}>이메일 인증하기</Text>
                    <IconSymbol name="arrow" size={18} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="items-center mt-4 py-2"
                    onPress={() => router.back()}
                  >
                    <Text className="text-sm text-sch-ink3 font-medium">이미 계정이 있으신가요? 로그인</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <VerifyStep
                  email={form.email}
                  onVerified={handleRegister}
                  onBack={() => setStep('form')}
                />
              )}

              {loading && (
                <View
                  className="absolute inset-0 items-center justify-center rounded-3xl"
                  style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
                >
                  <ActivityIndicator color={Colors.blue} size="large" />
                </View>
              )}
            </View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>

      <DeptModal
        visible={deptModal}
        departments={departments}
        onSelect={(dept) => {
          setField('department', dept.value);
          setField('departmentLabel', dept.label);
        }}
        onClose={() => setDeptModal(false)}
      />
    </>
  );
}
