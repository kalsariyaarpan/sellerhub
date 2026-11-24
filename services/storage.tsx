import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { PlatformId } from '../constants/platforms';
import type { MockAccount } from './auth';

export const languages = { en: 'English', hi: 'हिन्दी', gu: 'ગુજરાતી' } as const;
export const regions = {
  IN: { name: 'India', currency: 'INR (₹)', timezone: 'Asia/Kolkata' },
  GB: { name: 'United Kingdom', currency: 'GBP (£)', timezone: 'Europe/London' },
  US: { name: 'United States', currency: 'USD ($)', timezone: 'America/New_York' },
  AE: { name: 'United Arab Emirates', currency: 'AED', timezone: 'Asia/Dubai' },
} as const;

type State = {
  language: keyof typeof languages | null;
  region: keyof typeof regions | null;
  session: string | null;
  accounts: Record<string, MockAccount>;
  workspaces: Record<string, { selected: PlatformId[]; recent: PlatformId[] }>;
  theme: 'system' | 'light' | 'dark';
  notifications: boolean;
};

const initial: State = { language: null, region: null, session: null, accounts: {}, workspaces: {}, theme: 'system', notifications: false };
const key = 'seller-hub:v1';
type Update = (change: (state: State) => State) => Promise<void>;
const Context = createContext<{ state: State; ready: boolean; error: string; update: Update } | null>(null);

export function StorageProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initial);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const saved = useRef(state);
  const queue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    AsyncStorage.getItem(key).then(value => {
      saved.current = value ? { ...initial, ...JSON.parse(value) } : initial;
      setState(saved.current);
    }).catch(() => setError('Saved settings could not be read. Close and reopen Seller Hub.'))
      .finally(() => setReady(true));
  }, []);

  const update: Update = change => {
    const result = queue.current.then(async () => {
      const next = change(saved.current);
      await AsyncStorage.setItem(key, JSON.stringify(next));
      saved.current = next;
      setState(next);
    });
    queue.current = result.catch(() => {});
    return result;
  };
  return <Context.Provider value={{ state, ready, error, update }}>{children}</Context.Provider>;
}

export function useStorage() {
  const context = useContext(Context);
  if (!context) throw new Error('StorageProvider is required');
  return context;
}
