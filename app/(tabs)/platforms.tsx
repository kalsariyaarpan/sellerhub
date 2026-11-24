import { router } from 'expo-router';
import { useState } from 'react';
import { Button, Field, Label, Page, PlatformCard } from '../../components/ui';
import { platforms } from '../../constants/platforms';
import { usePlatforms } from '../../hooks/usePlatforms';

export default function MyPlatforms() {
  const [query, setQuery] = useState('');
  const { selected, remove } = usePlatforms();
  const visible = platforms.filter(platform => selected.includes(platform.id) && platform.name.toLowerCase().includes(query.trim().toLowerCase()));
  return <Page title="My Platforms" subtitle="Open and manage your seller workspaces.">
    <Field placeholder="Search platforms" value={query} onChangeText={setQuery} />
    <Button text="Add platform" onPress={() => router.push('/platform/add')} />
    {visible.length === 0 && <Label muted>{selected.length ? 'No platforms match your search.' : 'Add a marketplace to start using its seller portal.'}</Label>}
    {visible.map(platform => <PlatformCard key={platform.id} platform={platform} status="Added">
      <Button text={`Open ${platform.name}`} onPress={() => router.push({ pathname: '/platform/workspace', params: { id: platform.id } })} />
      <Button text="Remove" secondary onPress={() => remove(platform.id)} />
    </PlatformCard>)}
  </Page>;
}
