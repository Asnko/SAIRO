import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  onPress?: () => void;
  className?: string;
}

export function Card({ children, style, padding = 16, onPress, className = '' }: CardProps) {
  const base =
    'bg-sch-card rounded-xl border border-sch-line shadow-sm ' + className;

  const content = (
    <View className={base} style={[{ padding }, style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}
