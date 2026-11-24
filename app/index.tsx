import { Redirect } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Brand, Label, Spinner } from '../components/ui';
import { useStorage } from '../services/storage';

export default function Splash() {
  const { state, ready, error } = useStorage();
  if (ready && !error) {
    if (!state.language) return <Redirect href="/onboarding/language" />;
    if (!state.region) return <Redirect href="/onboarding/region" />;
    return <Redirect href={state.session ? '/home' : '/auth/login'} />;
  }
  return <View style={styles.center}>
    <Brand /><Label size={36}>Seller Hub</Label><Label muted>Every Marketplace. One App.</Label>
    {error ? <Label>{error}</Label> : <Spinner />}
  </View>;
}
const styles = StyleSheet.create({ center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 26 } });
