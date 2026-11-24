import { router } from 'expo-router';
import { useState } from 'react';
import { Button, Label, Page } from './ui';
import { languages, regions, useStorage } from '../services/storage';

export function Preferences({ kind }: { kind: 'language' | 'region' }) {
  const { state, update } = useStorage();
  const [language, setLanguage] = useState(state.language ?? 'en');
  const [region, setRegion] = useState(state.region ?? 'IN');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  async function save() {
    setSaving(true);
    setError('');
    try {
      await update(current => ({ ...current, ...(kind === 'language' ? { language } : { region }) }));
      if (state.session) router.back();
      else router.replace(kind === 'language' ? '/onboarding/region' : '/auth/login');
    } catch {
      setError('Could not save your preference. Try again.');
    } finally {
      setSaving(false);
    }
  }
  return <Page title={kind === 'language' ? 'Choose your language' : 'Choose your region'}
    subtitle={kind === 'language' ? 'Select a preferred language.' : 'Set your country, currency and timezone.'}>
    {kind === 'language'
      ? (Object.keys(languages) as (keyof typeof languages)[]).map(key =>
        <Button key={key} text={languages[key]} secondary={language !== key} onPress={() => setLanguage(key)} />)
      : <>
        {(Object.keys(regions) as (keyof typeof regions)[]).map(key =>
          <Button key={key} text={regions[key].name} secondary={region !== key} onPress={() => setRegion(key)} />)}
        <Label muted>{regions[region].currency} · {regions[region].timezone}</Label>
      </>}
    {!!error && <Label>{error}</Label>}
    <Button text={state.session ? 'Save changes' : 'Continue'} disabled={saving} onPress={() => void save()} />
    {state.session && <Button text="Cancel" secondary onPress={() => router.back()} />}
  </Page>;
}
