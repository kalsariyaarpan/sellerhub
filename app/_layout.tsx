import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StorageProvider, useStorage } from '../services/storage';
import { usePalette } from '../components/ui';

function Routes() {
  const { state, ready, error } = useStorage();
  const c = usePalette();
  const usable = ready && !error;
  return <>
    <StatusBar style={c.bg === '#FFFFFF' ? 'dark' : 'light'} />
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg } }}>
      <Stack.Screen name="index" />
      <Stack.Protected guard={usable}>
        <Stack.Screen name="onboarding/language" />
        <Stack.Screen name="onboarding/region" />
      </Stack.Protected>
      <Stack.Protected guard={usable && !!state.region && !state.session}>
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/signup" />
        <Stack.Screen name="auth/forgot-password" />
      </Stack.Protected>
      <Stack.Protected guard={usable && !!state.session}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="platform/add" />
        <Stack.Screen name="platform/workspace" />
      </Stack.Protected>
    </Stack>
  </>;
}
export default function Layout() {
  return <StorageProvider><Routes /></StorageProvider>;
}
