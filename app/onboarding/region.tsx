import { Redirect } from 'expo-router';
import { Preferences } from '../../components/Preferences';
import { useStorage } from '../../services/storage';
export default function Region() {
  const { state } = useStorage();
  return state.language ? <Preferences kind="region" /> : <Redirect href="/onboarding/language" />;
}
