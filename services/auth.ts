import * as Crypto from 'expo-crypto';

export type MockAccount = { name: string; email: string; salt: string; digest: string };

function digest(password: string, salt: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, salt + ':' + password);
}

// Demo accounts are device-local. Replace this module with a backend for production authentication.
export async function createMockAccount(name: string, email: string, password: string): Promise<MockAccount> {
  const salt = Crypto.randomUUID();
  return { name, email, salt, digest: await digest(password, salt) };
}

export async function verifyMockPassword(account: MockAccount, password: string) {
  return account.digest === await digest(password, account.salt);
}
