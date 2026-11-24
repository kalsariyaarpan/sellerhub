import { Tabs } from 'expo-router';
import { House, Settings, Store } from 'lucide-react-native';
import { purple, usePalette } from '../../components/ui';

export default function TabLayout() {
  const c = usePalette();
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: purple, tabBarInactiveTintColor: c.muted,
    tabBarStyle: { backgroundColor: c.bg, borderTopColor: c.line } }}>
    <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <House {...{ color, size }} /> }} />
    <Tabs.Screen name="platforms" options={{ title: 'Platforms', tabBarIcon: ({ color, size }) => <Store {...{ color, size }} /> }} />
    <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: ({ color, size }) => <Settings {...{ color, size }} /> }} />
  </Tabs>;
}
