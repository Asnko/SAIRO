/**
 * IconSymbol — wraps @expo/vector-icons/Ionicons
 * Maps the prototype's icon names to Ionicons equivalents.
 */
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleProp, TextStyle } from 'react-native';

// Prototype icon name → Ionicons name mapping
const ICON_MAP = {
  home:      'home-outline',
  chat:      'chatbubble-ellipses-outline',
  map:       'map-outline',
  cal:       'calendar-outline',
  note:      'document-text-outline',
  user:      'person-outline',
  bell:      'notifications-outline',
  search:    'search-outline',
  arrow:     'arrow-forward-outline',
  chev:      'chevron-forward-outline',
  chevD:     'chevron-down-outline',
  chevL:     'chevron-back-outline',
  plus:      'add-outline',
  sparkle:   'sparkles-outline',
  mic:       'mic-outline',
  location:  'location-outline',
  stairs:    'footsteps-outline',
  elevator:  'git-commit-outline',
  slope:     'trending-up-outline',
  book:      'book-outline',
  clock:     'time-outline',
  link:      'link-outline',
  flag:      'flag-outline',
  check:     'checkmark-outline',
  send:      'send-outline',
  image:     'image-outline',
  settings:  'settings-outline',
  graph:     'bar-chart-outline',
  close:     'close-outline',
  back:      'chevron-back-outline',
} as const;

export type IconName = keyof typeof ICON_MAP;

interface IconSymbolProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export function IconSymbol({ name, size = 22, color = 'currentColor', style }: IconSymbolProps) {
  const ionName = ICON_MAP[name] as React.ComponentProps<typeof Ionicons>['name'];
  return <Ionicons name={ionName} size={size} color={color} style={style} />;
}
