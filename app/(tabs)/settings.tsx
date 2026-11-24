import { router } from 'expo-router';
import { Alert, Switch, View } from 'react-native';
import { Button, Label, Page, purple } from '../../components/ui';
import { languages, regions, useStorage } from '../../services/storage';

export default function Settings() {
  const { state, update } = useStorage();
  const profile = state.session ? state.accounts[state.session] : undefined;
  const report = () => Alert.alert('Could not save settings', 'Please try again.');
  return <Page title="Settings">
    <Label size={21}>Profile</Label>
    <Label>{profile?.name}</Label>
    <Label muted>{profile?.email}</Label>
    <Button text={`Language · ${languages[state.language ?? 'en']}`} secondary onPress={() => router.push('/onboarding/language')} />
    <Button text={`Region · ${regions[state.region ?? 'IN'].name}`} secondary onPress={() => router.push('/onboarding/region')} />
    <Button text="Manage platforms" secondary onPress={() => router.navigate('/platforms')} />
    <Label size={21}>Appearance</Label>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {(['system', 'light', 'dark'] as const).map(theme => <Button key={theme} text={theme[0].toUpperCase() + theme.slice(1)}
        secondary={state.theme !== theme} onPress={() => { void update(current => ({ ...current, theme })).catch(report); }} />)}
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Label size={21}>Notifications</Label>
      <Switch accessibilityLabel="Notification preference" value={state.notifications} trackColor={{ true: purple }}
        onValueChange={notifications => { void update(current => ({ ...current, notifications })).catch(report); }} />
    </View>
    <Label muted>Notification preference is saved on this device. This version has no notification service.</Label>
    <Label size={21}>About Seller Hub</Label>
    <Label muted>Version 1.0.0 · Every Marketplace. One App.</Label>
    <Button text="Log out" secondary onPress={() => { void update(current => ({ ...current, session: null })).catch(report); }} />
  </Page>;
}
