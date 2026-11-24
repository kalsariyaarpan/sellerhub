import { router } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { Button, Label, Page, PlatformCard, purple } from '../../components/ui';
import { platforms } from '../../constants/platforms';
import { usePlatforms } from '../../hooks/usePlatforms';
import { useStorage } from '../../services/storage';

export default function Home() {
  const { state } = useStorage();
  const { selected, recent } = usePlatforms();
  const account = state.session ? state.accounts[state.session] : undefined;
  return <Page title="Seller Hub" subtitle="Every Marketplace. One App.">
    <View style={styles.hero}>
      <Text style={styles.hello}>Welcome, {account?.name ?? 'seller'}</Text>
      <Text style={styles.caption}>{selected.length} {selected.length === 1 ? 'saved marketplace' : 'saved marketplaces'}</Text>
    </View>
    <Label size={21}>My Platforms</Label>
    <Button text="Add platform" onPress={() => router.push('/platform/add')} />
    <Button text="View my platforms" secondary onPress={() => router.navigate('/platforms')} />
    <Label size={21}>Recently opened</Label>
    {recent.length === 0 && <Label muted>Marketplaces you open will appear here.</Label>}
    {recent.map(id => {
      const platform = platforms.find(item => item.id === id);
      return platform && <PlatformCard key={id} platform={platform}>
        <Button text={`Open ${platform.name}`} onPress={() => router.push({ pathname: '/platform/workspace', params: { id } })} />
      </PlatformCard>;
    })}
    <Button text="Profile and preferences" secondary onPress={() => router.navigate('/settings')} />
  </Page>;
}
const styles = StyleSheet.create({
  hero: { backgroundColor: purple, padding: 22, borderRadius: 20, gap: 8 },
  hello: { color: '#FFF', fontSize: 25, fontWeight: '700' },
  caption: { color: '#F1E9FF', fontSize: 15 },
});
