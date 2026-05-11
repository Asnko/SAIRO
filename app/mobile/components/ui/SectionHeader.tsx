import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, action, onAction }: SectionHeaderProps) {
  return (
    <View className="flex-row items-baseline justify-between px-lg mb-2.5">
      <Text className="text-lg font-bold tracking-tight text-sch-ink">
        {title}
      </Text>
      {action && (
        <TouchableOpacity onPress={onAction} className="flex-row items-center">
          <Text className="text-sm font-semibold text-sch-ink3">{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
