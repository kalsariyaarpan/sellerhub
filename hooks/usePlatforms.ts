import { Alert } from 'react-native';
import type { PlatformId } from '../constants/platforms';
import { useStorage } from '../services/storage';

const empty = { selected: [], recent: [] };

export function usePlatforms() {
  const { state, update } = useStorage();
  const workspace = state.session ? state.workspaces[state.session] ?? empty : empty;
  function edit(change: (current: { selected: PlatformId[]; recent: PlatformId[] }) => { selected: PlatformId[]; recent: PlatformId[] }) {
    const email = state.session;
    if (!email) return;
    void update(current => {
      if (current.session !== email) return current;
      return { ...current, workspaces: { ...current.workspaces, [email]: change(current.workspaces[email] ?? empty) } };
    }).catch(() => Alert.alert('Could not save platforms', 'Please try again.'));
  }
  return {
    ...workspace,
    add: (id: PlatformId) => edit(current => ({ ...current, selected: [...new Set([...current.selected, id])] })),
    remove: (id: PlatformId) => edit(current => ({
      selected: current.selected.filter(item => item !== id),
      recent: current.recent.filter(item => item !== id),
    })),
    recordOpen: (id: PlatformId) => edit(current => current.selected.includes(id)
      ? { ...current, recent: [id, ...current.recent.filter(item => item !== id)] }
      : current),
  };
}
