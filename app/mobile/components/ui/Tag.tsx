import React from 'react';
import { View, Text } from 'react-native';
import { TagTones } from '@/constants';
import type { TagTone } from '@/constants';

interface TagProps {
  children: React.ReactNode;
  tone?: TagTone;
  size?: 'sm' | 'md';
}

export function Tag({ children, tone = 'neutral', size = 'sm' }: TagProps) {
  const colors = TagTones[tone];
  const isSmall = size === 'sm';

  return (
    <View
      className="rounded-full self-start"
      style={{
        backgroundColor: colors.bg,
        paddingVertical: isSmall ? 3 : 5,
        paddingHorizontal: isSmall ? 8 : 10,
      }}
    >
      <Text
        className="font-semibold"
        style={{
          color: colors.fg,
          fontSize: isSmall ? 10 : 12,
          letterSpacing: -0.1,
        }}
      >
        {children}
      </Text>
    </View>
  );
}
