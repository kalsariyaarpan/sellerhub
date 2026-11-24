import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useColorScheme, type TextInputProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, Layers3 } from 'lucide-react-native';
import { useStorage } from '../services/storage';
import type { Platform } from '../constants/platforms';

export const purple = '#7047EB';
export function usePalette() {
  const { state } = useStorage();
  const system = useColorScheme();
  const dark = state.theme === 'dark' || (state.theme === 'system' && system === 'dark');
  return dark ? { bg: '#171322', panel: '#241E33', ink: '#F9F6FF', muted: '#BDB1D0', line: '#3D3350' }
    : { bg: '#FFFFFF', panel: '#F5F0FF', ink: '#211837', muted: '#635874', line: '#E8E0F3' };
}

export function Label({ children, size = 16, muted = false }: { children: ReactNode; size?: number; muted?: boolean }) {
  const c = usePalette();
  return <Text style={{ color: muted ? c.muted : c.ink, fontSize: size, fontWeight: size >= 20 ? '700' : '500' }}>{children}</Text>;
}

export function Page({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const c = usePalette();
  return <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: c.bg }}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.page}>
      <Label size={32}>{title}</Label>
      {subtitle && <Label muted>{subtitle}</Label>}
      {children}
    </ScrollView>
  </SafeAreaView>;
}

export function Button({ text, onPress, secondary = false, disabled = false }: { text: string; onPress: () => void; secondary?: boolean; disabled?: boolean }) {
  const c = usePalette();
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}
    style={({ pressed }) => [styles.button, { backgroundColor: secondary ? c.panel : purple, opacity: disabled ? 0.5 : pressed ? 0.8 : 1 }]}>
    <Text style={{ color: secondary ? c.ink : '#FFF', fontSize: 15, fontWeight: '700' }}>{text}</Text>
  </Pressable>;
}

export function Field({ secret, ...props }: TextInputProps & { secret?: boolean }) {
  const c = usePalette();
  const [shown, setShown] = useState(false);
  const Icon = shown ? EyeOff : Eye;
  return <View style={[styles.field, { borderColor: c.line }]}>
    <TextInput {...props} accessibilityLabel={props.accessibilityLabel ?? props.placeholder} placeholderTextColor={c.muted}
      secureTextEntry={secret && !shown} style={{ flex: 1, minHeight: 52, color: c.ink, fontSize: 16 }} />
    {secret && <Pressable accessibilityRole="button" accessibilityLabel={shown ? 'Hide password' : 'Show password'} onPress={() => setShown(!shown)} hitSlop={10}><Icon color={c.muted} size={20} /></Pressable>}
  </View>;
}

export function Brand() {
  return <View style={styles.brand}><Layers3 color="#fff" size={38} /></View>;
}

export function Spinner() {
  return <ActivityIndicator color={purple} />;
}

export function Mark({ platform }: { platform: Platform }) {
  return <View style={[styles.mark, { backgroundColor: platform.color }]}><Text style={styles.markText}>{platform.mark}</Text></View>;
}

export function PlatformCard({ platform, status, children }: { platform: Platform; status?: string; children: ReactNode }) {
  const c = usePalette();
  return <View style={[styles.card, { borderColor: c.line, backgroundColor: c.bg }]}>
    <View style={styles.row}><Mark platform={platform} /><View style={{ flex: 1, gap: 3 }}>
      <Label size={20}>{platform.name}</Label>
      <Label size={13} muted>{status ?? platform.description}</Label>
    </View></View>
    <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>{children}</View>
  </View>;
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: 22, paddingTop: 24, paddingBottom: 36, gap: 16 },
  button: { minHeight: 46, borderRadius: 13, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center' },
  field: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 13, paddingHorizontal: 14 },
  brand: { width: 76, height: 76, borderRadius: 23, backgroundColor: purple, justifyContent: 'center', alignItems: 'center' },
  mark: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  markText: { color: '#fff', fontSize: 19, fontWeight: '800' },
  card: { borderWidth: 1, borderRadius: 18, padding: 14, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
