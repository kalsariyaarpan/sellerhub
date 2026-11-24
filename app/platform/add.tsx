import { router } from 'expo-router';
import { Button, Page, PlatformCard } from '../../components/ui';
import { platforms } from '../../constants/platforms';
import { usePlatforms } from '../../hooks/usePlatforms';

export default function AddPlatform() {
  const { selected, add, remove } = usePlatforms();
  return <Page title="Add platforms" subtitle="Choose the seller portals you want to keep handy.">
    <Button text="Done" secondary onPress={() => router.canGoBack() ? router.back() : router.replace('/platforms')} />
    {platforms.map(platform => {
      const added = selected.includes(platform.id);
      return <PlatformCard key={platform.id} platform={platform} status={added ? platform.description + ' · Added' : undefined}>
        <Button text={added ? 'Remove' : `Add ${platform.name}`} secondary={added} onPress={() => added ? remove(platform.id) : add(platform.id)} />
      </PlatformCard>;
    })}
  </Page>;
}
