import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { IconSymbol } from '@/components/ui';
import type { IconName } from '@/components/ui';

interface TabConfig {
  name: string;
  title: string;
  icon: IconName;
}

const TABS: TabConfig[] = [
  { name: 'home',     title: '홈',     icon: 'home' },
  { name: 'chat',     title: 'SCH-AI', icon: 'chat' },
  { name: 'schedule', title: '시간표', icon: 'cal'  },
  { name: 'map',      title: '캠퍼스', icon: 'map'  },
  { name: 'notes',    title: '메모',   icon: 'note' },
];

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopWidth: 0.5,
          borderTopColor: Colors.line,
          height: 49 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          shadowColor: Colors.ink,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarActiveTintColor: Colors.blue,
        tabBarInactiveTintColor: Colors.ink3,
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '500',
          letterSpacing: -0.2,
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color }) => (
              <IconSymbol name={tab.icon} size={24} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
