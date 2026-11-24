import { router } from 'expo-router';
import { useState } from 'react';
import { Brand, Button, Field, Label, Page } from './ui';
import { createMockAccount, verifyMockPassword } from '../services/auth';
import { useStorage } from '../services/storage';

export function AuthForm({ mode }: { mode: 'login' | 'signup' | 'reset' }) {
  const { state, update } = useStorage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const signup = mode === 'signup';
  const reset = mode === 'reset';

  async function submit() {
    const address = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) return setMessage('Enter a valid email address.');
    if (reset) return setMessage('Demo accounts are local to this phone. Email recovery requires a live authentication service.');
    if (signup && !name.trim()) return setMessage('Enter your name.');
    if (password.length < 8) return setMessage('Use at least eight characters.');
    setBusy(true);
    setMessage('');
    try {
      if (signup) {
        const account = await createMockAccount(name.trim(), address, password);
        await update(current => {
          if (current.accounts[address]) throw new Error('An account already exists for this email.');
          return { ...current, session: address, accounts: { ...current.accounts, [address]: account } };
        });
      } else {
        const account = state.accounts[address];
        if (!account || !await verifyMockPassword(account, password)) return setMessage('Email or password is incorrect.');
        await update(current => ({ ...current, session: address }));
      }
    } catch (error) {
      setMessage(error instanceof Error && error.message.startsWith('An account') ? error.message : 'Could not save your session. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return <Page title={reset ? 'Forgot password' : signup ? 'Create your account' : 'Welcome to Seller Hub'}
    subtitle="Use a separate password for your local Seller Hub demo account.">
    <Brand />
    {signup && <Field placeholder="Full name" value={name} onChangeText={setName} autoComplete="name" />}
    <Field placeholder="Email address" value={email} onChangeText={setEmail} autoCapitalize="none" autoComplete="email" keyboardType="email-address" />
    {!reset && <Field placeholder="Password" value={password} onChangeText={setPassword} secret autoCapitalize="none" />}
    {!!message && <Label>{message}</Label>}
    <Button text={reset ? 'Check recovery options' : signup ? 'Sign up' : 'Log in'} disabled={busy} onPress={() => void submit()} />
    {mode === 'login' ? <>
      <Button text="Create an account" secondary onPress={() => router.push('/auth/signup')} />
      <Button text="Forgot password" secondary onPress={() => router.push('/auth/forgot-password')} />
    </> : <Button text="Back to log in" secondary onPress={() => router.back()} />}
  </Page>;
}
