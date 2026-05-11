/**
 * ServerPingBanner
 * 홈 화면 상단에 표시되는 서버 연결 상태 배너.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants';
import { IconSymbol } from '@/components/ui';
import { ping, type PingResponse } from '@/lib/api/client';

type Status = 'idle' | 'loading' | 'ok' | 'error';

const STATUS_BG: Record<Status, string> = {
  idle:    'bg-sch-card-subtle border-sch-line',
  loading: 'border-blue-200',
  ok:      'border-green-200',
  error:   'border-red-200',
};

const STATUS_BG_STYLE: Record<Status, string> = {
  idle:    '',
  loading: 'rgba(38,83,156,0.06)',
  ok:      'rgba(31,138,91,0.08)',
  error:   'rgba(194,56,74,0.08)',
};

const LABEL_COLOR: Record<Status, string> = {
  idle:    Colors.ink3,
  loading: Colors.blue,
  ok:      Colors.success,
  error:   Colors.danger,
};

export function ServerPingBanner() {
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<PingResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const checkConnection = async () => {
    setStatus('loading');
    setResult(null);
    setErrorMsg('');
    const { data, error } = await ping();
    if (data) {
      setResult(data);
      setStatus('ok');
    } else {
      setErrorMsg(error ?? '연결 실패');
      setStatus('error');
    }
  };

  useEffect(() => { checkConnection(); }, []);

  return (
    <View
      className={`flex-row items-center justify-between mx-base mb-base py-2.5 px-3.5 rounded-md border ${STATUS_BG[status]}`}
      style={STATUS_BG_STYLE[status] ? { backgroundColor: STATUS_BG_STYLE[status] } : undefined}
    >
      <View className="flex-row items-center gap-2.5 flex-1">
        {status === 'loading' ? (
          <ActivityIndicator size="small" color={Colors.blue} />
        ) : (
          <IconSymbol
            name={status === 'ok' ? 'check' : status === 'error' ? 'close' : 'sparkle'}
            size={16}
            color={LABEL_COLOR[status]}
          />
        )}
        <View className="flex-1 gap-0.5">
          <Text className="text-sm font-semibold" style={{ color: LABEL_COLOR[status], letterSpacing: -0.2 }}>
            {status === 'loading' && '서버 연결 확인 중…'}
            {status === 'ok'      && result?.message}
            {status === 'error'   && `연결 실패: ${errorMsg}`}
            {status === 'idle'    && '서버 상태 확인 전'}
          </Text>
          {status === 'ok' && result && (
            <Text className="text-xs text-sch-ink3 font-medium">
              {result.server} · v{result.version}
            </Text>
          )}
        </View>
      </View>

      {(status === 'ok' || status === 'error') && (
        <TouchableOpacity
          onPress={checkConnection}
          className="py-1 px-2.5 rounded bg-black/5"
        >
          <Text className="text-xs font-semibold text-sch-ink2">재시도</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
